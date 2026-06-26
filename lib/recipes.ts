// lib/recipes.ts
// Query helpers over the recipes collection — the read API for SSG routes (AE).
// Mirrors lib/apps.ts. Imports @/.velite → BUILD-TIME ONLY; never pull into a
// client component (it would drag the full datasets — and, via the reverse index,
// the apps corpus — into the bundle).
import { recipes } from "@/.velite";
import type { Recipe } from "@/types/recipe";

// Canonical liveness idiom — `(status ?? "active")`, never a bare equality
// (status is optional; absence = active). "stale" recipes are still shown
// (degraded); only "archived" is hidden from default browse.
const isBrowsable = (r: Recipe) => (r.status ?? "active") !== "archived";

export interface ListRecipesOptions {
  /** Filter to recipes that include a given app in any step. */
  usesAppSlug?: string;
  /** Free-text over title/goal/audience/summary/tags. */
  text?: string;
  /** Include "stale" recipes (default true — still useful, just flagged). */
  includeStale?: boolean;
}

export function listRecipes(opts: ListRecipesOptions = {}): ReadonlyArray<Recipe> {
  const query = opts.text?.trim().toLowerCase() ?? "";
  const includeStale = opts.includeStale ?? true;
  const filtered = recipes.filter((r) => {
    if (!isBrowsable(r)) return false;
    if (!includeStale && (r.status ?? "active") === "stale") return false;
    if (opts.usesAppSlug && !r.steps.some((s) => s.appSlug === opts.usesAppSlug)) return false;
    if (query && !matchRecipe(r, query)) return false;
    return true;
  });
  // Most-recently-added first (the addedSeq accession chronology, same as apps).
  return [...filtered].sort((a, b) => b.addedSeq - a.addedSeq);
}

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

/** The per-app "Used in these recipes" rail — the reverse FK, deduped + live.
 *  Thin re-export of the memoized reverse index so callers have one read surface. */
export { recipesUsingApp } from "@/lib/tools/recipe-index";

function matchRecipe(r: Recipe, query: string): boolean {
  const haystack = [r.title, r.goal, r.audience, r.summary, ...(r.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}
