"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { App } from "@/types/app";
import type { SponsoredSlot } from "@/types/sponsored";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ToolCard } from "./tool-card";
import { SponsoredCard } from "./sponsored-card";

type Item = App | SponsoredSlot;
const isSponsored = (item: Item): item is SponsoredSlot => "sponsored" in item;
const keyOf = (item: Item, i: number): string =>
  isSponsored(item) ? `sp:${item.id}:${i}` : item.slug;

// Apply the reveal class before the browser paints so a newly-appearing card is
// never shown un-hidden for a frame. RevealToolGrid only ever renders on the
// client (ToolsBrowser bails to the client behind Suspense), but guard the SSR
// pass anyway to keep React quiet.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Props {
  items: ReadonlyArray<Item>;
  /** Canonical query string for the current results. A change means the filter
   *  set was rewritten, so the whole new set should reveal (not just appends). */
  revealKey: string;
}

// Client grid with a reduced-motion-safe staggered "rise" entrance. The static
// SSR fallback keeps using <ToolGrid> (the LCP path, painted at rest); this is
// only the post-hydration grid inside ToolsBrowser. A card rises when it's
// genuinely new to the view — a freshly filtered set or a freshly appended
// infinite-scroll batch — never on the first paint (which would flash / hurt LCP).
// Reveal state is driven imperatively from effects (no ref reads during render),
// so React never fights the class we toggle.
export function RevealToolGrid({ items, revealKey }: Readonly<Props>) {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLUListElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const firstPaint = useRef(true);
  const prevRevealKey = useRef(revealKey);

  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) return;

    observer.current ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.shown = "true";
            observer.current?.unobserve(entry.target);
          }
        }
      },
      // Reveal a touch before the card is fully in view so the rise reads as it
      // enters rather than after it's parked.
      { rootMargin: "0px 0px -8% 0px" },
    );

    // A rewritten query → forget prior keys so the whole new set reveals.
    if (prevRevealKey.current !== revealKey) {
      prevRevealKey.current = revealKey;
      seen.current = new Set();
    }

    const cells = grid.querySelectorAll<HTMLElement>(":scope > li[data-reveal-key]");
    cells.forEach((li, idx) => {
      const key = li.dataset.revealKey ?? String(idx);
      if (seen.current.has(key)) return;
      seen.current.add(key);
      // The very first paint stays at rest (LCP-safe, no hydration flash). Cards
      // that appear later — appended batches or a fresh filter set — rise in.
      if (firstPaint.current) return;
      // Light per-card cascade; modulo keeps appended batches lively without an
      // ever-growing delay.
      li.style.transitionDelay = `${(idx % 6) * 40}ms`;
      li.classList.add("reveal-rise");
      observer.current?.observe(li);
    });
    firstPaint.current = false;
  });

  useEffect(() => () => observer.current?.disconnect(), []);

  return (
    <ul
      ref={gridRef}
      className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((item, i) => {
        const key = keyOf(item, i);
        return (
          <li key={key} data-reveal-key={key}>
            {isSponsored(item) ? <SponsoredCard slot={item} /> : <ToolCard app={item} />}
          </li>
        );
      })}
    </ul>
  );
}
