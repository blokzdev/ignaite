"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { App } from "@/types/app";
import { cn } from "@/lib/utils";
import { recentApps } from "@/lib/tools/filter-apps";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ToolCard } from "./tool-card";

interface Props {
  apps: ReadonlyArray<App>;
}

const GAP = 20; // gap-5
const MAX_ITEMS = 11; // cap the rail length per mode.
type RailMode = "featured" | "recent";

export function FeaturedCarousel({ apps }: Readonly<Props>) {
  const reduced = useReducedMotion();

  // Two rails behind one segmented toggle: a random 11 of the curated `featured`
  // apps (shuffled once per mount, fresh each visit), and the 11 most-recently-
  // added listings (kept current by the weekly discover-apps routine). The toggle
  // is ephemeral local state — a view switch on the rail, not URL filter state.
  // The carousel renders client-only (behind the homepage's Suspense CSR
  // boundary), so the lazy initializer never runs on the server → no hydration
  // mismatch from Math.random().
  const [featured] = useState<ReadonlyArray<App>>(() => {
    const pool = apps.filter((a) => a.featured);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, MAX_ITEMS);
  });
  const recent = useMemo(() => recentApps(apps, MAX_ITEMS), [apps]);
  const [mode, setMode] = useState<RailMode>(() =>
    apps.some((a) => a.featured) ? "featured" : "recent",
  );
  const items = mode === "featured" ? featured : recent;

  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
    setActiveIndex(Math.round(scrollLeft / stepOf(el)));
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

  // Snap the rail back to the start when the visible set swaps (toggle), without
  // animating the jump, and recompute the arrow/dot state for the new content.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    setActiveIndex(0);
    update();
  }, [mode, update]);

  if (items.length === 0) return null;

  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * stepOf(el), behavior });
  };
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: i * stepOf(el), behavior });
  };

  return (
    <section aria-labelledby="rail-heading" className="mb-10">
      {/* sr-only heading keeps the h2 landmark while the visible label is the
          interactive Featured / Recently added toggle. */}
      <h2 id="rail-heading" className="sr-only">
        {mode === "featured" ? "Featured apps" : "Recently added apps"}
      </h2>

      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div
          className="text-eyebrow flex items-center gap-2.5"
          role="group"
          aria-label="Choose which apps to show"
        >
          <span aria-hidden className="text-[var(--color-accent)]">
            {"//"}
          </span>
          <RailToggle active={mode === "featured"} onClick={() => setMode("featured")}>
            Featured
          </RailToggle>
          <span aria-hidden className="text-[var(--color-ink-dim)]/60">
            /
          </span>
          <RailToggle active={mode === "recent"} onClick={() => setMode("recent")}>
            Recently added
          </RailToggle>
          <span aria-hidden className="ml-1 text-[var(--color-ink-dim)]">
            · {items.length}
          </span>
        </div>

        {/* Desktop arrows — touch uses swipe + dots. */}
        <div className="hidden items-center gap-2 sm:flex">
          <CarouselArrow label="Previous apps" disabled={!canLeft} onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </CarouselArrow>
          <CarouselArrow label="Next apps" disabled={!canRight} onClick={() => scrollByCard(1)}>
            <ChevronRight className="h-4 w-4" />
          </CarouselArrow>
        </div>
      </div>

      {/* py-3 / -my-3 keeps a 12px breathing zone on both axes so the card's
          hover-lift (-4px) and focus ring (2px outer) aren't clipped by the
          scroll container — setting overflow-x: auto forces overflow-y to
          behave the same way per CSS spec, so the lifted card would otherwise
          hit the top edge. */}
      <ul
        ref={scrollerRef}
        className="no-scrollbar scroll-fade-x -mx-6 -my-3 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-3"
        role="list"
      >
        {items.map((app) => (
          <li key={app.slug} className="flex w-[320px] shrink-0 snap-start sm:w-[380px]">
            <ToolCard app={app} />
          </li>
        ))}
      </ul>

      {/* Position dots — primary advance affordance on touch. Each button is a
          24px hit target (WCAG 2.5.8) with a small visual bar centered inside. */}
      <div
        className="mt-3 flex flex-wrap justify-center gap-0.5"
        role="group"
        aria-label="Carousel pagination"
      >
        {items.map((app, i) => (
          <button
            key={app.slug}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to ${app.name}`}
            aria-current={i === activeIndex}
            className="group inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex
                  ? "w-5 bg-[var(--color-accent)]"
                  : "w-1.5 bg-white/30 group-hover:bg-white/50",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

interface RailToggleProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// Inherits the eyebrow type (uppercase mono + tracking) from the parent's
// `text-eyebrow`; only the color changes between active/idle.
function RailToggle({ active, onClick, children }: RailToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "text-[var(--color-accent)]"
          : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}

interface ArrowProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function CarouselArrow({ label, disabled, onClick, children }: ArrowProps) {
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
