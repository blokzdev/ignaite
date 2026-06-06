"use client";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { apps } from "@/.velite";
import { cn } from "@/lib/utils";
import { countMatches } from "@/lib/tools/filter-apps";
import { APP_CATEGORIES } from "@/types/app";
import type { AppCategory } from "@/types/app";
import {
  CATEGORY_LABEL,
  SORT_LABEL,
  SORT_MODES,
  useDirectoryFilters,
  type SortMode,
} from "@/hooks/use-directory-filters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterControls } from "./filter-controls";
import { FilterDrawer } from "./filter-drawer";

const TOTAL = apps.length;

// The integrated directory chrome that lives inside the site header on `/`:
// a persistent search field, an always-visible quick-Category strip, and the
// secondary facets behind a Filters popover (desktop) / sheet (mobile). It reads
// + writes the same nuqs URL state as the grid (useDirectoryFilters), so the two
// stay in lockstep with no prop-drilling. Dynamically imported + pathname-gated
// by site-nav, so its apps-data import never reaches /about or /contact.
export function DirectoryConsole() {
  const filters = useDirectoryFilters();
  const { filter, setQuery, setSort, sortMode, hasFilter, clearAll } = filters;

  // Debounced search → nuqs `q` (mirrors the retired filter bar). The focus guard
  // keeps the box from being clobbered when `q` is cleared elsewhere (a removed
  // pill, Clear-all + Undo) while the user is typing.
  const [text, setText] = useState(filter.q ?? "");
  useEffect(() => {
    const handle = setTimeout(() => setQuery(text.trim()), 220);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  const inputFocused = useRef(false);
  useEffect(() => {
    if (!inputFocused.current) setText(filter.q ?? "");
  }, [filter.q]);

  // Live result count, scored by the same predicate as the grid (count-only pass,
  // no sort) so "{filtered} of {total}" can never disagree with the rendered list.
  const filtered = useMemo(
    () => countMatches(apps, filter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      filter.category,
      filter.pricing,
      filter.deployment,
      filter.platform,
      filter.license,
      filter.status,
      filter.q,
    ],
  );

  // Secondary-facet count for the Filters badge — everything except Category (the
  // strip owns it) and the free-text query (the field owns it).
  const secondaryCount =
    filter.pricing.length +
    filter.deployment.length +
    filter.platform.length +
    (filter.license != null ? 1 : 0) +
    ((filter.status ?? "active") !== "active" ? 1 : 0);

  // Mark the route so globals.css can grow --nav-h to clear the taller console
  // (drives scroll-padding-top / the skip-link landing only — no reflow).
  useEffect(() => {
    document.documentElement.dataset.route = "directory";
    return () => {
      delete document.documentElement.dataset.route;
    };
  }, []);

  return (
    <div className="container-site px-6">
      {/* Search row */}
      <div className="flex items-center gap-2 pb-3">
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
            className="h-9 w-full rounded-full bg-white/[0.04] pr-14 pl-9 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          />
          {text.length > 0 ? (
            <button
              type="button"
              onClick={() => setText("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            // Hint that ⌘K opens the global jump-to palette (distinct from this
            // in-place grid filter). Decorative — the window-level listener owns it.
            <kbd
              aria-hidden
              className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-dim)] sm:block"
            >
              ⌘K
            </kbd>
          )}
        </div>

        {/* Desktop: inline sort + Filters popover + live count. */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Sort apps"
            className="hidden h-9 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08] sm:inline-flex"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            {SORT_LABEL[sortMode]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={sortMode} onValueChange={(v) => setSort(v as SortMode)}>
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

        <div className="hidden sm:block">
          <Popover>
            <PopoverTrigger
              aria-label={secondaryCount > 0 ? `Filters, ${secondaryCount} applied` : "Filters"}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
              Filters
              {secondaryCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] text-[var(--color-canvas)]">
                  {secondaryCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <FilterControls filters={filters} variant="stacked" omit={["category"]} />
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                <p
                  className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
                  aria-live="polite"
                >
                  {hasFilter ? `${filtered} of ${TOTAL}` : `${TOTAL} apps`}
                </p>
                {hasFilter && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile: all secondary facets in the existing bottom-sheet drawer. */}
        <div className="sm:hidden">
          <FilterDrawer
            activeCount={secondaryCount}
            total={TOTAL}
            filtered={filtered}
            omitCategory
          />
        </div>

        <p
          className="hidden shrink-0 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase lg:block"
          aria-live="polite"
        >
          {hasFilter ? `${filtered} of ${TOTAL}` : `${TOTAL} apps`}
        </p>
      </div>

      {/* Quick-Category strip — the most-used facet, always visible. */}
      <div
        className="no-scrollbar scroll-fade-x -mx-6 flex items-center gap-1.5 overflow-x-auto px-6 pb-3"
        role="group"
        aria-label="Filter by category"
      >
        <CategoryChip active={filter.category.length === 0} onClick={filters.resetCategory}>
          All
        </CategoryChip>
        {APP_CATEGORIES.map((c) => (
          <CategoryChip
            key={c}
            active={filter.category.includes(c)}
            onClick={() => filters.toggleCategory(c)}
          >
            {CATEGORY_LABEL[c as AppCategory]}
          </CategoryChip>
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: Readonly<{ active: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}
