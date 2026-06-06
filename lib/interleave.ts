// Round-robin items from `pool` into `items`. Deterministic by position — same
// inputs produce the same output, so SSR and client renders agree (no hydration
// mismatch) and growing `items` via infinite scroll never moves already-placed
// slots. Position 0 is always an item; the last position is never an ad.
//
// `interval` is either:
//   • a fixed number   → an ad every N positions (the original behaviour); or
//   • a jitter spec    → a *varied* gap in [min, max], drawn from a seeded PRNG.
//     The gap for ad #k depends only on `seed` + k (never on `Math.random()` or
//     `items.length`), so the cadence looks organic but stays SSR-stable and
//     append-stable across batches.
export interface JitterSpec {
  min: number;
  max: number;
  seed?: number;
}

// mulberry32 — tiny, fast, deterministic 32-bit PRNG. Good enough for spacing.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function interleave<A, S>(
  items: ReadonlyArray<A>,
  pool: ReadonlyArray<S>,
  interval: number | JitterSpec,
): ReadonlyArray<A | S> {
  if (pool.length === 0 || items.length === 0) return items;

  // Resolve a `gap(k)` fn: the spacing before ad #k. Fixed → constant; jitter →
  // a seeded integer in [min, max]. Bail to a no-op for nonsensical inputs.
  let gap: (k: number) => number;
  if (typeof interval === "number") {
    if (interval <= 0) return items;
    gap = () => interval;
  } else {
    const { min, max, seed = 1 } = interval;
    if (min <= 0 || max < min) return items;
    const rand = mulberry32(seed);
    const span = max - min + 1;
    // Pre-roll one value per ad slot so gaps depend only on k (stable order).
    const cache: number[] = [];
    gap = (k) => {
      while (cache.length <= k) cache.push(min + Math.floor(rand() * span));
      return cache[k];
    };
  }

  const result: Array<A | S> = [];
  let adIndex = 0;
  let nextAdAt = gap(0); // organic positions consumed before the next ad
  for (let i = 0; i < items.length; i++) {
    result.push(items[i]);
    const consumed = i + 1;
    if (consumed === nextAdAt && consumed < items.length) {
      result.push(pool[adIndex % pool.length]);
      adIndex++;
      nextAdAt += gap(adIndex);
    }
  }
  return result;
}
