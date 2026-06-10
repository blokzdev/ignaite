import type { App } from "@/types/app";
import type { DirectoryFilters } from "@/hooks/use-directory-filters";
import { licenseSignal } from "@/lib/tools/license";
import { DEFAULT_SORT, type SortMode } from "@/lib/tools/sort";

// The directory's filter state, exactly as exposed by `useDirectoryFilters`
// (type-only import — erased at runtime, so this stays a plain util usable by
// any client component without dragging the hook's client module along).
export type DirectoryFilter = DirectoryFilters["filter"];

// Single source of truth for the browse predicate. Lifted verbatim out of
// tools-browser's useMemo so the grid (which renders the list) and the header
// console (which only needs the count) score every app the same way — the live
// "{filtered} of {total}" can never disagree with the grid.
export function matchesApp(a: App, filter: DirectoryFilter): boolean {
  const query = filter.q?.trim().toLowerCase() ?? "";
  const statusMode = filter.status ?? "active";

  if (filter.category.length > 0 && !filter.category.includes(a.category)) return false;
  if (filter.pricing.length > 0 && !filter.pricing.includes(a.pricing)) return false;
  if (filter.deployment.length > 0) {
    if (!a.deployment || !filter.deployment.includes(a.deployment)) return false;
  }
  // platforms is an array on the app → match if it runs on ANY selected platform.
  if (filter.platform.length > 0 && !a.platforms.some((p) => filter.platform.includes(p))) {
    return false;
  }
  if (filter.license != null && licenseSignal(a) !== filter.license) return false;

  // Status is a normal facet: it always applies (default "active" hides archived).
  // A search no longer bypasses it — archived matches are surfaced explicitly via
  // the active-first recovery (tools-browser) rather than silently mixed in.
  const appStatus = a.status ?? "active";
  if (statusMode === "active" && appStatus !== "active") return false;
  if (statusMode === "archived" && appStatus !== "archived") return false;
  // "all" → no status constraint.

  if (query) {
    const haystack = [
      a.name,
      a.tagline,
      a.description,
      a.insight ?? "",
      a.vendor ?? "",
      a.category,
      ...(a.tags ?? []),
      ...(a.modelSupport?.models ?? []),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  return true;
}

// Sort by field + direction. Name → locale A→Z (negated for Z→A). Date → the
// `addedSeq` accession number, the directory's total add-order chronology
// (`addedAt` is day-granular and bulk adds share a day, so dates alone can't
// order a cohort — the seq can, and velite guarantees it agrees with the
// dates). Slug fallback only for safety: seqs are unique by the build guard.
function compareApps(sortMode: SortMode) {
  return (a: App, b: App): number => {
    if (sortMode === "az" || sortMode === "za") {
      const c = a.name.localeCompare(b.name);
      return sortMode === "za" ? -c : c;
    }
    // date modes: newest (seq desc) / oldest (seq asc)
    if (a.addedSeq !== b.addedSeq) {
      return sortMode === "oldest" ? a.addedSeq - b.addedSeq : b.addedSeq - a.addedSeq;
    }
    return a.slug.localeCompare(b.slug);
  };
}

/** Filter + sort the directory. `apps.filter` returns a fresh array, so the
 *  in-place sort never mutates the caller's source list. */
export function filterApps(apps: ReadonlyArray<App>, filter: DirectoryFilter): App[] {
  const result = apps.filter((a) => matchesApp(a, filter));
  return result.sort(compareApps(filter.sort ?? DEFAULT_SORT));
}

/** Count-only pass (skips the sort) for the header console's live total. */
export function countMatches(apps: ReadonlyArray<App>, filter: DirectoryFilter): number {
  let n = 0;
  for (const a of apps) if (matchesApp(a, filter)) n++;
  return n;
}

/** The N most-recently-added *active* apps, for the discovery rail. Reuses the
 *  same recency order as the "Recent" sort; archived listings are excluded so the
 *  rail only ever surfaces live, freshly-added apps (kept current by the weekly
 *  discover-apps routine). */
export function recentApps(apps: ReadonlyArray<App>, limit: number): App[] {
  return apps
    .filter((a) => (a.status ?? "active") === "active")
    .sort(compareApps("newest"))
    .slice(0, limit);
}
