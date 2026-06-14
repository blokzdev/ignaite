import type { AppCategory } from "@/types/app";

// The directory's multi-category membership helpers. A listing has one canonical
// `category` (its primary home — card chip, related rail, JSON-LD, sort order)
// plus up to two optional `secondaryCategories` it also genuinely belongs to.
// Every "does this app belong to category X" / "which categories does it count
// toward" decision routes through here, so server aggregates (category pages,
// /categories counts, sitemap) and client filtering agree on membership.
//
// Type-only import (no `@/.velite`), so this stays usable from client modules
// (the Filters predicate, populated-categories) without pulling the full dataset
// into their bundles. Generic over anything carrying the two fields, so it works
// on both the full `App` record and the slim search-index entry.

type CategorizedLike = {
  category: AppCategory;
  secondaryCategories?: ReadonlyArray<AppCategory>;
};

/** Every category an app belongs to: its primary `category` first, then any
 *  `secondaryCategories` (the schema refine guarantees no dups / no primary). */
export function appCategories(app: CategorizedLike): AppCategory[] {
  return app.secondaryCategories?.length
    ? [app.category, ...app.secondaryCategories]
    : [app.category];
}

/** Whether an app belongs to a category, primary OR secondary. */
export function inCategory(app: CategorizedLike, category: AppCategory): boolean {
  return app.category === category || (app.secondaryCategories?.includes(category) ?? false);
}
