// lib/recipes-schema.ts
// SINGLE SOURCE OF TRUTH for a Recipe's shape + validity.
//
// A Recipe is a curated, verifiable workflow over apps ALREADY LISTED in the
// directory: an ordered set of steps, each pointing at a listed app (a foreign
// key into the apps collection) and a controlled capability leaf, that together
// accomplish one real goal. It is the directory's one genuinely new content
// type — compare/insights are projections; a recipe is authored substance.
//
// Mirrors lib/apps-schema.ts: Velite validates every data/recipes/*.json against
// recipeSchema at build, and the Recipe record type is DERIVED via z.infer (no
// hand-maintained interface to drift). Build-only; types/recipe.ts re-exports the
// inferred types type-only, so Zod/Velite never reach the client bundle.
//
// `z` is Velite's own re-exported Zod (v3) — same instance the validator + type
// generator use (see the rationale comment in apps-schema.ts).
//
// CROSS-FILE integrity that per-file zod structurally CANNOT see lives in
// velite.config.ts's complete() hook, not here:
//   • step.appSlug must reference a real app          (FK existence — HARD FAIL)
//   • slug / addedSeq uniqueness, addedSeq↔addedAt    (HARD FAIL)
//   • a step pointing at an ARCHIVED app auto-demotes the recipe to
//     status:"stale" + console.warn                   (NEVER throws — a throw
//     deadlocks the unattended auto-merge pipeline)
// Here we only validate what a single file can prove about itself.
//
// AUTHORING GATE (not schema-enforceable, but mandatory — see directory-playbook):
//   references must be GENUINELY INDEPENDENT (no app-vendor pages, and no page
//   hosted by a tool that competes with any chained app). zod can only enforce
//   .min(1)+url; independence is judged at authoring/audit time. A competitor-
//   marketing ref satisfies the schema but FAILS the substance floor.
import { z } from "velite";
// changeEntrySchema is fully reusable as-is — one definition for the audit-entry
// shape across both entities. (Already exported from apps-schema.ts.)
import { changeEntrySchema } from "./apps-schema";
import { APP_CAPABILITIES, type AppCapability } from "../types/app";
import { RECIPE_STATUSES, type RecipeStatus } from "../types/recipe";

/** z.enum needs a mutable, non-empty literal tuple; spread + assert.
 *  Re-declared per-file by convention (cf. apps-schema.ts, sponsored-schema.ts). */
const literals = <T extends string>(values: ReadonlyArray<T>) => [...values] as [T, ...T[]];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// The iteration construct (Chunk AG) — a back-edge that turns a sub-sequence into a
// loop. Optional on a step; absent ⇒ no iteration. `backTo` must reference an
// EARLIER step on the path and `until` is a human-readable exit gate (NOT
// machine-executable — that's the Recipe Spider's concern). Existence + earlier-ness
// are verified in velite.config.ts's complete() (per-file zod can't see other steps).
export const recipeLoopSchema = z.object({
  /** Step `id` this loop returns to — must be an earlier step (checked in complete()). */
  backTo: z.string().regex(SLUG, "loop.backTo must be a kebab-case step id"),
  /** Plain-English exit condition — the stated gate (e.g. "stakeholders sign off"). ≤80. */
  until: z.string().min(1).max(80, "loop.until must be a stated exit condition (≤80 chars)"),
});

// One step in the workflow. Keystone field is `appSlug`: a FOREIGN KEY into the
// apps collection. zod validates only FORMAT (kebab slug) here — EXISTENCE is
// verified in complete() (per-file zod can't see across files; same pattern apps'
// `alternatives` uses). `capability` is optional but encouraged: a real
// AppCapability leaf sharpens the WHAT of the step and is the join key the (AF)
// substitution engine will use with zero migration.
//
// Chunk AG made the steps[] array an OPTIONAL DAG, fully additively: a step may
// carry an `id`, `dependsOn` (parallel branches + fan-in), and a `loop` (iteration).
// A recipe whose steps carry NONE of these = the original linear-by-array-order
// chain (the 4 pre-AG recipes are byte-for-byte unchanged). Graph integrity (id
// uniqueness, dep existence, acyclicity, no orphans, loop target earlier) lives in
// complete(); lib/tools/recipe-graph.ts derives the deterministic execution order.
export const recipeStepSchema = z.object({
  /** FK → an app's `slug`. Existence checked in velite.config.ts's complete(). */
  appSlug: z.string().regex(SLUG, "appSlug must be a kebab-case app slug"),
  /** Optional controlled capability leaf this step exercises (the WHAT). */
  capability: z.enum(literals<AppCapability>(APP_CAPABILITIES)).optional(),
  /** What the operator DOES in this step — imperative, concrete. ≤140 chars. */
  action: z.string().min(1).max(140, "step action must be ≤140 chars"),
  /** WHY this app/step belongs here — the editorial value the recipe adds over a
   *  bare list of links. ≤200 chars. */
  rationale: z.string().min(1).max(200, "step rationale must be ≤200 chars"),
  // ── Graph fields (Chunk AG) — ALL optional ⇒ zero migration ────────────────
  /** Stable handle for graph references. kebab-case; unique WITHIN the recipe
   *  (checked in complete()). Absent ⇒ the step is positional (linear-by-order). */
  id: z.string().regex(SLUG, "step id must be kebab-case").optional(),
  /** Step `id`s that must complete before this step runs. Absent/[] ⇒ no explicit
   *  deps (a root, or linear). Existence + acyclicity checked in complete(). */
  dependsOn: z
    .array(z.string().regex(SLUG, "dependsOn must list kebab-case step ids"))
    .max(6, "at most 6 dependsOn ids")
    .optional(),
  /** Iteration back-edge — see recipeLoopSchema. */
  loop: recipeLoopSchema.optional(),
});

