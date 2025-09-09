import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  // Lazy-load heavy deps to avoid static-eval issues in Vercel Edge build
  const [{ streamText }, { createOpenAI }, { env }, { z }, { appendMessage, getMessages }] = await Promise.all([
    import("ai"),
    import("@ai-sdk/openai"),
    import("@/lib/env"),
    import("zod"),
    import("@/lib/session-store"),
  ]);

  const BodySchema = z.object({
    sessionId: z.string().min(1).default("default"),
    messages: z
      .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().min(1) }))
      .min(1),
  });

  const parse = BodySchema.safeParse(await req.json());
  if (!parse.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { sessionId, messages } = parse.data;

  if (!env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Server not configured: OPENAI_API_KEY missing" }, { status: 500 });
  }

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


