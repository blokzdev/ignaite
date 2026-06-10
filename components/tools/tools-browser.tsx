"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createSerializer, useQueryStates } from "nuqs";
import type { App, AppCategory } from "@/types/app";
import { sponsored as sponsoredPool } from "@/.velite";
import { interleave } from "@/lib/interleave";
import { clearFilters } from "@/lib/tools/clear-filters";
import {
  clearDirectoryRestore,
  peekDirectoryRestore,
  saveDirectoryQuery,
  saveDirectoryReturn,
} from "@/lib/tools/directory-session";
import { countMatches, filterApps } from "@/lib/tools/filter-apps";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  CATEGORY_LABEL,
  directoryFilterOptions,
  directoryFilterParsers,
} from "@/hooks/use-directory-filters";
import { Toaster } from "@/components/ui/toaster";
import { ActiveFiltersRow } from "./active-filters-row";
import { RevealToolGrid } from "./reveal-tool-grid";
import { FeaturedCarousel } from "./featured-carousel";
import { DirectoryEmpty } from "./directory-empty";

interface Props {
  apps: ReadonlyArray<App>;
}

const BATCH_SIZE = 24;
// Serializes the current filter state back into its canonical "?…" query string
// (defaults omitted, same encoding the parsers read) for the per-tab session
// memory that powers the detail page's back-to-results crumb.
const serializeDirectoryQuery = createSerializer(directoryFilterParsers);
// One sponsored slot every 10–15 organic positions in the default browse — a
// jittered (not rigid) cadence so the page doesn't look mechanically spaced.
// The gap sequence is seeded + deterministic (see lib/interleave), so SSR and
// client agree and slots don't reshuffle as more batches load. Widen the gap to
// dial the pitch down; raise `seed` to reshuffle the spacing.
const SPONSORED_INTERVAL = { min: 10, max: 15, seed: 1 } as const;

export function ToolsBrowser({ apps }: Readonly<Props>) {
  const [filter, setFilter] = useQueryStates(directoryFilterParsers, directoryFilterOptions);

  // Remember this tab's current query so a detail page's "Directory" crumb can
  // return to these exact results. Serialized from state (not location.search)
  // so the write never races nuqs's URL update. Field-level deps, same as the
  // memos below.
  useEffect(() => {
    saveDirectoryQuery(serializeDirectoryQuery(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter.category,
    filter.pricing,
    filter.deployment,
    filter.platform,
    filter.license,
    filter.status,
    filter.sort,
    filter.q,
  ]);

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

  // Archived apps that match the current query/filters but are hidden by the live
  // (active) default. When > 0 we surface them on demand rather than mixing dead
  // apps into results — empty state recovery + a subtle inline hint.
  const hidingArchived = (filter.status ?? "active") === "active";
  const archivedMatches = useMemo(
    () => (hidingArchived ? countMatches(apps, { ...filter, status: "archived" }) : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apps,
      hidingArchived,
      filter.category,
      filter.pricing,
      filter.deployment,
      filter.platform,
      filter.license,
      filter.q,
    ],
  );
  const showArchived = () => void setFilter({ status: "all" });

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

  // One-shot scroll restore: when the detail crumb armed it (and the saved
  // record matches the results being mounted), the grid comes back at the saved
  // pagination depth and offset instead of the top. The peek is a pure read, so
  // it can seed initial state directly (lazy initializers — safe: ToolsBrowser
  // never SSRs, it suspends behind the page's <Suspense>, so there's nothing to
  // mismatch); the flag is disarmed in the mount effect below.
  const [restore] = useState(() => peekDirectoryRestore(serializeDirectoryQuery(filter)));

  // Pagination starts at the restored depth (clamped to the actual results) so
  // the saved scrollY is reachable on the very first paint.
  const [visibleCount, setVisibleCount] = useState(() =>
    restore ? Math.max(BATCH_SIZE, Math.min(restore.count, filtered.length)) : BATCH_SIZE,
  );
  // Reset pagination whenever the filtered list identity changes — using the
  // "store previous render" pattern so visitors see the first batch of new
  // results instead of stale offsets.
  const [prevFiltered, setPrevFiltered] = useState(filtered);
  if (prevFiltered !== filtered) {
    setPrevFiltered(filtered);
    setVisibleCount(BATCH_SIZE);
  }

  // Disarm the flag (one-shot, armed only by a crumb press — fresh visits never
  // jump) and apply the restored position after layout settles (double rAF).
  // The jump is instant by design (scrollTo defaults to "auto", which also
  // keeps it reduced-motion-safe). If the page came back shorter than
  // remembered (directory data changed between visits), fall back to centering
  // the card the visitor left through. Mount-only by intent; dev StrictMode's
  // re-run just repeats the same idempotent clear + jump.
  useLayoutEffect(() => {
    clearDirectoryRestore();
    if (!restore) return;
    const { scrollY, slug } = restore;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollY <= maxY + 1) {
          window.scrollTo(0, scrollY);
        } else {
          document
            .querySelector(`li[data-reveal-key="${CSS.escape(slug)}"]`)
            ?.scrollIntoView({ block: "center" });
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Remember where the grid was left whenever a card click-through navigates to
  // a detail page (capture phase — runs before Link's navigation). The record
  // powers the crumb's scroll restore; saving on a modified click (new tab) is
  // harmless — the next real click-through just overwrites it.
  const rememberLeavePoint = (e: React.MouseEvent) => {
    const link = (e.target as Element).closest?.('a[href^="/apps/"]');
    const slug = link?.getAttribute("href")?.slice("/apps/".length);
    if (!slug) return;
    saveDirectoryReturn({
      query: serializeDirectoryQuery(filter),
      scrollY: window.scrollY,
      count: visibleCount,
      slug,
    });
  };

  return (
    <>
      <Toaster />
      {!filtersApplied && <FeaturedCarousel apps={apps} />}
      {filtered.length === 0 ? (
        <DirectoryEmpty
          filtersApplied={filtersApplied}
          onClear={() => clearFilters(setFilter)}
          onPickCategory={pickCategory}
          categories={suggestedCategories}
          featured={featuredPicks}
          archivedCount={archivedMatches}
          onShowArchived={showArchived}
        />
      ) : (
        <>
          <ActiveFiltersRow />
          {filtersApplied && archivedMatches > 0 && (
            <button
              type="button"
              onClick={showArchived}
              className="mb-5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              {archivedMatches === 1
                ? "1 archived also matches"
                : `${archivedMatches} archived also match`}
              <span className="text-[var(--color-accent)]">· Show</span>
            </button>
          )}
          <div onClickCapture={rememberLeavePoint}>
            <RevealToolGrid items={items} revealKey={serializeDirectoryQuery(filter)} />
          </div>
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
