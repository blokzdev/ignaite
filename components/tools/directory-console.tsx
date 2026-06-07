"use client";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { apps } from "@/.velite";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { countMatches } from "@/lib/tools/filter-apps";
import { facetCounts } from "@/lib/tools/facet-counts";
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
import { BackToTop } from "./back-to-top";

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

  // The "/" shortcut focuses this field on the directory route (command-palette
  // dispatches the event instead of opening the ⌘K jump-to palette). ⌘K stays the
  // global palette — two distinct search affordances.
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onFocusSearch = () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("blokz:focus-search", onFocusSearch);
    return () => window.removeEventListener("blokz:focus-search", onFocusSearch);
  }, []);

  // Keep the selected category chip visible: a deep-link (or toggle) to a category
  // far down the horizontally-scrolled strip would otherwise leave the active chip
  // off-screen with no cue. Scroll the first active chip into view (or back to the
  // start when only "All" is selected) on mount + whenever the selection changes.
  const reduced = useReducedMotion();
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>('[data-category][aria-pressed="true"]');
    if (active) {
      active.scrollIntoView({
        inline: "nearest",
        block: "nearest",
        behavior: reduced ? "auto" : "smooth",
      });
    } else {
      strip.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
    }
  }, [filter.category, reduced]);

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

  // Live faceted counts for every facet (exclude-self) — one shared source for the
  // category strip + the Filters drawer/popover, so their numbers always agree.
  const counts = useMemo(
    () => facetCounts(apps, filter),
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
    <>
      <div className="container-site px-6">
        {/* Search row. pt-2.5 matches the strip's pb-2.5 so the console reads
            balanced once the nav row tucks away and it sits flush to the top. */}
        <div className="flex items-center gap-2 pt-2.5 pb-2.5">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-dim)]"
            />
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => (inputFocused.current = true)}
              onBlur={() => (inputFocused.current = false)}
              onKeyDown={(e) => {
                // Esc clears the query, then (on a second press) blurs the field.
                if (e.key === "Escape") {
                  if (text) setText("");
                  else e.currentTarget.blur();
                }
              }}
              placeholder="Search apps, vendors, tags, models…"
              aria-label="Search apps"
              className="h-8 w-full rounded-full bg-white/[0.04] pr-14 pl-9 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
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
              // Hint that "/" focuses this filter field (⌘K opens the separate
              // global jump-to palette). Decorative — the listener owns the behavior.
              <kbd
                aria-hidden
                className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-dim)] sm:block"
              >
                /
              </kbd>
            )}
          </div>

          {/* Desktop: inline sort + Filters popover + live count. */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Sort apps"
              className="hidden h-8 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-2.5 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08] sm:inline-flex"
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

          <div className="hidden sm:block">
            <Popover>
              <PopoverTrigger
                aria-label={secondaryCount > 0 ? `Filters, ${secondaryCount} applied` : "Filters"}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-2.5 font-mono text-[11px] tracking-[0.08em] uppercase ring-1 transition-colors ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
                  secondaryCount > 0
                    ? "bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/[0.18] data-[state=open]:bg-[var(--color-accent)]/[0.18]"
                    : "bg-white/[0.04] text-[var(--color-ink)] ring-white/[0.08] hover:bg-white/[0.08] data-[state=open]:bg-white/[0.08]",
                )}
              >
                <SlidersHorizontal
                  className={cn(
                    "h-3.5 w-3.5",
                    secondaryCount > 0
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-ink-dim)]",
                  )}
                />
                Filters
                {secondaryCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] text-[var(--color-canvas)]">
                    {secondaryCount}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <FilterControls
                  filters={filters}
                  variant="stacked"
                  omit={["category"]}
                  counts={counts}
                />
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

          {/* Mobile: every facet — incl. Category (mirrored from the strip, which
              the sheet covers while open) — in the bottom-sheet drawer. Counts are
              faceted from the same source as the strip, so the two always agree. */}
          <div className="sm:hidden">
            <FilterDrawer
              activeCount={secondaryCount}
              total={TOTAL}
              filtered={filtered}
              counts={counts}
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
          ref={stripRef}
          className="no-scrollbar scroll-fade-x -mx-6 flex items-center gap-1.5 overflow-x-auto px-6 pb-2.5"
          role="group"
          aria-label="Filter by category"
        >
          <CategoryChip
            label="All"
            active={filter.category.length === 0}
            onClick={filters.resetCategory}
            count={counts.all.category}
          />
          {APP_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              category={c}
              label={CATEGORY_LABEL[c as AppCategory]}
              active={filter.category.includes(c)}
              onClick={() => filters.toggleCategory(c)}
              count={counts.category[c]}
            />
          ))}
        </div>
      </div>
      <BackToTop />
    </>
  );
}

function CategoryChip({
  active,
  onClick,
  category,
  count,
  label,
}: Readonly<{
  active: boolean;
  onClick: () => void;
  category?: string;
  count?: number;
  label: string;
}>) {
  const showCount = count != null;
  // A category with no results under the current filters is a dead end — dim it
  // and drop it from the tab order. Never the "All" reset chip (no `category`),
  // and never an active chip (so a selection can always be undone).
  const dead = category != null && !active && count === 0;
  return (
    <button
      type="button"
      data-category={category}
      onClick={onClick}
      disabled={dead}
      aria-pressed={active}
      // Spell out the count so the bare number isn't ambiguous to a screen reader.
      aria-label={
        !showCount ? label : count === 0 ? `${label}, no matches` : `${label}, ${count} apps`
      }
      className={cn(
        "inline-flex h-8 shrink-0 items-center rounded-full px-2.5 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
        dead &&
          "pointer-events-none opacity-40 hover:bg-white/[0.04] hover:text-[var(--color-ink-dim)]",
      )}
    >
      {label}
      {showCount && (
        // Count inherits the pill's text colour (so it flips with active/hover)
        // and steps down in size to read as secondary metadata. Full token colour
        // (no opacity) keeps small text AA-legible per the styling rules.
        <span className="ml-1.5 text-[10px] tracking-normal tabular-nums">{count}</span>
      )}
    </button>
  );
}
