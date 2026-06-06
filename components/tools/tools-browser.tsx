"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import type { App, AppCategory } from "@/types/app";
import { sponsored as sponsoredPool } from "@/.velite";
import { interleave } from "@/lib/interleave";
import { clearFilters } from "@/lib/tools/clear-filters";
import { filterApps } from "@/lib/tools/filter-apps";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  CATEGORY_LABEL,
  directoryFilterOptions,
  directoryFilterParsers,
} from "@/hooks/use-directory-filters";
import { Toaster } from "@/components/ui/toaster";
import { ToolFilterBar } from "./tool-filter-bar";
import { ToolGrid } from "./tool-grid";
import { FeaturedCarousel } from "./featured-carousel";
import { DirectoryEmpty } from "./directory-empty";

interface Props {
  apps: ReadonlyArray<App>;
}

const BATCH_SIZE = 24;
// One sponsored slot every 10–15 organic positions in the default browse — a
// jittered (not rigid) cadence so the page doesn't look mechanically spaced.
// The gap sequence is seeded + deterministic (see lib/interleave), so SSR and
// client agree and slots don't reshuffle as more batches load. Widen the gap to
// dial the pitch down; raise `seed` to reshuffle the spacing.
const SPONSORED_INTERVAL = { min: 10, max: 15, seed: 1 } as const;

export function ToolsBrowser({ apps }: Readonly<Props>) {
  const [filter, setFilter] = useQueryStates(directoryFilterParsers, directoryFilterOptions);

  // The browse predicate + sort live in lib/tools/filter-apps (shared with the
  // header console's live count). Depend on each field rather than the `filter`
  // object: nuqs returns a fresh wrapper every render but keeps each parsed value
  // referentially stable until its URL param changes, so field-level deps memoize
  // correctly where `[apps, filter]` would recompute every render.
  const filtered = useMemo(
    () => filterApps(apps, filter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apps,
      filter.category,
      filter.pricing,
      filter.deployment,
      filter.platform,
      filter.license,
      filter.status,
      filter.sort,
      filter.q,
    ],
  );

  const filtersApplied =
    filter.category.length > 0 ||
    filter.pricing.length > 0 ||
    filter.deployment.length > 0 ||
    filter.platform.length > 0 ||
    filter.license != null ||
    (filter.status ?? "active") !== "active" ||
    (filter.q?.length ?? 0) > 0;

  // Empty-state recovery data — the featured picks and the most-populated
  // categories give a no-match visitor a one-tap way back into results.
  const featuredPicks = useMemo(() => apps.filter((a) => a.featured).slice(0, 3), [apps]);
  const suggestedCategories = useMemo(() => {
    const counts = new Map<AppCategory, number>();
    for (const a of apps) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([value]) => ({ value, label: CATEGORY_LABEL[value] }));
  }, [apps]);
  // Picking a category is a fresh start: reset the rest of the query so the
  // chosen category is guaranteed to surface results.
  const pickCategory = (category: AppCategory) =>
    void setFilter({
      category: [category],
      pricing: null,
      deployment: null,
      platform: null,
      license: null,
      status: null,
      sort: null,
      q: null,
    });

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  // Reset pagination whenever the filtered list identity changes — using the
  // "store previous render" pattern so visitors see the first batch of new
  // results instead of stale offsets.
  const [prevFiltered, setPrevFiltered] = useState(filtered);
  if (prevFiltered !== filtered) {
    setPrevFiltered(filtered);
    setVisibleCount(BATCH_SIZE);
  }

  // Desktop auto-loads via IntersectionObserver; mobile uses an explicit button
  // (touch users were never able to reach the old sr-only control). useMediaQuery
  // is false on the server / first paint, so the observer simply attaches once it
  // resolves true on desktop — the mobile button is CSS-hidden on sm+ regardless.
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const loadMore = () => setVisibleCount((n) => Math.min(n + BATCH_SIZE, filtered.length));

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    if (!isDesktop) return;
    if (visibleCount >= filtered.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleCount((n) => Math.min(n + BATCH_SIZE, filtered.length));
          }
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visibleCount, filtered.length, isDesktop]);

  const visible = filtered.slice(0, visibleCount);
  // Sponsored slots only appear in the unfiltered default browse — narrow
  // searches stay clean. Pagination math holds: visibleCount counts organic
  // entries; ads are layered on top of each batch.
  const items = !filtersApplied ? interleave(visible, sponsoredPool, SPONSORED_INTERVAL) : visible;
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Toaster />
      {!filtersApplied && <FeaturedCarousel apps={apps} />}
      <ToolFilterBar total={apps.length} filtered={filtered.length} />
      {filtered.length === 0 ? (
        <DirectoryEmpty
          filtersApplied={filtersApplied}
          onClear={() => clearFilters(setFilter)}
          onPickCategory={pickCategory}
          categories={suggestedCategories}
          featured={featuredPicks}
        />
      ) : (
        <>
          <ToolGrid items={items} />
          {hasMore ? (
            <>
              {/* Desktop: the observer auto-loads before this is reached. */}
              <div ref={sentinelRef} aria-hidden className="h-px" />
              {/* Mobile: an explicit ≥44px control (also the keyboard fallback). */}
              <div className="mt-8 flex justify-center sm:hidden">
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex h-11 items-center rounded-full bg-white/[0.04] px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                >
                  Load more apps
                </button>
              </div>
            </>
          ) : (
            filtered.length > BATCH_SIZE && (
              <p className="mt-10 text-center font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                · end · {filtered.length} apps ·
              </p>
            )
          )}
        </>
      )}
    </>
  );
}
