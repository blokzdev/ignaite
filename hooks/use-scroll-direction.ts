"use client";
import { useEffect, useState } from "react";

/**
 * Tracks scroll direction for an auto-hiding sticky header. Returns true when the
 * header should hide (scrolling down, past `reveal` px) and false when it should
 * show (scrolling up, or near the top). Consumers combine this with
 * `useReducedMotion()` so the header stays pinned for reduced-motion users.
 *
 * rAF-throttled with a small delta guard so momentum/sub-pixel jitter near the
 * direction boundary doesn't flicker the header.
 *
 * Pass `resetKey` (e.g. the current pathname) to re-baseline on client-side
 * navigation: the consuming nav lives in a persistent layout that never
 * remounts, so without this the closure's `last`/`ticking` and the scroll
 * listener carry over stale from the prior route and the auto-hide stops
 * tracking until a hard refresh. Re-running on `resetKey` re-attaches a fresh
 * listener; the browser's scroll-to-top on navigation then re-syncs visibility.
 */
export function useScrollDirection(reveal = 80, resetKey?: unknown): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y < reveal) {
        setHidden(false);
      } else if (Math.abs(y - last) > 4) {
        setHidden(y > last);
      }
      last = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reveal, resetKey]);

  return hidden;
}
