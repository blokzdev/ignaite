"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { App } from "@/types/app";
import { cn } from "@/lib/utils";
import { recentApps } from "@/lib/tools/filter-apps";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ToolCard } from "./tool-card";

interface Props {
  apps: ReadonlyArray<App>;
}

const GAP = 20; // gap-5
const MAX_ITEMS = 14; // widest responsive count (xl); pools are built to this, then sliced per breakpoint.
type RailMode = "featured" | "recent";

export function FeaturedCarousel({ apps }: Readonly<Props>) {
  const reduced = useReducedMotion();

  // Responsive rail length: fewer highlights on a phone, more on a wide screen, so
  // the single-row position dots always fit (6 → 14 across breakpoints). Both pools
  // are built once at the max length with a stable order, then sliced to `count`,
  // so changing `count` (a resize across a breakpoint) never re-shuffles or
  // reorders — it just shows more/fewer of the same set.
  const sm = useMediaQuery("(min-width: 640px)");
  const md = useMediaQuery("(min-width: 768px)");
  const lg = useMediaQuery("(min-width: 1024px)");
  const xl = useMediaQuery("(min-width: 1280px)");
  const count = xl ? 14 : lg ? 12 : md ? 10 : sm ? 8 : 6;

  // Two rails behind one segmented toggle: a random shuffle of the curated
  // `featured` apps (chosen once per mount, fresh each visit), and the most-
  // recently-added listings (kept current by the weekly discover-apps routine).
  // The toggle is ephemeral local state — a view switch, not URL filter state. The
  // carousel renders client-only (behind the homepage's Suspense CSR boundary), so
  // the lazy initializer never runs on the server → no hydration mismatch from
  // Math.random(), and useMediaQuery's server snapshot is never observed.
  const [shuffledFeatured] = useState<ReadonlyArray<App>>(() => {
    const pool = apps.filter((a) => a.featured);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  });
  const recentPool = useMemo(() => recentApps(apps, MAX_ITEMS), [apps]);
  const [mode, setMode] = useState<RailMode>(() =>
    apps.some((a) => a.featured) ? "featured" : "recent",
  );
  const items = (mode === "featured" ? shuffledFeatured : recentPool).slice(0, count);

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

  // Snap the rail back to the start when the visible set changes — a mode toggle
  // or a breakpoint crossing that changes `count` — without animating the jump, and
  // recompute the arrow/dot state. Resetting on count change also guarantees a
  // shrinking count never strands the view past the new end.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    setActiveIndex(0);
    update();
  }, [mode, count, update]);

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
    <section aria-labelledby="rail-heading" className="mb-12">
      {/* sr-only heading keeps the h2 landmark while the visible label is the
          interactive Featured / Recently added toggle. */}
      <h2 id="rail-heading" className="sr-only">
        {mode === "featured" ? "Featured apps" : "Recently added apps"}
      </h2>

      {/* Contained "spotlight" tray — an elevated, ringed surface so the rail
          reads as a distinct module above the canvas directory grid. */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]/50 p-4 ring-1 ring-white/[0.07] ring-inset sm:p-5">
        {/* Twin glows give the tray genuine "spotlight" depth (both clipped by the
            tray): a cool accent wash top-left, a faint warm one bottom-right to
            tie into the page's lower flame orb. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-[var(--color-accent)] opacity-[0.08] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-24 h-44 w-44 rounded-full bg-[var(--color-flame)] opacity-[0.05] blur-3xl"
        />

        <div className="relative mb-4 flex items-center justify-between gap-4">
          <SpotlightToggle mode={mode} onChange={setMode} />

          {/* Desktop arrows — touch uses swipe + dots. */}
          <div className="hidden items-center gap-2 sm:flex">
            <CarouselArrow
              label="Previous apps"
              disabled={!canLeft}
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </CarouselArrow>
            <CarouselArrow label="Next apps" disabled={!canRight} onClick={() => scrollByCard(1)}>
              <ChevronRight className="h-4 w-4" />
            </CarouselArrow>
          </div>
        </div>

        {/* The rail bleeds to the tray's inner edges (-mx cancels the tray
            padding) so card #1 aligns with the header and the right edge fades
            at the ring. py-3 / -my-3 keeps a 12px breathing zone so the card's
            hover-lift + focus ring aren't clipped by overflow-x: auto. */}
        <ul
          ref={scrollerRef}
          className="no-scrollbar scroll-fade-x -mx-4 -my-3 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-3 sm:-mx-5 sm:px-5"
          role="list"
        >
          {items.map((app) => (
            <li key={app.slug} className="flex w-[320px] shrink-0 snap-start sm:w-[380px]">
              <ToolCard app={app} />
            </li>
          ))}
        </ul>

        {/* Position dots — primary advance affordance on touch. Each button is a
            24px hit target (WCAG 2.5.8) with a small visual bar centered inside.
            flex-nowrap + the responsive `count` keep them to a single row. */}
        <div
          className="relative mt-3 flex flex-nowrap justify-center gap-0.5"
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
                    ? "w-5 bg-[var(--color-accent)] shadow-[0_0_10px_-2px_var(--color-accent)]"
                    : "w-1.5 bg-white/30 group-hover:bg-white/50",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SpotlightToggleProps {
  mode: RailMode;
  onChange: (mode: RailMode) => void;
}

// Sliding segmented control. Two equal grid columns + an absolutely-positioned
// accent thumb that translates between them: with the p-0.5 inset, a
// w-[calc(50%-2px)] thumb is exactly one column wide and translate-x-full lands
// it on the second column. The slide is gated for reduced-motion.
function SpotlightToggle({ mode, onChange }: SpotlightToggleProps) {
  return (
    <div
      role="group"
      aria-label="Choose which apps to show"
      className="relative inline-grid grid-cols-2 rounded-full bg-white/[0.05] p-0.5 ring-1 ring-white/[0.08] ring-inset"
    >
      <span
        aria-hidden
        className={cn(
          "ease-out-expo absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_-3px_var(--color-accent)] transition-transform duration-300 motion-reduce:transition-none",
          mode === "recent" && "translate-x-full",
        )}
      />
      <SegBtn active={mode === "featured"} onClick={() => onChange("featured")}>
        Featured
      </SegBtn>
      <SegBtn active={mode === "recent"} onClick={() => onChange("recent")}>
        Recently added
      </SegBtn>
    </div>
  );
}

interface SegBtnProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function SegBtn({ active, onClick, children }: SegBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "text-eyebrow relative z-10 inline-flex h-8 items-center justify-center rounded-full px-3 text-[10px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none sm:px-4 sm:text-[11px]",
        active
          ? "text-[var(--color-canvas)]"
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
