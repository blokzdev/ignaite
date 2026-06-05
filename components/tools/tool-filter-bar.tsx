"use client";
import { ArrowDownUp, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SORT_LABEL,
  SORT_MODES,
  useDirectoryFilters,
  type SortMode,
} from "@/hooks/use-directory-filters";
import { FilterControls } from "./filter-controls";
import { FilterDrawer } from "./filter-drawer";
import { ActiveFilterPills } from "./active-filter-pills";

interface Props {
  total: number;
  filtered: number;
}

export function ToolFilterBar({ total, filtered }: Readonly<Props>) {
  const filters = useDirectoryFilters();
  const { filter, setSort, setQuery, sortMode, hasFilter, clearAll, activeFilters } = filters;

  const [text, setText] = useState(filter.q ?? "");
  useEffect(() => {
    const handle = setTimeout(() => setQuery(text.trim()), 220);
    return () => clearTimeout(handle);
    // setQuery is recreated each render; we intentionally depend only on `text`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Keep the box in sync when `q` is cleared from elsewhere (the empty-state CTA,
  // a removed search pill, or Undo). Focus-guarded so it never clobbers typing.
  const inputFocused = useRef(false);
  useEffect(() => {
    if (!inputFocused.current) setText(filter.q ?? "");
  }, [filter.q]);

  return (
    <div className="ease-out-expo sticky top-[var(--nav-h)] z-30 -mx-6 mb-10 border-y border-white/[0.06] bg-[var(--color-canvas)]/85 px-6 py-4 backdrop-blur-xl transition-[top] duration-300">
      <div className="container-site flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-dim)]"
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => (inputFocused.current = true)}
              onBlur={() => (inputFocused.current = false)}
              placeholder="Search apps, vendors, tags, models…"
              aria-label="Search apps"
              className="h-9 w-full rounded-full bg-white/[0.04] pr-10 pl-9 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            />
            {text.length > 0 && (
              <button
                type="button"
                onClick={() => setText("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile: all filters + sort live in a drawer to keep the bar slim. */}
          <div className="sm:hidden">
            <FilterDrawer activeCount={activeFilters.length} total={total} filtered={filtered} />
          </div>

          {/* Desktop: inline sort dropdown + a live count. */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Sort apps"
              className="hidden h-9 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08] sm:inline-flex"
            >
              <ArrowDownUp className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
              {SORT_LABEL[sortMode]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortMode}
                onValueChange={(v) => setSort(v as SortMode)}
              >
                {SORT_MODES.map((m) => (
                  <DropdownMenuRadioItem
                    key={m}
                    value={m}
                    className="font-mono text-[11px] tracking-[0.08em] uppercase"
                  >
                    {SORT_LABEL[m]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <p
            className="hidden font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase sm:block"
            aria-live="polite"
          >
            {hasFilter ? `${filtered} of ${total}` : `${total} apps`}
          </p>
        </div>

        {/* Desktop: inline filter chip rows. Mobile gets them via the drawer. */}
        <div className="hidden sm:block">
          <FilterControls filters={filters} variant="inline" />
        </div>

        {/* Active-filter pills + clear (all widths, when something is filtered). */}
        {hasFilter && <ActiveFilterPills filters={activeFilters} onClearAll={clearAll} />}

        {/* Mobile-only count for context when nothing is filtered yet. */}
        {!hasFilter && (
          <p
            className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase sm:hidden"
            aria-live="polite"
          >
            {total} apps
          </p>
        )}
      </div>
    </div>
  );
}
