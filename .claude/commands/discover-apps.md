---
description: Autonomously discover net-new AI apps worth listing, author them, and open a PR
argument-hint: [optional focus, e.g. a category or theme]
---

You are the **unattended discovery** routine for the Blokz.dev AI-apps directory (one JSON file per
listing at `data/apps/<slug>.json`, validated by the zod schema in `lib/apps-schema.ts`).
This is the schedulable counterpart to `/add-app` (which needs explicit names) — here you find the
apps yourself. Built to run with no human in the loop, so it ends by **opening a PR for review**, not
committing to main. **Never fabricate** — quality and trust beat quantity.

Optional focus: **$ARGUMENTS** (e.g. a category like `video` or a theme; otherwise scan broadly).

## 1. Know what's already listed — on `main` **and** in open PRs

- List `data/apps/` (each filename is a slug) and grep it to build the set of existing slugs / names
  / vendors / domains.
- **Also fold in apps already proposed by open, unmerged discovery PRs** — otherwise two runs fired
  close together (before the first merges) both "discover" the same app and you get duplicate listings
  (a slug double-authored across two PRs). Don't rely on the merge to catch it — by then both PRs exist.
  So: list **open** PRs whose head branch matches `claude/discover-apps-*` (or any open PR that adds
  `data/apps/*.json`), read each one's changed files, and add the slugs + app names they introduce to
  your "already-claimed" set. Use the GitHub MCP tools (list open pull requests → read each candidate
  PR's changed files / diff) or `gh pr list --state open` + `gh pr diff` if available. If you can't
  enumerate open PRs in this environment, say so in the PR body so a human knows the in-flight check was
  skipped.
- **Tally coverage per category** — grep the `"category"` field across `data/apps/*.json`, count each
  value, and note the **thinnest** categories. Compute this fresh each run (it's a moving target; don't
  hardcode counts). These coverage gaps are where the directory most needs growth — you'll bias toward
  them in step 2, subject to the quality bar.

## 2. Discover candidates (web)

- WebSearch for notable, real AI apps that are **not** already listed — recent launches, category
  leaders you're missing, things trending in the period. Aim for a **small, high-quality** set
  (~3–8 strong candidates), not a dump.
- **Bias toward the thinnest categories from step 1** — but the **quality bar is absolute and overrides
  the count bias**: only add genuinely notable, real, verifiable apps; **never pad a thin category with
  marginal entries to raise its count.** Distinguish two reasons a category is thin:
  - **Under-covered** — many real, notable apps exist that we simply haven't listed yet (e.g. `audio`,
    `automation`, `eval`, `observability`, `vision`, `search`, `mcp`, `browser-extension`). Go mine these.
  - **Naturally sparse** — the real-world universe is genuinely small or still nascent (e.g.
    `fine-tuning`, `3d`), so a low count is **correct, not a gap**. Don't force-fill them.

  If a thin category yields nothing worthy this run, **skip it** — that's a success, not a failure. And a
  genuinely notable net-new launch in a **well-covered** category still qualifies; don't skip a major
  release just because its category is full.

- Drop anything that's: already listed **or already proposed in an open discovery PR** (step 1), not
  actually an app (a raw model/paper), low-quality/spam, defunct, or that you can't verify.

## 3. Author the worthy ones

- Follow the **exact authoring spec + conventions + quality bar in `.claude/commands/add-app.md`**
  (schema, required fields, mobile-via-platforms, an authored `insight` per app, the "honest brief"
  enrichment fields — `edge`/`pros`/`cons`/`bestFor`/`alternatives`/`references` — `featured` only for
  true standouts, `addedAt`/`lastVerifiedAt` = today). Web-verify every field; if a fact won't verify,
  use the conservative value and flag it — never invent (`insight`, `edge`, `cons`, and `references`
  especially must be grounded; `references` are verify-or-omit and `alternatives` must be real slugs).
- Write each as its own `data/apps/<slug>.json` (per-file authoring means parallel discovery runs
  never conflict).

## 4. Validate

- `pnpm velite` must pass — it runs `velite build --strict`, which validates every new JSON against
  the schema and **exits non-zero** with a precise per-file error if anything is off (a duplicate slug
  fails too); fix until clean. Then `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean (each
  re-runs the strict validation, so a bad entry hard-fails CI rather than silently dropping). Link-check each new primary URL resolves (a `403` from anti-bot protection on a real
  site is fine; `404`/DNS failure is not — fix or drop).

## 5. Open a PR (this is a scheduled run)

- If you added ≥1 app: create a branch (e.g. `claude/discover-apps-<date>`), commit, push, and open a
  PR into `main`. Title it clearly; in the body list each app (slug · category · pricing) and an
  explicit **"needs human re-verify"** section for anything you couldn't fully confirm. Note which thin
  categories you targeted, and that you de-duplicated against open discovery PRs (step 1) — or flag if
  that check was skipped. **Do not merge.**
- If nothing met the bar: **do nothing** — no branch, no empty PR. Briefly state that you found
  nothing new worth adding this run.

Keep each run small and reversible. It's better to add 3 solid, verified apps than 15 shaky ones.
