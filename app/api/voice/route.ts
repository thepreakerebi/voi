import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Accepts either:
// 1) audio/* body → STT → chat → TTS (binary response)
// 2) JSON { text: string, voice?: string } → TTS only (binary response)
export async function POST(req: NextRequest) {
  const [{ experimental_generateSpeech: generateSpeech, streamText }, { createOpenAI }, { env }, { z }, { appendMessage, getMessages }] = await Promise.all([
    import("ai"),
    import("@ai-sdk/openai"),
    import("@/lib/env"),
    import("zod"),
    import("@/lib/session-store"),
  ]);

  if (!env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Server not configured: OPENAI_API_KEY missing" }, { status: 500 });
  }
  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

  const contentType = req.headers.get("content-type") || "";
  // Rate limiting removed for development simplicity

  // TTS-only branch when JSON body is provided
  if (contentType.includes("application/json")) {
    const Body = z.object({
      sessionId: z.string().min(1).default("default"),
      text: z.string().min(1),
      voice: z.string().optional(),
      format: z.union([z.literal("mp3"), z.literal("wav"), z.string()]).optional(),
    });
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    const { sessionId, text, voice = "alloy", format = "mp3" } = parsed.data;

    const speech = await generateSpeech({
      model: openai.speech("gpt-4o-mini-tts"),
      text,
      voice,
      outputFormat: format,
    });

    // store assistant text in session
    appendMessage(sessionId, { role: "assistant", content: text });

    return new NextResponse(speech.audio.uint8Array.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": speech.audio.mediaType,
        "Cache-Control": "no-store",
      },
    });
  }

  // Voice: audio → STT → chat → TTS (JSON response with captions and audio base64)
  const audioArrayBuffer = await req.arrayBuffer();
  // Ignore tiny chunks that Whisper can't decode reliably
  if (audioArrayBuffer.byteLength < 10000) {
    return NextResponse.json({ userText: "", assistantText: "" });
  }

  // Use OpenAI REST transcription API directly for robust decoding of webm/opus chunks
  const form = new FormData();
  form.append("model", "whisper-1");
  form.append("language", "en");
  form.append("response_format", "json");
  const blob = new Blob([audioArrayBuffer], { type: contentType || "audio/webm" });
  form.append("file", blob, "chunk.webm");

  let transcriptText = "";
  try {
    const oaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: form,
    });
    if (oaiRes.ok) {
      const oaiJson = (await oaiRes.json()) as { text?: string };
      transcriptText = (oaiJson.text ?? "").toString();
    }
  } catch {}

  if (!transcriptText.trim()) {
    return NextResponse.json({ userText: "", assistantText: "" });
  }

  // capture optional session from query
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") ?? "default";
  const history = getMessages(sessionId);

  const chat = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: "You are Voi, a helpful voice assistant. Always respond in clear English." },
      ...history,
      { role: "user", content: transcriptText }
    ],
  });

  const answer = await chat.text;

  const speech = await generateSpeech({
    model: openai.speech("gpt-4o-mini-tts"),
    text: answer,
    voice: "alloy",
    outputFormat: "mp3",
  });

  // persist turn
  appendMessage(sessionId, { role: "user", content: transcriptText });
  appendMessage(sessionId, { role: "assistant", content: answer });

  // Return captions and audio as base64 for client playback
  const base64 = speech.audio.base64;
  return NextResponse.json({
    userText: transcriptText,
    assistantText: answer,
    audio: { base64, mediaType: speech.audio.mediaType },
  });
}


