import {
  APP_CATEGORIES,
  APP_DEPLOYMENTS,
  APP_PLATFORMS,
  APP_PRICING,
  type App,
  type AppCategory,
  type AppDeployment,
  type AppPlatform,
  type AppPricing,
} from "@/types/app";
import { LICENSE_SIGNALS, type LicenseSignal } from "@/lib/tools/license";
import { STATUS_FILTERS, type StatusFilter } from "@/hooks/use-directory-filters";
import { countMatches, type DirectoryFilter } from "@/lib/tools/filter-apps";

/** Live per-option result counts for every facet, computed exclude-self (each
 *  option counts results under the OTHER active facets, with its own facet
 *  replaced by just that option — so multi-select stays additive). `all` is the
 *  count with that facet cleared (the reset / "All" chip). */
export interface FacetCounts {
  category: Record<AppCategory, number>;
  pricing: Record<AppPricing, number>;
  deployment: Record<AppDeployment, number>;
  platform: Record<AppPlatform, number>;
  license: Record<LicenseSignal, number>;
  status: Record<StatusFilter, number>;
  all: {
    category: number;
    pricing: number;
    deployment: number;
    platform: number;
    license: number;
  };
}

function tally<K extends string>(keys: ReadonlyArray<K>, fn: (k: K) => number): Record<K, number> {
  const out = {} as Record<K, number>;
  for (const k of keys) out[k] = fn(k);
  return out;
}

/**
 * Faceted counts for the directory filters. Reuses the grid's own `matchesApp`
 * predicate (via `countMatches`) so a chip's number can never disagree with what
 * selecting it would actually show. ~52 count passes over ~180 apps per call —
 * trivial; callers memoize on the filter fields.
 */
export function facetCounts(apps: ReadonlyArray<App>, filter: DirectoryFilter): FacetCounts {
  const count = (patch: Partial<DirectoryFilter>) => countMatches(apps, { ...filter, ...patch });
  return {
    category: tally(APP_CATEGORIES, (c) => count({ category: [c] })),
    pricing: tally(APP_PRICING, (p) => count({ pricing: [p] })),
    deployment: tally(APP_DEPLOYMENTS, (d) => count({ deployment: [d] })),
    platform: tally(APP_PLATFORMS, (p) => count({ platform: [p] })),
    license: tally(LICENSE_SIGNALS, (l) => count({ license: l })),
    // Status only narrows the default (no-query) browse; under a query matchesApp
    // ignores it, so these read flat during search — intended.
    status: tally(STATUS_FILTERS, (s) => count({ status: s })),
    all: {
      category: count({ category: [] }),
      pricing: count({ pricing: [] }),
      deployment: count({ deployment: [] }),
      platform: count({ platform: [] }),
      license: count({ license: null }),
    },
  };
}
