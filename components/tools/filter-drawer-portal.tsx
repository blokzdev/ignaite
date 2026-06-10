"use client";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SORT_LABEL, SORT_MODES, useDirectoryFilters } from "@/hooks/use-directory-filters";
import type { FacetCounts } from "@/lib/tools/facet-counts";
import { Chip, FilterControls, FilterRow } from "./filter-controls";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  filtered: number;
  omitCategory?: boolean;
  counts?: FacetCounts;
}

export function FilterDrawerPortal({
  open,
  onOpenChange,
  total,
  filtered,
  omitCategory,
  counts,
}: Readonly<Props>) {
  const filters = useDirectoryFilters();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="no-scrollbar max-h-[85dvh] overflow-y-auto rounded-t-2xl pt-5"
      >
        <SheetTitle className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Sort & filter
        </SheetTitle>

        {/* Sort lives here on mobile — the console's inline sort dropdown is
            desktop-only (hidden sm:inline-flex), so without this row touch users
            had no way to switch Featured / Recent / A→Z. Single-select chips,
            same vocabulary as the facet rows below. */}
        <div className="mt-5 border-b border-white/[0.06] pb-4">
          <FilterRow label="Sort" stacked>
            {SORT_MODES.map((m) => (
              <Chip
                key={m}
                label={SORT_LABEL[m]}
                active={filters.sortMode === m}
                onClick={() => filters.setSort(m)}
              />
            ))}
          </FilterRow>
        </div>

        <div className="mt-4">
          <FilterControls
            filters={filters}
            variant="stacked"
            omit={omitCategory ? ["category"] : undefined}
            counts={counts}
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <p
            className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
            aria-live="polite"
          >
            {filters.hasFilter ? `${filtered} of ${total}` : `${total} apps`}
          </p>
          <div className="flex items-center gap-2">
            {filters.hasFilter && (
              <button
                type="button"
                onClick={() => {
                  filters.clearAll();
                  onOpenChange(false);
                }}
                className="inline-flex h-9 items-center rounded-full px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Clear all
              </button>
            )}
            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full bg-[var(--color-accent)] px-5 font-mono text-[11px] tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
              >
                Show {filtered}
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
