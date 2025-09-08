import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "Missing OPENAI_API_KEY"),
});

export const env = (() => {
  const parsed = EnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
  if (!parsed.success) {
    // Throw a readable error early during cold start/build
    const message = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Env validation error: ${message}`);
  }
  return parsed.data;
})();


