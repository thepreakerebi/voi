import { NextRequest, NextResponse } from "next/server";
import { experimental_transcribe as transcribe, experimental_generateSpeech as generateSpeech, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/lib/env";

export const runtime = "edge";

// Accepts either:
// 1) audio/* body → STT → chat → TTS (binary response)
// 2) JSON { text: string, voice?: string } → TTS only (binary response)
export async function POST(req: NextRequest) {
  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

  const contentType = req.headers.get("content-type") || "";

  // TTS-only branch when JSON body is provided
  if (contentType.includes("application/json")) {
    const { text, voice = "alloy", format = "mp3" } = (await req.json()) as {
      text: string;
      voice?: string;
      format?: "mp3" | "wav" | (string & {});
    };

    const speech = await generateSpeech({
      model: openai.speech("gpt-4o-mini-tts"),
      text,
      voice,
      outputFormat: format,
    });

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

  const chat = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: transcript.text }],
  });

  const answer = await chat.text;

  const speech = await generateSpeech({
    model: openai.speech("gpt-4o-mini-tts"),
    text: answer,
    voice: "alloy",
    outputFormat: "mp3",
  });

  return new NextResponse(speech.audio.uint8Array, {
    headers: {
      "Content-Type": speech.audio.mediaType,
      "Cache-Control": "no-store",
    },
  });
}


