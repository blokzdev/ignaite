"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Horizontal scroller for the stat strip's cells. Tracks which edges have
// hidden content and (a) fades only that side and (b) shows a tappable
// "swipe for more" chevron at the right while there's more to see (with a
// one-time nudge on first view). Mirrors related-rail.tsx's scroll-edge
// mechanics; the cells stay server-rendered (passed as children). The only
// client island the stat strip adds.
export function StatScroller({ children }: Readonly<{ children: ReactNode }>) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDListElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollRight = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth * 2 : el.clientWidth * 0.8;
    el.scrollBy({ left: step, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <dl
        ref={ref}
        className={cn(
          "no-scrollbar flex snap-x snap-proximity overflow-x-auto py-3.5",
          canLeft && canRight && "scroll-fade-x",
          !canLeft && canRight && "scroll-fade-r",
          canLeft && !canRight && "scroll-fade-l",
        )}
      >
        {children}
      </dl>

      {/* Swipe-for-more affordance — fades in/out with the right edge. */}
      <button
        type="button"
        onClick={scrollRight}
        aria-label="Scroll stats"
        tabIndex={canRight ? 0 : -1}
        className={cn(
          "absolute inset-y-0 right-0 flex w-12 items-center justify-end bg-gradient-to-l from-[var(--color-surface)] via-[var(--color-surface)]/70 to-transparent pr-2 transition-opacity duration-200",
          canRight ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[var(--color-ink)] ring-1 ring-white/[0.10] ring-inset",
            canRight && !reduced && "animate-nudge-x",
          )}
        >
          <ChevronRight aria-hidden className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  );
}
