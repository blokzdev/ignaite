import { apps } from "@/.velite";
import type { App, AppCategory } from "@/types/app";
import { recentApps } from "@/lib/tools/filter-apps";

// Server-only category aggregates over the full Velite dataset, shared by the
// category pages, the /categories hub, the footer's Browse block, and the
// sitemap so counts/freshness are derived in exactly one place. Importing
// @/.velite keeps this module build-time only — never pull it into a client
// component.

const isActive = (a: App) => (a.status ?? "active") === "active";

/** A category's ACTIVE apps in the directory's default browse order
 *  (newest-first by `addedSeq`, the same comparator the hydrated grid uses). */
export function activeCategoryApps(category: AppCategory): App[] {
  const pool = apps.filter((a) => a.category === category);
  return recentApps(pool, pool.length);
}

/** Active-app count per category (archived listings excluded — matching the
 *  browsable counts shown by the directory console). */
export function activeCountByCategory(): ReadonlyMap<AppCategory, number> {
  const counts = new Map<AppCategory, number>();
  for (const a of apps) {
    if (!isActive(a)) continue;
    counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  }
  return counts;
}

/** The N most-populated categories (by active count) — powers the footer's
 *  compact Browse block. */
export function topCategories(n: number): ReadonlyArray<{ category: AppCategory; count: number }> {
  return [...activeCountByCategory().entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([category, count]) => ({ category, count }));
}

/** Freshness signal for a category page: the max `lastVerifiedAt` across its
 *  active apps (the weekly audit routine keeps these moving), or null when no
 *  app carries a stamp. Drives sitemap `lastModified`. */
export function categoryLastVerified(category: AppCategory): Date | null {
  let latest: string | null = null;
  for (const a of apps) {
    if (a.category !== category || !isActive(a) || !a.lastVerifiedAt) continue;
    if (!latest || a.lastVerifiedAt > latest) latest = a.lastVerifiedAt;
  }
  return latest ? new Date(latest) : null;
}
