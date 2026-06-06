import type { App } from "@/types/app";
import type { DirectoryFilters, SortMode } from "@/hooks/use-directory-filters";
import { licenseSignal } from "@/lib/tools/license";

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

  // Status only constrains the default browse; an active search reaches across
  // active + archived so a name match is never hidden by the status toggle.
  if (!query) {
    const appStatus = a.status ?? "active";
    if (statusMode === "active" && appStatus !== "active") return false;
    if (statusMode === "archived" && appStatus !== "archived") return false;
  }

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

// featured (default): featured first, then most-recently-added, then A→Z.
function compareApps(sortMode: SortMode) {
  return (a: App, b: App): number => {
    if (sortMode === "alpha") return a.name.localeCompare(b.name);
    if (sortMode === "recent") {
      if (a.addedAt && b.addedAt && a.addedAt !== b.addedAt) return a.addedAt > b.addedAt ? -1 : 1;
      if (a.addedAt && !b.addedAt) return -1;
      if (!a.addedAt && b.addedAt) return 1;
      return a.name.localeCompare(b.name);
    }
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    if (a.addedAt && b.addedAt && a.addedAt !== b.addedAt) return a.addedAt > b.addedAt ? -1 : 1;
    return a.name.localeCompare(b.name);
  };
}

/** Filter + sort the directory. `apps.filter` returns a fresh array, so the
 *  in-place sort never mutates the caller's source list. */
export function filterApps(apps: ReadonlyArray<App>, filter: DirectoryFilter): App[] {
  const result = apps.filter((a) => matchesApp(a, filter));
  return result.sort(compareApps(filter.sort ?? "featured"));
}

/** Count-only pass (skips the sort) for the header console's live total. */
export function countMatches(apps: ReadonlyArray<App>, filter: DirectoryFilter): number {
  let n = 0;
  for (const a of apps) if (matchesApp(a, filter)) n++;
  return n;
}
