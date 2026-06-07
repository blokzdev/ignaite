"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DURATION = 1300; // ms

// Counts 0 → value on mount with an easeOutExpo curve (long smooth tail, so it
// slows as it lands). SSR / no-JS / reduced-motion render the final value; the
// animation is the only client cost. Numeric only — inherits font from parent.
export function Counter({ value, className }: Readonly<{ value: number; className?: string }>) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) return; // display already initialized to the final value
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / DURATION);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setDisplay(Math.round(value * eased)); // first frame (t≈0) seeds ~0
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);

  return <span className={className}>{display}</span>;
}
