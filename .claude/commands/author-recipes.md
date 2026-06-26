---
description: Autonomously discover a real multi-app workflow worth a recipe, author it, and open a PR
argument-hint: [optional focus, e.g. a job-to-be-done or a category]
---

You are the **unattended recipe-authoring** routine for the Ignaite directory. A **Recipe** is a
curated, web-verified workflow over apps **already listed** in the directory — one JSON file per
recipe at `data/recipes/<slug>.json`, validated by the zod schema in `lib/recipes-schema.ts`. This is
the recipes counterpart to `/discover-apps`. Recipes carry more editorial substance than an app row
(a thesis about WHY this chain, where it breaks down, independent sources), so this routine **opens a
PR for human review — it does NOT auto-merge.** **Never fabricate** — one real, verified recipe beats
five plausible ones.

Optional focus: **$ARGUMENTS** (a job-to-be-done like "cold outbound" or a category; else scan broadly).

## 1. Know what already exists — on `main` **and** in open PRs

- List `data/recipes/` (each filename is a slug). Build the set of existing recipe **slugs** + **goals**
  (read the `goal`/`title` of each) — your dedup keys. The trap is re-authoring the same workflow under a
  new slug, so match on the **job**, not just the slug: a new recipe must accomplish a genuinely
  different outcome, not restate an existing chain.
- **Fold in recipes proposed by open, unmerged PRs** (head branch `claude/author-recipes-*`, or any open
  PR adding `data/recipes/*.json`): read their changed files, add their slugs + goals **and the
  `addedSeq` accession numbers they claim** to your "already-claimed" set, so this run's seq starts after
  both the highest on `main` and the highest claimed in-flight (duplicate `addedSeq` hard-fails the
  build). Use the GitHub MCP tools (list open PRs → read each candidate's diff). If you can't enumerate
  open PRs here, say so in the PR body.
- Note the current **max `addedSeq`** across `data/recipes/*.json` (+ any claimed by open PRs); this
  run's recipe takes the next free integer. Accession numbers are **never reused**.

## 2. Discover a real workflow (web)

- WebSearch for a **real, documented** multi-app workflow people actually run end-to-end — a job that
  takes raw input to a finished outcome by chaining 2+ distinct apps, each owning one stage. Good sources:
  independent walkthroughs, "my stack for X" posts, neutral how-to guides. Aim for **one strong recipe**
  per run, not a dump.
- **Every step must be an app ALREADY LISTED** (`data/apps/<slug>.json` exists). If the ideal workflow
  needs an unlisted app, either (a) substitute a listed app that genuinely fills that stage, or (b) skip
  the recipe this run (and optionally note the missing app for `/discover-apps`). Do **not** invent a
  step or point at an unlisted slug — `velite` hard-fails a missing `step.appSlug` FK.
- Drop anything that's: already a recipe (step 1), a single-app "workflow" (that's just a listing), or a
  chain you can't ground in an **independent** source.

## 3. Author the recipe

Write `data/recipes/<slug>.json` against `lib/recipes-schema.ts`. Required: `slug` (kebab), `title`
(≤80), `goal` (≤120, the one concrete outcome), `audience` (≤60, WHO — persona, like apps' `bestFor`),
`summary` (≤280, card prose), `longSummary` (**≥120 — THE substance**: why this chain, the tradeoffs,
what good output looks like, where it breaks down — this is what makes a recipe worth more than a tag
query), `steps` (**≥2**), `references` (**1–4**), `addedSeq` (next free), `addedAt`/`lastVerifiedAt` =
today.

**Each step** (`recipeStepSchema`): `appSlug` (FK → a listed app), `action` (≤140, the imperative DO),
`rationale` (≤200, WHY this app here), optional `capability` (an `AppCapability` leaf the app actually
carries — web-verify against the app's own `capabilities`, or omit). Within one recipe, no two steps may
share the same `appSlug`+`capability` pair.

**The workflow SHAPE (Chunk AG) — use the structure the source documents, no more:**

- **Linear** (default) — plain ordered `steps[]`, no `id`/`dependsOn`/`loop`. Most recipes are this.
- **Parallel + fan-in** — give steps an `id`; a branch step `dependsOn: [rootId]`; the merge step
  `dependsOn: [branchA, branchB]`. Use ONLY when the apps genuinely run **independently** on a shared
  input and a later step truly consumes both. No contrived joins.
- **Iteration** — a `loop: { backTo: <earlier step id>, until: "<plain-English exit condition>" }` on the
  step that repeats. Use ONLY for a real back-and-forth (draft→critique→revise until a stated bar).
- Graph integrity (`velite` hard-fails): step `id`s unique; every `dependsOn`/`loop.backTo` references an
  existing **earlier** step; no `dependsOn` cycle (loops use `loop`, not `dependsOn`); no self-dependency.

**THE SUBSTANCE GATE (mandatory, not schema-enforceable — this is the moat):**

- `references` must be **GENUINELY INDEPENDENT** — NOT any chained app's own pages, and NOT a page hosted
  by a competitor of any chained app (a competitor's "best tools for X" listicle fails). Real third-party
  walkthroughs/guides. **WebFetch each URL** to confirm it (a) resolves and (b) actually describes this
  workflow class. ≥1 independent ref is required; prefer 2+. _(This exact gate dropped pilot references
  for competitor-marketing — hold the line.)_
- The graph must be **real**: every edge a true dependency, every parallel branch genuinely independent,
  every loop a real iterate-until. `longSummary` must carry an actual thesis, not filler.

## 4. Validate

- `pnpm velite` (runs `velite build --strict`) — validates the JSON, the FK (every `step.appSlug`
  exists), the graph integrity, and `addedSeq` uniqueness/ordering; **exits non-zero** with a precise
  error if anything is off. Then `pnpm typecheck`, `pnpm lint`, `pnpm build` clean. Link-check each
  reference URL (an anti-bot `403`/`429`/`503` on a demonstrably live source is OK — corroborate via
  independent current sources and note it; a `404`/dead domain is not — replace or drop).

## 5. Open a PR for review (do NOT auto-merge)

- If you authored a recipe: branch (e.g. `claude/author-recipes-<date>`), commit, push, open a PR into
  `main`. In the body: the recipe's goal + the app chain, **which sources you fetched and why each is
  independent** (non-vendor, non-competitor), the shape (linear / parallel / iterative) and why it's
  real, and a **"needs human re-verify"** section for anything you couldn't fully confirm. **Do NOT enable
  auto-merge** — a human reviews the editorial substance + the independence of the sources before it
  lands. (This is the deliberate asymmetry vs `/audit-recipes`, which re-verifies trusted data and can
  auto-merge.)
- If nothing met the bar: **do nothing** — no branch, no empty PR. Briefly say you found nothing worth
  authoring this run. A clean no-op is a success.

Keep each run to one solid, verified recipe. Trust compounds; a fabricated chain destroys it.
