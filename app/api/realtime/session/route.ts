import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { z } from "zod";

export const runtime = "edge";

// Generates an ephemeral OpenAI Realtime token.
// Client can use it to establish a WebRTC/WebSocket session directly with OpenAI.
export async function POST(req: NextRequest) {
  try {
    if (!env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Server not configured: OPENAI_API_KEY missing" }, { status: 500 });
    }
    // Rate limiting removed for development simplicity

    const Body = z
      .object({
        model: z.string().default("gpt-4o-realtime-preview-2024-12-17"),
        voice: z.string().default("alloy"),
        input_audio_format: z.enum(["pcm16", "wav", "webm-opus"]).default("webm-opus"),
        sample_rate_hz: z.number().int().positive().default(24000),
        turn_detection: z
          .object({ type: z.literal("server_vad"), silence_duration_ms: z.number().int().positive().default(500) })
          .optional(),
      });

    const raw = await req.json().catch(() => ({}));
    const parsed = Body.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { model, voice, input_audio_format, sample_rate_hz, turn_detection } = parsed.data;

    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, voice, input_audio_format, sample_rate_hz, turn_detection }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Failed to create session", detail: text }, { status: 500 });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