// A third-party reference backing the recipe — INDEPENDENT corroboration that the
// workflow is real/used. ≥1 REQUIRED. Mirrors the apps referenceSchema shape;
// title cap is looser (120) because recipe refs are walkthrough/guide headlines.
export const recipeReferenceSchema = z.object({
  title: z.string().min(1).max(120, "reference title must be ≤120 chars"),
  url: z.string().url(),
  /** Publication or author (e.g. "Anthropic Docs", "Latent Space"). */
  source: z.string().max(40, "reference source must be ≤40 chars").optional(),
});

export const recipeSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug must be kebab-case (lowercase, hyphen-separated)"),
    /** The recipe's name — a real outcome, not a feature. ≤80 chars. */
    title: z.string().min(1).max(80, "title must be ≤80 chars"),
    /** The single concrete outcome this workflow produces. ≤120 chars. */
    goal: z.string().min(1).max(120, "goal must be ≤120 chars"),
    /** WHO this is for — persona/audience, like apps' bestFor. ≤60 chars. */
    audience: z.string().min(1).max(60, "audience must be ≤60 chars"),
    /** Card-level prose: 1–3 sentences framing the workflow. */
    summary: z.string().min(1).max(280, "summary must be ≤280 chars"),
    /** THE SUBSTANCE — REQUIRED. The detail-page body: why this chain, the
     *  tradeoffs, what good output looks like, where it breaks down. The editorial
     *  weight that makes a Recipe worth more than a tag query. min enforces it
     *  isn't a stub; no max (it's the long-form field). */
    longSummary: z.string().min(120, "longSummary is the substance — make it real (≥120 chars)"),
    /** The ordered workflow — ≥2 steps (a 1-step "recipe" is just an app
     *  listing). Each step.appSlug is a FK validated for existence in complete(). */
    steps: z.array(recipeStepSchema).min(2, "a recipe needs at least 2 steps"),
    /** Optional setup before step 1 (accounts, keys, data). ≤80 chars each, ≤6. */
    prerequisites: z
      .array(z.string().min(1).max(80, "each prerequisite must be ≤80 chars"))
      .max(6, "at most 6 prerequisites")
      .optional(),
    /** Free-form discovery tags (mirrors apps.tags). Optional. */
    tags: z.array(z.string()).optional(),
    /** Independent corroboration — REQUIRED, ≥1, max 4. A recipe must be grounded
     *  in a real, fetched, INDEPENDENT source (independence is an authoring gate,
     *  not schema-checkable — see header). */
    references: z
      .array(recipeReferenceSchema)
      .min(1, "a recipe needs at least one grounding reference")
      .max(4, "at most 4 references"),
    // ── Inherited audit spine (verbatim from appSchema) ──────────────────────
    /** The recipes accession number — order this recipe entered the collection
     *  (1 = first). REQUIRED, unique WITHIN recipes (own counter, independent of
     *  apps). Uniqueness + agreement with addedAt enforced in complete(). */
    addedSeq: z.number().int().positive("addedSeq must be a positive integer"),
    /** ISO date (YYYY-MM-DD) the recipe was added — the visitor-facing signal. */
    addedAt: z.string().regex(ISO_DATE, "addedAt must be an ISO date (YYYY-MM-DD)").optional(),
    /** Lifecycle. Absence = "active". "stale" = flagged for re-verification (by an
     *  audit OR the auto-demote in complete()) but still shown; "archived" hides. */
    status: z.enum(literals<RecipeStatus>(RECIPE_STATUSES)).optional(),
    /** ISO date of the most recent freshness audit. */
    lastVerifiedAt: z
      .string()
      .regex(ISO_DATE, "lastVerifiedAt must be an ISO date (YYYY-MM-DD)")
      .optional(),
    /** Append-only audit trail — REUSES the apps changeEntrySchema verbatim, so the
     *  "Change history" rendering + /audit semantics carry over. New ChangeKind
     *  "restepped" (a step's app changed) lives in types/app.ts. */
    changelog: z.array(changeEntrySchema).optional(),
  })
  // Within one recipe the same (appSlug + capability) pairing shouldn't repeat — a
  // pure data error. Distinct apps across steps are fine; one app may recur in two
  // steps for DIFFERENT roles (different capability).
  .refine(
    (r) => {
      const keys = r.steps.map((s) => `${s.appSlug}::${s.capability ?? ""}`);
      return new Set(keys).size === keys.length;
    },
    { message: "steps must not repeat the same appSlug+capability pairing", path: ["steps"] },
  );

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type RecipeReference = z.infer<typeof recipeReferenceSchema>;
export type RecipeLoop = z.infer<typeof recipeLoopSchema>;
