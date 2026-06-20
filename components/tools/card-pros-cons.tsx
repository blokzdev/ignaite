"use client";

import { useRef, useState } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  pros?: ReadonlyArray<string>;
  cons?: ReadonlyArray<string>;
}

// Single-line "flipper" for one list (pros OR cons). The whole row is one button
// — tap / Enter / Space advances to the next item (wrapping), and a horizontal
// swipe goes prev/next — so a card adds at most two keyboard tab-stops while
// still surfacing every strength and limitation in place. No auto-advance (a long
// grid of cards must stay calm and cheap), and the text-swap animation is gated
// for reduced motion.
function FlipRow({ items, kind }: Readonly<{ items: ReadonlyArray<string>; kind: "pro" | "con" }>) {
  const [i, setI] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const n = items.length;
  const noun = kind === "pro" ? "pro" : "con";
  const at = ((i % n) + n) % n;
  const go = (dir: 1 | -1) => setI((p) => (((p + dir) % n) + n) % n);

  const Icon = kind === "pro" ? Check : Minus;

  return (
    <button
      type="button"
      // The card has a stretched-link overlay at z-[1]; lift interactive bits to
      // z-[2] (mirrors the links row) so a flip never triggers card navigation.
      aria-label={n > 1 ? `Next ${noun} (${at + 1} of ${n})` : `${noun}`}
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
        didSwipe.current = false;
      }}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s || n < 2) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
          didSwipe.current = true;
          go(dx < 0 ? 1 : -1);
        }
      }}
      onClick={() => {
        // A swipe already moved us; don't also fire the tap-advance.
        if (didSwipe.current) {
          didSwipe.current = false;
          return;
        }
        if (n > 1) go(1);
      }}
      className={cn(
        "group/flip relative flex w-full touch-pan-y items-center gap-2 rounded-xl px-3 py-2 text-left ring-1 transition-colors ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        kind === "pro"
          ? "bg-[var(--color-success)]/[0.06] ring-[var(--color-success)]/15 hover:bg-[var(--color-success)]/[0.1]"
          : "bg-[var(--color-warn)]/[0.06] ring-[var(--color-warn)]/15 hover:bg-[var(--color-warn)]/[0.1]",
        n < 2 && "cursor-default",
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          kind === "pro" ? "text-[var(--color-success)]" : "text-[var(--color-warn)]",
        )}
      />
      <span
        key={at}
        aria-live="polite"
        className="card-flip-in min-w-0 flex-1 truncate text-xs leading-relaxed text-[var(--color-ink-soft)]"
      >
        {items[at]}
      </span>
      {n > 1 && (
        <span aria-hidden className="flex shrink-0 items-center gap-1">
          {items.map((item, idx) => (
            <span
              key={item}
              className={cn(
                "block h-1 w-1 rounded-full transition-colors",
                idx === at
                  ? kind === "pro"
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-warn)]"
                  : "bg-[var(--color-ink-dim)]/40",
              )}
            />
          ))}
        </span>
      )}
    </button>
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
    <div className="relative z-[2] flex flex-col gap-2">
      {hasPros && <FlipRow items={pros!} kind="pro" />}
      {hasCons && <FlipRow items={cons!} kind="con" />}
    </div>
  );
}
