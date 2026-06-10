"use client";
import dynamic from "next/dynamic";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FacetCounts } from "@/lib/tools/facet-counts";

// Defer the Radix-Dialog-backed drawer body until the button is first pressed —
// keeps Radix Dialog out of the directory's First Load JS (mobile-sheet pattern).
const FilterDrawerPortal = dynamic(
  () => import("./filter-drawer-portal").then((m) => m.FilterDrawerPortal),
  { ssr: false },
);

interface Props {
  activeCount: number;
  total: number;
  filtered: number;
  /** Hide the Category facet (a sibling surface — the console strip — owns it). */
  omitCategory?: boolean;
  /** Live faceted counts, threaded to the facet chips. */
  counts?: FacetCounts;
}

export function FilterDrawer({
  activeCount,
  total,
  filtered,
  omitCategory,
  counts,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Secondary facets narrow the always-visible category strip — tint the trigger
  // so that's legible with the drawer closed.
  const active = activeCount > 0;

  const handleOpen = () => {
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        // Icon-only on mobile (the label is dropped to give the search field its
        // width back), so the button needs an explicit label for SRs. Square when
        // bare; relaxes to a pill when the active-count badge shows.
        aria-label={activeCount > 0 ? `Filters, ${activeCount} applied` : "Filters"}
        className={cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
          activeCount > 0 ? "gap-1.5 px-2" : "w-8 px-0",
          active
            ? "bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/[0.18]"
            : "bg-white/[0.04] text-[var(--color-ink)] ring-white/[0.08] hover:bg-white/[0.08]",
        )}
      >
        <SlidersHorizontal
          className={cn(
            "h-3.5 w-3.5",
            active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-dim)]",
          )}
        />
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 font-mono text-[10px] text-[var(--color-canvas)]">
            {activeCount}
          </span>
        )}
      </button>
      {mounted && (
        <FilterDrawerPortal
          open={open}
          onOpenChange={setOpen}
          total={total}
          filtered={filtered}
          omitCategory={omitCategory}
          counts={counts}
        />
      )}
    </>
  );
}
