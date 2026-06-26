---
description: Re-verify existing recipes — step apps alive, references resolve, workflow still real
argument-hint: [--min-age <days>] [slug ...]
---

You are auditing existing **recipes** in the Ignaite directory — one JSON file per recipe at
`data/recipes/<slug>.json`, validated by the zod schema in `lib/recipes-schema.ts`. A recipe is a
curated workflow over **listed** apps; the goal is that every published recipe still works as written.
**Never fabricate** — if you can't verify a change, leave the data and flag it.

Scope: **$ARGUMENTS**

- No args → review recipes with the **oldest `lastVerifiedAt`** first (grep `data/recipes/*.json`),
  then apply the **freshness floor:** drop any recipe whose `lastVerifiedAt` is within the last
  `--min-age` days (**default 21** — recipes move slower than apps' 14-day directory cadence) and take a
  small batch from what remains. If every recipe is inside the floor, the batch is empty → **do nothing**.
- `--min-age <days>` → override the 21-day floor (`--min-age 0` disables it). Applies to batch selection,
  never to explicit slugs.
- explicit `slug`s → just those, regardless of freshness.

For each recipe in scope:

## 1. Verify it still works (web)

- **Every step's app is still listed + alive.** Confirm each `step.appSlug` still exists in `data/apps/`
  and isn't `status: "archived"`. (If an app was archived, `velite`'s `complete()` hook already
  auto-demotes the recipe to `status: "stale"` in the generated output — but the **source** JSON keeps
  the author's intent. Your job is to decide the real fix: re-step to a live equivalent, or leave it
  flagged. See step 2.)
- **References resolve + still corroborate.** WebFetch each `references[].url`. An anti-bot
  `403`/`429`/`503` on a demonstrably live source is OK (corroborate via independent current sources); a
  `404`/dead domain/parked page is not — replace with an equally **independent** source (non-vendor,
  non-competitor — the `/author-recipes` gate) or, if none survives, flag it.
- **The workflow is still real.** Each step's app still does its stage (a vendor didn't drop the feature;
  the named `capability` is still shipping). The handoffs still make sense (an integration that the recipe
  leans on wasn't removed). The `goal` is still achievable with this chain.
- **Capabilities still accurate** — each `step.capability` (if set) is still a confirmed shipping feature
  of that app; fix or drop a leaf that no longer holds (web-verify-or-omit, same bar as the directory).

## 2. Apply fixes

- **A step's app changed or died** — if a listed equivalent genuinely fills the same stage, **re-step**
  it (swap `step.appSlug`, keeping the graph valid — ids/`dependsOn`/`loop` still reference real earlier
  steps, no cycle/self-dep). If no equivalent fits, set the recipe `status: "stale"` in the source JSON
  and call it out (a human may retire or rebuild it). Never invent a step or point at an unlisted slug.
- Update changed `action`/`rationale`/`capability`, replace dead `references`, refine a `longSummary`
  that no longer matches reality. Keep edits minimal + within the schema; the graph must still pass
  `velite` integrity (FK, acyclicity, loop-backward, no self-dep).
- If a recipe is fully obsolete (the workflow no longer exists), set `status: "archived"` — the file
  stays as record, hidden from default browse. Don't delete it.
- **Bump `lastVerifiedAt` to today** on every recipe you actually re-verified (changed or not).
- Never touch `addedAt` or `addedSeq` (the accession number) — they record when the recipe entered the
  collection.

## 2.5 Record the change (`changelog`) — only when something actually changed

On a **substantive** edit (a re-step, a `status` change, a replaced reference, a reworked step), append
an entry to that recipe's `changelog` (same `changeEntrySchema` as apps). `kind`: `restepped` (a step's
app changed — the kind added for recipes), `updated` (the workflow changed upstream), `fixed` (our data
was wrong), `archived`, `relisted`. `summary` ≤200 chars, concrete ("Re-stepped the dubbing stage from X
to Y after X was discontinued"). `asOf` only if you can source the upstream date; `source` the URL you
verified against. **Do NOT** log a plain re-verification with no change — that's just the `lastVerifiedAt`
bump. Append-only; keep prior entries.

## 3. Validate + report

- `pnpm velite` (runs `velite build --strict` — schema + FK + graph integrity), then `pnpm typecheck`,
  `pnpm lint`, `pnpm build` clean — the same gates CI runs.
- **Interactive run:** report a concise diff (recipes reviewed, what changed, what was re-stepped or
  archived, anything ambiguous needing a human). Don't commit unless asked.

## Scheduled / unattended mode (run by a Routine)

When a scheduled Routine invoked this (no human in the loop), default to **no args** → the
oldest-`lastVerifiedAt` batch past the 21-day floor, then:

- The floor makes back-to-back runs safe: a second run in the same window finds the first's just-stamped
  recipes inside the floor and no-ops. If the whole collection is fresh, do nothing.
- Apply the verified fixes + bump `lastVerifiedAt`.
- If anything changed: branch (e.g. `claude/audit-recipes-<date>`), commit, push, open a PR into `main`
  summarizing the diff + any "needs human decision" items, then **enable squash auto-merge and END** — do
  not subscribe, watch CI, sleep, or schedule a check-in. You passed every CI gate locally and auto-merge
  fires only on green, so GitHub merges server-side. Like `/audit-directory`, an audit re-verifies
  **trusted data** against its real source, so its guard is the routine's discipline (change only when the
  source contradicts; a cited `changelog` per substantive change; `git revert` as the undo) — _not_ a
  pre-merge human review (that's `/author-recipes`, which adds net-new editorial content). A genuinely
  ambiguous "needs human decision" item is the exception: leave it unchanged and flag it in the PR body.
- If nothing changed: **do nothing** — no branch, no empty PR.

Cadence: run ~biweekly, cycling oldest-`lastVerifiedAt` recipes first so the collection rotates through
re-verification over time.
