// In-memory IP rate limiter. Functional in serverless but resets on cold
// starts and doesn't share state between regions — fine for the contact
// form's expected volume. TODO(polish): upgrade to @upstash/ratelimit
// once we want hardened protection. Tracked in BACKLOG.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the bucket resets, when `ok` is false. */
  retryAfter?: number;
}

export interface RateLimitOptions {
  /** Max allowed hits per window. Defaults to 5 (the contact-form default). */
  limit?: number;
  /** Window length in ms. Defaults to 60s. */
  windowMs?: number;
}

export function checkRateLimit(key: string, opts?: RateLimitOptions): RateLimitResult {
  const limit = opts?.limit ?? MAX_PER_WINDOW;
  const windowMs = opts?.windowMs ?? WINDOW_MS;
  const now = Date.now();
  const bucket = buckets.get(key);

  // Opportunistic GC so the Map doesn't grow forever on a long-lived process.
  if (buckets.size > 1024) {
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
  }

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}
