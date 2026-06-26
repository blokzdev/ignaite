// lib/tools/recipe-index.ts
// The app→recipes REVERSE INDEX — a build-time PROJECTION over the verified corpus
// (mirrors lib/tools/comparisons.ts). Given an app, which recipes use it? Powers
// the per-app "Used in N recipes" rail (app-detail.tsx, wired in AE) and the
// recipe hub's per-app grouping.
//
// Imports @/.velite → BUILD-TIME ONLY; never pull into a client component (it would
// drag the full apps + recipes datasets into the bundle).
import { apps, recipes } from "@/.velite";
import type { App } from "@/types/app";
import type { Recipe } from "@/types/recipe";

const isActiveApp = (a: App) => (a.status ?? "active") === "active";
// A recipe shows in a reverse rail when browsable (active OR stale — a stale recipe
// is still a real, useful workflow, just flagged); archived recipes drop out.
const isBrowsableRecipe = (r: Recipe) => (r.status ?? "active") !== "archived";

const appBySlug = new Map(apps.map((a) => [a.slug, a] as const));

// Built ONCE at module load (build time), memoized as a ReadonlyMap. complete()
// already guarantees every step.appSlug EXISTS (FK), so the only extra guard here
// is liveness — an app archived after the recipe was authored drops out of the
// rail automatically (complete() also demotes such a recipe to "stale", but the
// recipe may legitimately reference OTHER live apps too, so we still index it).
const RECIPES_BY_APP: ReadonlyMap<string, ReadonlyArray<Recipe>> = (() => {
  const idx = new Map<string, Recipe[]>();
  for (const r of recipes) {
    if (!isBrowsableRecipe(r)) continue;
    // dedupe within a recipe so an app used in two steps appears once in its rail
    for (const slug of new Set(r.steps.map((s) => s.appSlug))) {
      const app = appBySlug.get(slug);
      if (!app || !isActiveApp(app)) continue; // liveness
      const list = idx.get(slug);
      if (list) list.push(r);
      else idx.set(slug, [r]);
    }
  }
  // stable order within each app's rail: newest recipe first (accession desc)
  for (const list of idx.values()) list.sort((a, b) => b.addedSeq - a.addedSeq);
  return idx;
})();

/** Recipes that use a given app (deduped, live, newest-first). The reverse rail. */
export function recipesUsingApp(slug: string): ReadonlyArray<Recipe> {
  return RECIPES_BY_APP.get(slug) ?? [];
}

/** Whether an app appears in any browsable recipe — cheap guard for "show the rail?". */
export function appHasRecipes(slug: string): boolean {
  return RECIPES_BY_APP.has(slug);
}

/** Count of browsable recipes (hub copy + provenance), mirroring comparisonCount(). */
export function recipeCount(): number {
  return recipes.filter(isBrowsableRecipe).length;
}
