"use client";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { cn } from "@/lib/utils";

// A back-to-top affordance for the long directory grid. The nav row tucks away on
// scroll-down, so this gives a one-tap route back to the top (and the search) once
// you're deep in results. Lives inside the `/`-only DirectoryConsole island, so it
// never ships to other routes. Fixed-positioned, below the header (z-30 < z-40).
export function BackToTop() {
  const visible = useScrollThreshold(600);
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      // Hidden from the tab order until it's actually on-screen.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label="Back to top"
      className={cn(
        "ease-out-expo fixed right-5 bottom-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface)]/80 text-[var(--color-ink)] ring-1 ring-white/[0.08] backdrop-blur-xl transition-[opacity,transform] duration-300 ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
