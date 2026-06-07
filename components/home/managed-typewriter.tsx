"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// The verbs the "AI · <verb>" cell cycles through — mirrors the real pipeline:
// discover → select → write → keep-current → verify, looping back to research.
const WORDS = ["Researched", "Curated", "Authored", "Maintained", "Audited"] as const;
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

const TYPE = 75; // ms per char typed
const DELETE = 40; // ms per char deleted
const HOLD = 1600; // ms a full word is held (reading time)
const PAUSE = 350; // ms before the next word types in

// Perpetual typewriter for the hero stat label. SSR / no-JS / reduced-motion
// render WORDS[0] statically; the animated text is aria-hidden with a stable
// "managed" sr-only label; the loop pauses when scrolled out of view.
export function ManagedTypewriter({ className }: Readonly<{ className?: string }>) {
  const reduced = useReducedMotion();
  const [text, setText] = useState<string>(WORDS[0]);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    const node = rootRef.current;
    let timer = 0;
    let word = 0;
    let n = WORDS[0].length;
    let phase: "hold" | "del" | "type" = "hold";

    const tick = () => {
      let delay = TYPE;
      if (phase === "hold") {
        phase = "del";
        delay = HOLD;
      } else if (phase === "del") {
        n -= 1;
        setText(WORDS[word].slice(0, n));
        if (n <= 0) {
          word = (word + 1) % WORDS.length;
          phase = "type";
          delay = PAUSE;
        } else {
          delay = DELETE;
        }
      } else {
        n += 1;
        setText(WORDS[word].slice(0, n));
        if (n >= WORDS[word].length) phase = "hold";
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
      observer?.disconnect();
    };
  }, [reduced]);

  return (
    <span ref={rootRef} className={className}>
      <span className="sr-only">managed</span>
      <span aria-hidden className="inline-grid">
        {/* invisible sizer reserves the widest word + caret footprint → no layout shift */}
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {LONGEST}
          <span className="ml-px inline-block w-px" />
        </span>
        <span className="col-start-1 row-start-1 justify-self-center whitespace-nowrap">
          {text}
          <span className="ml-px inline-block h-[1em] w-px translate-y-[0.1em] [animation:caret-blink_1s_step-end_infinite] bg-current align-baseline motion-reduce:hidden" />
        </span>
      </span>
    </span>
  );
}
