"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Stat = { value: number; label: string };

const TYPE = 75; // ms per label char typed
const DELETE = 40; // ms per label char deleted
const HOLD = 1900; // ms a full stat is held (reading time)
const PAUSE = 320; // ms after a label clears before the next types in
const ROLL = 800; // ms the number rolls prev → next (easeOutExpo)

// Perpetual "live stats" cell for the hero slab: cycles number + label together.
// The label types out/in (typewriter motif) while the number rolls to the next
// value. SSR / no-JS / reduced-motion render stats[0] statically. The animated
// pair is aria-hidden behind one stable sr-only summary; the loop pauses when
// scrolled out of view.
export function StatTicker({
  stats,
  valueClassName,
  labelClassName,
}: Readonly<{
  stats: ReadonlyArray<Stat>;
  valueClassName: string;
  labelClassName: string;
}>) {
  const reduced = useReducedMotion();
  const [num, setNum] = useState<number>(stats[0]?.value ?? 0);
  const [label, setLabel] = useState<string>(stats[0]?.label ?? "");
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced || stats.length === 0) return;
    const node = rootRef.current;
    let timer = 0;
    let roll = 0;
    let i = 0; // current stat index
    let n = stats[0].label.length; // chars of the label currently shown
    let phase: "hold" | "del" | "type" = "hold";

    // Roll the number prev → next over ROLL ms with the easeOutExpo curve lifted
    // from counter.tsx (long smooth tail, so it slows as it lands).
    const rollTo = (from: number, to: number) => {
      cancelAnimationFrame(roll);
      let start = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / ROLL);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setNum(Math.round(from + (to - from) * eased));
        if (t < 1) roll = requestAnimationFrame(step);
      };
      roll = requestAnimationFrame(step);
    };

    const tick = () => {
      let delay = TYPE;
      if (phase === "hold") {
        phase = "del";
        delay = HOLD;
      } else if (phase === "del") {
        n -= 1;
        setLabel(stats[i].label.slice(0, n));
        if (n <= 0) {
          const from = stats[i].value;
          i = (i + 1) % stats.length;
          rollTo(from, stats[i].value); // roll while the next label types in
          phase = "type";
          delay = PAUSE;
        } else {
          delay = DELETE;
        }
      } else {
        n += 1;
        setLabel(stats[i].label.slice(0, n));
        if (n >= stats[i].label.length) phase = "hold";
        delay = TYPE;
      }
      timer = window.setTimeout(tick, delay);
    };

    const start = () => {
      if (!timer) timer = window.setTimeout(tick, HOLD);
    };
    const stop = () => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };

    let observer: IntersectionObserver | null = null;
    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
        threshold: 0,
      });
      observer.observe(node);
    } else {
      start();
    }

    return () => {
      stop();
      cancelAnimationFrame(roll);
      observer?.disconnect();
    };
  }, [reduced, stats]);

  const longestLabel = stats.reduce(
    (a, b) => (b.label.length > a.label.length ? b : a),
    stats[0],
  ).label;
  const widestValue = stats.reduce((a, b) => (b.value > a.value ? b : a), stats[0]).value;

  return (
    <>
      {/* Number — invisible sizer reserves the widest value's width (tabular-nums
          keeps digits monospaced) so the cell never reflows as it rolls. */}
      <span ref={rootRef} className={cn(valueClassName, "inline-grid")}>
        <span aria-hidden className="invisible col-start-1 row-start-1">
          {widestValue}
        </span>
        <span aria-hidden className="col-start-1 row-start-1 justify-self-center">
          {num}
        </span>
      </span>
      {/* Label — sr-only summary reads every metric; the visible pair is hidden
          from AT. Invisible sizer reserves the longest label + caret footprint. */}
      <span className={labelClassName}>
        <span className="sr-only">{stats.map((s) => `${s.value} ${s.label}`).join(", ")}</span>
        <span aria-hidden className="inline-grid">
          <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
            {longestLabel}
            <span className="ml-px inline-block w-px" />
          </span>
          <span className="col-start-1 row-start-1 justify-self-center whitespace-nowrap">
            {label}
            <span className="ml-px inline-block h-[1em] w-px translate-y-[0.1em] [animation:caret-blink_1s_step-end_infinite] bg-current align-baseline motion-reduce:hidden" />
          </span>
        </span>
      </span>
    </>
  );
}
