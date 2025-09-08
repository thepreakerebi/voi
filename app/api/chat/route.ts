import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/lib/env";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  };

  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = openai("gpt-4o-mini");

  const result = await streamText({
    model,
    messages,
  });

  return result.toTextStreamResponse();
}


