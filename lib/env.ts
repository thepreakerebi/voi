import { z } from "zod";

// Non-fatal env schema: allow missing in dev, routes will guard at request time.
const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
});

export const env = (() => {
  const parsed = EnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
  return parsed.success ? parsed.data : {};
})();


