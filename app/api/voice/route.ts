import { NextRequest, NextResponse } from "next/server";
import { experimental_transcribe as transcribe, experimental_generateSpeech as generateSpeech, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/lib/env";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { appendMessage, getMessages } from "@/lib/session-store";

export const runtime = "edge";

// Accepts either:
// 1) audio/* body → STT → chat → TTS (binary response)
// 2) JSON { text: string, voice?: string } → TTS only (binary response)
export async function POST(req: NextRequest) {
  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

  const contentType = req.headers.get("content-type") || "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit({ key: `voice:${ip}`, limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

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

    return new NextResponse(speech.audio.uint8Array, {
      headers: {
        "Content-Type": speech.audio.mediaType,
        "Cache-Control": "no-store",
      },
    });
  }

  // Voice: audio → STT → chat → TTS
  const audioArrayBuffer = await req.arrayBuffer();

  const transcript = await transcribe({
    model: openai.transcription("gpt-4o-mini-transcribe"),
    audio: new Uint8Array(audioArrayBuffer),
  });

  // capture optional session from query
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") ?? "default";
  const history = getMessages(sessionId);

  const chat = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [...history, { role: "user", content: transcript.text }],
  });

  const answer = await chat.text;

  const speech = await generateSpeech({
    model: openai.speech("gpt-4o-mini-tts"),
    text: answer,
    voice: "alloy",
    outputFormat: "mp3",
  });

  // persist turn
  appendMessage(sessionId, { role: "user", content: transcript.text });
  appendMessage(sessionId, { role: "assistant", content: answer });

  return new NextResponse(speech.audio.uint8Array, {
    headers: {
      "Content-Type": speech.audio.mediaType,
      "Cache-Control": "no-store",
    },
  });
}


