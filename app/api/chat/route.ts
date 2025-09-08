import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/lib/env";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { appendMessage, getMessages } from "@/lib/session-store";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // Basic rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit({ key: `chat:${ip}`, limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const BodySchema = z.object({
    sessionId: z.string().min(1).default("default"),
    messages: z
      .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().min(1) }))
      .min(1),
  });

  const parse = BodySchema.safeParse(await req.json());
  if (!parse.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { sessionId, messages } = parse.data;

  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = openai("gpt-4o-mini");

  const history = getMessages(sessionId);
  const finalMessages = [...history, ...messages];
  const result = await streamText({ model, messages: finalMessages });

  // store last user + assistant text when finished; stream response directly
  const response = result.toTextStreamResponse();

  // Consume text asynchronously to append to session after completion
  result
    .text
    .then((assistantText) => {
      // append only the last user message and assistant reply
      const lastUser = messages.reverse().find((m) => m.role === "user");
      if (lastUser) appendMessage(sessionId, lastUser);
      appendMessage(sessionId, { role: "assistant", content: assistantText });
    })
    .catch(() => {});

  return response;
}


