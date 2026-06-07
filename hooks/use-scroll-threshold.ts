"use client";
import { useEffect, useState } from "react";

/**
 * Returns true once the window has scrolled past `threshold` pixels.
 * Generalizes the inline `window.scrollY > 8` check used by the site nav so
 * other chrome (sticky bars, scroll-aware headers) can share one listener shape.
 *
 * Pass `resetKey` (e.g. the current pathname) to re-read the position on
 * client-side navigation — the nav lives in a persistent layout, so otherwise
 * `passed` stays stale from the prior route until the next scroll event.
 */
export function useScrollThreshold(threshold = 8, resetKey?: unknown): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const onScroll = () => setPassed(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, resetKey]);

  return passed;
}
