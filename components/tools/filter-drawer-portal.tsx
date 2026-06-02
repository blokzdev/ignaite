"use client";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useDirectoryFilters } from "@/hooks/use-directory-filters";
import { FilterControls } from "./filter-controls";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  filtered: number;
}

export function FilterDrawerPortal({ open, onOpenChange, total, filtered }: Readonly<Props>) {
  const filters = useDirectoryFilters();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl pt-5">
        <SheetTitle className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Filters
        </SheetTitle>

        <div className="mt-5">
          <FilterControls filters={filters} variant="stacked" />
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
