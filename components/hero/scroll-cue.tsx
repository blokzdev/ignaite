"use client";
import { motion, useAnimationControls } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ScrollCue() {
  const reduced = useReducedMotion();
  const arrowControls = useAnimationControls();
  const lineControls = useAnimationControls();

  const scrollToNext = () => {
    const target = document.getElementById("now-next");
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: reduced ? "auto" : "smooth" });
    }
  };

  const handleClick = () => {
    if (!reduced) {
      // Sleek emphasis: the arrow ticks down — previews the swipe — and the
      // accent line gets a brief brightness burst. No parent scaling, so the
      // centered layout transform never fights the motion transform.
      void arrowControls.start({
        y: [0, 12, 0],
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });
      void lineControls.start({
        opacity: [0.6, 1, 0.6],
        filter: ["brightness(1)", "brightness(1.7)", "brightness(1)"],
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });
    }
    scrollToNext();
  };

  return (
    // Outer wrapper owns centering so motion transforms on the button never
    // collide with the -translate-x-1/2 (which previously caused a visible
    // left-shift on whileTap scale).
    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Scroll to the next section"
        className="flex cursor-pointer flex-col items-center gap-3 rounded-full p-2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.7, duration: 0.6 }}
      >
        <span className="rotate-[-90deg] font-mono text-[10px] tracking-[0.4em] uppercase">
          scroll
        </span>

        {/* Two stacked motion layers on the line: idle pulse on the visible
            gradient, plus an opacity/brightness burst layer that owns the
            click emphasis. Stacking keeps the infinite pulse from being
            interrupted. */}
        <span className="relative mt-1 block h-12 w-px">
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent"
            style={{ transformOrigin: "top" }}
            animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent"
            animate={lineControls}
            style={{ opacity: 0.6 }}
          />
        </span>

        {/* Chevron: the rotated-square shape owns its own transform
            (rotate + small upward offset) on an inner static span, while the
            outer motion span owns only the y-tick animation. Keeping the two
            transforms on separate elements prevents motion from clobbering
            rotate(45deg) and shifting the chevron visually. */}
        <motion.span aria-hidden className="block" animate={arrowControls}>
          <span className="block h-2 w-2 -translate-y-1 rotate-45 border-r border-b border-[var(--color-accent)]" />
        </motion.span>
      </motion.button>
    </div>
  );
}
