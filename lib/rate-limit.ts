type Key = string;

// Simple in-memory sliding window limiter. Suitable for single-instance dev.
const hits: Map<Key, number[]> = new Map();

export function rateLimit({ key, limit, windowMs }: { key: Key; limit: number; windowMs: number }) {
  const now = Date.now();
  const from = now - windowMs;
  const arr = hits.get(key) ?? [];
  const recent = arr.filter((t) => t > from);
  recent.push(now);
  hits.set(key, recent);
  const remaining = Math.max(0, limit - recent.length);
  const ok = recent.length <= limit;
  return { ok, remaining, resetMs: windowMs - (now - (recent[0] ?? now)) };
}


