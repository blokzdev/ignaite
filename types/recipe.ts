// types/recipe.ts
// Client-safe enums + type-only re-exports for the Recipe entity. Mirrors
// types/app.ts: the enum UNIONS + value TUPLES live here (zod-free, reusable by
// filter UI / label maps without dragging Velite into the client), while the
// record SHAPES are re-exported type-only from the zod source of truth in
// lib/recipes-schema.ts. To change a Recipe field, edit the SCHEMA (not this
// file); Velite validates every data/recipes/*.json against it at build.

// Lifecycle status. Absence = "active". "stale" = flagged for re-verification (by
// an audit OR auto-demoted in complete() when a step's app was archived) but still
// shown with a freshness caveat. "archived" hides from default browse. Superset of
// AppStatus by the one "stale" middle state a multi-app workflow needs (one dead
// app degrades but doesn't kill the recipe).
export type RecipeStatus = "active" | "stale" | "archived";

export const RECIPE_STATUSES: ReadonlyArray<RecipeStatus> = ["active", "stale", "archived"];

// The record SHAPES (Recipe, RecipeStep, RecipeReference) are DERIVED from the zod
// schema in lib/recipes-schema.ts and re-exported here so consumers import from a
// single, client-safe surface. Recipes also reuse the apps ChangeEntry shape
// (changelog) and the AppCapability leaf enum (step.capability) — import those
// from "@/types/app" directly; they aren't re-exported here.
export type { Recipe, RecipeStep, RecipeReference } from "@/lib/recipes-schema";
