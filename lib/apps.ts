import { apps } from "@/.velite";
import type { App, AppCategory, AppPricing } from "@/types/app";
import { appCategories, inCategory } from "@/lib/tools/category-membership";

export interface ListAppsOptions {
  category?: AppCategory;
  pricing?: AppPricing;
  text?: string;
}

export function listApps(opts: ListAppsOptions = {}): ReadonlyArray<App> {
  const query = opts.text?.trim().toLowerCase() ?? "";
  const filtered = apps.filter((a) => {
    if (opts.category && !inCategory(a, opts.category)) return false;
    if (opts.pricing && a.pricing !== opts.pricing) return false;
    if (query && !matchApp(a, query)) return false;
    return true;
  });

  // Featured entries lead; then most-recently-added (the addedSeq accession
  // number — the same chronology the browser's Newest sort uses, so the SSR
  // fallback grid and the hydrated client grid agree on order).
  return [...filtered].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return b.addedSeq - a.addedSeq;
  });
}

export function getApp(slug: string): App | undefined {
  return apps.find((a) => a.slug === slug);
}

export function featuredApps(limit = 4): ReadonlyArray<App> {
  return listApps()
    .filter((a) => a.featured)
    .slice(0, limit);
}

export function relatedApps(slug: string, limit = 4): ReadonlyArray<App> {
  const current = getApp(slug);
  if (!current) return [];
  return listApps()
    .filter((a) => a.slug !== slug)
    .filter((a) => a.category === current.category)
    .slice(0, limit);
}

/**
 * Curated alternatives: resolve an app's hand-picked `alternatives` slugs to the
 * live `App` records, preserving editorial order and dropping any that are
 * missing or archived. Velite's complete() hook already guarantees the slugs
 * exist + aren't self-refs at build time; this just hydrates them for the rail.
 */
export function alternativeApps(app: App): ReadonlyArray<App> {
  if (!app.alternatives?.length) return [];
  return app.alternatives
    .map((slug) => getApp(slug))
    .filter((a): a is App => !!a && (a.status ?? "active") !== "archived");
}

function matchApp(a: App, query: string): boolean {
  const haystack = [
    a.name,
    a.tagline,
    a.description,
    a.insight ?? "",
    a.vendor ?? "",
    ...appCategories(a),
    ...(a.tags ?? []),
    ...(a.modelSupport?.models ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}
