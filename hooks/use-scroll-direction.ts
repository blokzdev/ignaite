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
 */
export function useScrollDirection(reveal = 80): boolean {
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
  }, [reveal]);

  return hidden;
}
