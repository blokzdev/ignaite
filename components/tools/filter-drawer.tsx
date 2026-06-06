"use client";
import dynamic from "next/dynamic";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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
}

export function FilterDrawer({ activeCount, total, filtered, omitCategory }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] text-[var(--color-canvas)]">
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
        />
      )}
    </>
  );
}
