"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Collapses long body copy to a fixed height with a bottom fade + a "Show more /
// Show less" toggle, revealing the rest on click. The full text always stays in
// the DOM (clamped only via max-height + overflow), so it's SEO-complete and
// screen readers get everything — the toggle is a visual affordance only. The
// toggle appears solely when the content actually overflows the collapsed height
// (measured after mount), so short copy renders untouched with no control.
export function ShowMore({
  children,
  collapsedRem = 8,
  className,
}: Readonly<{ children: ReactNode; collapsedRem?: number; className?: string }>) {
  const regionId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const collapsedPx = collapsedRem * 16;
    const check = () => setOverflowing(el.scrollHeight > collapsedPx + 8);
    check();
    setMeasured(true);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsedRem]);

  // Collapse pre-measurement too, so long copy never flashes full → clamped
  // (short copy under the cap is unaffected by the max-height, so no flash there).
  const clamp = !expanded && (overflowing || !measured);
  const showToggle = measured && overflowing;

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={ref}
          id={regionId}
          className="overflow-hidden"
          style={clamp ? { maxHeight: `${collapsedRem}rem` } : undefined}
        >
          {children}
        </div>
        {clamp && overflowing && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[var(--color-canvas)]"
          />
        )}
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={regionId}
          className="mt-3 inline-flex items-center gap-1 rounded font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent)] uppercase transition-colors hover:text-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown
            aria-hidden
            className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")}
          />
        </button>
      )}
    </div>
  );
}
