"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Props {
  /** Derived fallback label → renders "Related in <categoryLabel>". */
  categoryLabel: string;
  /** When set (curated `alternatives`), overrides the heading entirely, e.g.
   *  "Alternatives to <name>". */
  title?: string;
  /** When set, the header gains a "View all →" link to the category's static
   *  landing page — an internal-link path from every detail page into
   *  /category/<slug>. */
  viewAllHref?: string;
  /** Server-rendered `<li>` card slots — kept off the client bundle (§6). */
  children: ReactNode;
}

const GAP = 20; // gap-5

// Horizontal scroll rail for the "Related in <category>" apps on a detail page.
// Mirrors the homepage FeaturedCarousel's scroll-snap mechanics (edge-fade,
// hidden scrollbar, desktop arrows, reduced-motion) minus the dot-pagination /
// randomization that rail needs — native swipe + arrows suffice for a short
// same-category list. The card slots are passed in as server-rendered children
// so ToolCard stays out of this route's client bundle. (If a third rail appears,
// extract a shared <CardRail>; not worth the abstraction for two.)
export function RelatedRail({ categoryLabel, title, viewAllHref, children }: Readonly<Props>) {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const stepOf = (el: HTMLUListElement) => {
    const first = el.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + GAP : el.clientWidth;
  };

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * stepOf(el), behavior });
  };

  return (
    <section aria-labelledby="related-heading" className="mt-24">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
          <p
            id="related-heading"
            className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase"
          >
            {title ?? `Related in ${categoryLabel}`}
          </p>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="rounded font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              View all {categoryLabel} →
            </Link>
          )}
        </div>
        {/* Desktop arrows — touch scrolls/swipes natively. */}
        <div className="hidden items-center gap-2 sm:flex">
          <RailArrow
            label="Previous related apps"
            disabled={!canLeft}
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </RailArrow>
          <RailArrow label="Next related apps" disabled={!canRight} onClick={() => scrollByCard(1)}>
            <ChevronRight className="h-4 w-4" />
          </RailArrow>
        </div>
      </div>

      {/* -mx-6/px-6 lets the fade-mask reach the gutter (the shell wraps this in
          px-6 + overflow-clip); -my-3/py-3 keeps the card's hover-lift + focus
          ring from being clipped by overflow-x: auto. */}
      <ul
        ref={scrollerRef}
        className="no-scrollbar scroll-fade-x -mx-6 -my-3 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-3"
        role="list"
      >
        {children}
      </ul>
    </section>
  );
}

interface ArrowProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function RailArrow({ label, disabled, onClick, children }: ArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
