import { apps } from "@/.velite";
import type { App, AppCategory, AppPricing } from "@/types/app";

export interface ListAppsOptions {
  category?: AppCategory;
  pricing?: AppPricing;
  text?: string;
}

export function listApps(opts: ListAppsOptions = {}): ReadonlyArray<App> {
  const query = opts.text?.trim().toLowerCase() ?? "";
  const filtered = apps.filter((a) => {
    if (opts.category && a.category !== opts.category) return false;
    if (opts.pricing && a.pricing !== opts.pricing) return false;
    if (query && !matchApp(a, query)) return false;
    return true;
  });

  // Featured entries lead; then most-recently-added; then alphabetical.
  return [...filtered].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    if (a.addedAt && b.addedAt && a.addedAt !== b.addedAt) {
      return a.addedAt > b.addedAt ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
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

function matchApp(a: App, query: string): boolean {
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
  return haystack.includes(query);
}
