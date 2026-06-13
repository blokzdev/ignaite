"use client";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { CATEGORY_CLUSTERS } from "@/lib/tools/category-clusters";
import { POPULATED_CATEGORIES } from "@/lib/tools/populated-categories";
import type { FacetCounts } from "@/lib/tools/facet-counts";
import { CATEGORY_LABEL, type DirectoryFilters } from "@/hooks/use-directory-filters";
import { FilterChip } from "./filter-chip";

interface Props {
  filters: DirectoryFilters;
  /** Live faceted counts. When omitted, chips render without counts/dimming. */
  counts?: FacetCounts;
  /** Namespaces the picker's element ids per surface (e.g. "drawer"). */
  idPrefix: string;
}

const POPULATED = new Set<string>(POPULATED_CATEGORIES);

// The Category facet for the filter sheet: 39 chips grouped under the 5
// taxonomy clusters (Build / Create / Work / Verticals / Frontier) instead of
// one flat wall, plus a local type-ahead that live-narrows the chips. The
// query is ephemeral UI state — selection still writes the nuqs `?category=`
// array via the shared filters hook, so URL behavior is unchanged.
export function CategoryClusterPicker({ filters, counts, idPrefix }: Readonly<Props>) {
  const { filter } = filters;
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const sections = CATEGORY_CLUSTERS.map((cluster) => ({
    label: cluster.label,
    blurb: cluster.blurb,
    categories: cluster.categories.filter(
      (c) => POPULATED.has(c) && (q === "" || CATEGORY_LABEL[c].toLowerCase().includes(q)),
    ),
  })).filter((cluster) => cluster.categories.length > 0);
  const shown = sections.reduce((n, s) => n + s.categories.length, 0);

  const inputId = `${idPrefix}-category-typeahead`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="mr-2 shrink-0 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Category
        </span>
        <div className="relative min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Find a category
          </label>
          <Search
            aria-hidden
            className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-dim)]"
          />
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Esc clears the query first; only an already-empty press closes
              // the sheet (two-stage, mirroring the console search field). The
              // keep-open half lives in the drawer's onEscapeKeyDown — Radix
              // hears Escape in the capture phase on document, before this
              // handler — keyed off data-esc-clears below.
              if (e.key === "Escape" && query) setQuery("");
            }}
            placeholder="Find a category…"
            autoComplete="off"
            data-esc-clears=""
            className="h-8 w-full rounded-full bg-white/[0.04] pr-9 pl-9 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear category search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <FilterChip
          label="All"
          active={filter.category.length === 0}
          onClick={filters.resetCategory}
          count={counts?.all.category}
          reset
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {shown} categories shown
      </p>

      {sections.map((cluster) => {
        const headingId = `${idPrefix}-cluster-${cluster.label.toLowerCase()}`;
        return (
          <div key={cluster.label} role="group" aria-labelledby={headingId}>
            <p className="mb-1.5 flex items-baseline gap-2">
              <span
                id={headingId}
                className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink)] uppercase"
              >
                {cluster.label}
              </span>
              {/* Blurb is squeezed out on the narrowest phones (≤~400px). */}
              <span className="hidden font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] min-[420px]:inline">
                {cluster.blurb}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cluster.categories.map((c) => (
                <FilterChip
                  key={c}
                  label={CATEGORY_LABEL[c]}
                  active={filter.category.includes(c)}
                  onClick={() => filters.toggleCategory(c)}
                  count={counts?.category[c]}
                />
              ))}
            </div>
          </div>
        );
      })}

      {q !== "" && sections.length === 0 && (
        <p className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
          No categories match{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-[var(--color-accent)] transition-opacity hover:opacity-75 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            Clear
          </button>
        </p>
      )}
    </div>
  );
}
