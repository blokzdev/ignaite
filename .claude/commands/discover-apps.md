---
description: Autonomously discover net-new AI apps worth listing, author them, and open a PR
argument-hint: [optional focus, e.g. a category or theme]
---

You are the **unattended discovery** routine for the Blokz.dev AI-apps directory (`data/apps.ts`).
This is the schedulable counterpart to `/add-app` (which needs explicit names) — here you find the
apps yourself. Built to run with no human in the loop, so it ends by **opening a PR for review**, not
committing to main. **Never fabricate** — quality and trust beat quantity.

Optional focus: **$ARGUMENTS** (e.g. a category like `video` or a theme; otherwise scan broadly).

## 1. Know what's already listed

- Read `data/apps.ts` and build the set of existing slugs / names / vendors / domains.
- Note category coverage — favor genuinely thin or fast-moving areas (e.g. `video`, `image-gen`,
  `assistant`, `3d`, `audio`) and recent launches.

## 2. Discover candidates (web)

- WebSearch for notable, real AI apps that are **not** already listed — recent launches, category
  leaders you're missing, things trending in the period. Aim for a **small, high-quality** set
  (~3–8 strong candidates), not a dump.
- Drop anything that's: already listed, not actually an app (a raw model/paper), low-quality/spam,
  defunct, or that you can't verify.

## 3. Author the worthy ones

- Follow the **exact authoring spec + conventions + quality bar in `.claude/commands/add-app.md`**
  (schema, required fields, mobile-via-platforms, no `blokzMark` unless told, `featured` only for true
  standouts, `addedAt`/`lastVerifiedAt` = today). Web-verify every field; if a fact won't verify, use
  the conservative value and flag it — never invent.
- Append into the batch block near the end of `data/apps.ts`.

## 4. Validate

- `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean. Link-check each new primary URL resolves
  (a `403` from anti-bot protection on a real site is fine; `404`/DNS failure is not — fix or drop).

## 5. Open a PR (this is a scheduled run)

- If you added ≥1 app: create a branch (e.g. `claude/discover-apps-<date>`), commit, push, and open a
  PR into `main`. Title it clearly; in the body list each app (slug · category · pricing) and an
  explicit **"needs human re-verify"** section for anything you couldn't fully confirm. **Do not
  merge.**
- If nothing met the bar: **do nothing** — no branch, no empty PR. Briefly state that you found
  nothing new worth adding this run.

Keep each run small and reversible. It's better to add 3 solid, verified apps than 15 shaky ones.
