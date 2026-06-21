"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  pros?: ReadonlyArray<string>;
  cons?: ReadonlyArray<string>;
}

// Single-line row for one list (pros OR cons). The text is a horizontal scroller
// — swipe to read the full bullet like a headline, with a dynamic edge-fade
// (no "…" clamp) that only appears on the side that has hidden content (mirrors
// stat-scroller.tsx / back-crumb.tsx). A looping ">" chevron advances to the next
// item. No auto-advance; reduced motion is a non-issue (no transitions here).
function FlipRow({ items, kind }: Readonly<{ items: ReadonlyArray<string>; kind: "pro" | "con" }>) {
  const [i, setI] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  // Snapshot of the swipe's starting point + whether the scroller was already at
  // an edge when it began — captured on pointer-down so the "two-step" feel holds.
  const swipe = useRef({ x: 0, y: 0, atEnd: false, atStart: false });

  const n = items.length;
  const at = ((i % n) + n) % n;
  const noun = kind === "pro" ? "pro" : "con";
  const Icon = kind === "pro" ? Plus : Minus;

  // Fade only the edge that actually has clipped text (and neither when it fits).
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
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // Re-measure (and the handler resets scroll) whenever the active item changes.
  useEffect(update, [at, update]);

  const next = () => {
    if (ref.current) ref.current.scrollLeft = 0;
    setI((p) => (p + 1) % n);
  };
  const prev = () => {
    if (ref.current) ref.current.scrollLeft = 0;
    setI((p) => (p - 1 + n) % n);
  };

  // Two-step swipe (touch/pen only — mouse keeps the chevron + trackpad scroll,
  // and is left free to select text). A swipe that *begins* already at the scroll
  // end advances to the next bullet; one that begins at the start goes back. A
  // swipe mid-bullet just scrolls (native) to read more — so reading and flipping
  // share one gesture. Edge state is snapshotted at pointer-down, which is what
  // makes it two-step: reaching the end mid-swipe doesn't also advance.
  const onSwipeStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    const el = ref.current;
    if (!el) return;
    swipe.current = {
      x: e.clientX,
      y: e.clientY,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      atStart: el.scrollLeft <= 4,
    };
  };
  const onSwipeEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || n < 2) return;
    const s = swipe.current;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    // Horizontal-dominant swipe only, so vertical page-scroll never advances.
    if (Math.abs(dx) <= 30 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0 && s.atEnd) next();
    else if (dx > 0 && s.atStart) prev();
  };

  return (
    <div
      role="group"
      aria-label={kind === "pro" ? "Pros" : "Cons"}
      className={cn(
        "flex items-center gap-2 rounded-xl py-2 pr-1.5 pl-3 ring-1 ring-inset",
        kind === "pro"
          ? "bg-[var(--color-success)]/[0.06] ring-[var(--color-success)]/15"
          : "bg-[var(--color-warn)]/[0.06] ring-[var(--color-warn)]/15",
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          kind === "pro" ? "text-[var(--color-success)]" : "text-[var(--color-warn)]",
        )}
      />
      <div
        ref={ref}
        aria-live="polite"
        onPointerDown={onSwipeStart}
        onPointerUp={onSwipeEnd}
        className={cn(
          "no-scrollbar min-w-0 flex-1 touch-pan-x overflow-x-auto overscroll-x-contain text-xs leading-relaxed whitespace-nowrap text-[var(--color-ink-soft)]",
          canLeft && canRight && "scroll-fade-x",
          !canLeft && canRight && "scroll-fade-r",
          canLeft && !canRight && "scroll-fade-l",
        )}
      >
        {items[at]}
      </div>
      {n > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label={`Next ${noun} (${at + 1} of ${n})`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-dim)] transition-colors hover:bg-white/[0.06] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          <ChevronRight aria-hidden className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// Replaces the card's "Worth knowing" box. `pros`/`cons` are populated on every
// listing, so the card always has a filled, uniform-height footer signal (the
// insight stays on the detail page, where missing-by-design entries read fine).
export function CardProsCons({ pros, cons }: Readonly<Props>) {
  const hasPros = (pros?.length ?? 0) > 0;
  const hasCons = (cons?.length ?? 0) > 0;
  if (!hasPros && !hasCons) return null;

  return (
    // Lift above the card's stretched-link overlay (z-[1]) so scrolling the text
    // and tapping the chevron never trigger card navigation.
    <div className="relative z-[2] flex flex-col gap-2">
      {hasPros && <FlipRow items={pros!} kind="pro" />}
      {hasCons && <FlipRow items={cons!} kind="con" />}
    </div>
  );
}
