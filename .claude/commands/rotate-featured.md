---
description: Rotate the directory's Featured set — one strong app across ~14 random categories — and open a PR
argument-hint: [optional count or category focus, e.g. 14 or "verticals"]
---

You are the **featured-rotation** routine for the Ignaite AI-apps directory (one JSON file per
listing at `data/apps/<slug>.json`, validated by the zod schema in `lib/apps-schema.ts`). The
homepage **Featured carousel** reads every app with `featured: true`; left untouched it goes stale.
This routine refreshes that set on a **biweekly** cadence so discovery stays alive. It runs unattended,
so it ends by **opening a PR for review** — never committing to `main`. **Never fabricate**: this only
re-curates existing, already-verified listings; it does not invent apps or facts.

Optional focus: **$ARGUMENTS** (a count override, or a cluster like `verticals`/`frontier` to bias
category selection; otherwise pick categories at random across all clusters).

Target set size: **14** apps (the carousel's widest responsive count), **one per category** (an app
fills its **primary** `category`'s slot — ignore `secondaryCategories` for selection), across
**14 distinct, randomly chosen categories** — unless `$ARGUMENTS` overrides the count.

## 1. Read the current state — on `main` **and** in open PRs

- List `data/apps/` and grep for `"featured": true` to get the **current featured set** (slugs +
  categories). Grep `"featuredAt"` to see when each was last featured.
- **Fold in any open, unmerged `claude/rotate-featured-*` PR** (GitHub MCP: list open PRs → read its
  changed files) so two runs fired close together don't both rotate and collide. If you can't enumerate
  open PRs here, say so in the PR body.
- Build the list of all categories (`APP_CATEGORIES` in `types/app.ts` — read its length, don't assume a
  count) and tally how many active,
  well-enriched candidates each has — you can only feature a category that has a worthy app.

## 2. Choose this cycle's categories + apps

- **Pick 14 categories at random**, biased **away from** categories featured in the **last ~2 cycles**
  (use `featuredAt` recency on their members) so coverage rotates through every category over successive
  cycles (≈ the category count ÷ 14). Honor a
  `$ARGUMENTS` cluster bias if given. Skip a category that has no worthy candidate (pick another) rather
  than forcing a weak one.
- For each chosen category, select **one** app that is:
  - `status` active (never archived);
  - **well-enriched** — has a strong `edge`, grounded `pros`/`cons`, an authored `insight`, and a recent
    `lastVerifiedAt`; a genuine category standout, not a filler;
  - **not featured in the last ~2 cycles** (lowest/oldest `featuredAt`, or never featured) — spread the
    spotlight; quality still wins over pure rotation if a category has only one obvious leader.
- Quality bar is absolute: a fresh, diverse, genuinely-strong 14 beats hitting the number. If you can
  only fill, say, 11 well this cycle, feature 11 and note why — **never pad**.

## 3. Apply the rotation (data edits only)

For each **newly featured** app (`data/apps/<slug>.json`):

- Set `"featured": true`, set `"featuredAt"` to **today** (`YYYY-MM-DD`), and ensure an `accentColor`
  hex is set (the schema **requires** `accentColor` when `featured` — reuse the app's existing
  `accentColor` if present, else pick a tasteful on-brand hex that suits the app/its category).

For each app **rotating out** (was `featured: true`, not re-chosen):

- Set `"featured": false` (leave `featuredAt` as the historical record; `accentColor` may stay — it's
  optional when not featured).

Touch **only** `featured`, `featuredAt`, and `accentColor` — never edit a listing's factual fields
here (that's `/audit-directory`'s job), and do **NOT** touch `changelog`: rotation is curation, not a
change to the listing, and logging it would flood every app's visible Change history. The audit trail
for rotation is `featuredAt` + the rotation PR itself (+ git history).

## 4. Validate

- `pnpm velite` must pass — it runs `velite build --strict`, validating every JSON against the schema
  and **exiting non-zero** on any error (the `featured ⇒ accentColor` refinement included). Then
  `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean.
- Sanity-check the result: exactly the intended count carry `featured: true`, each across a distinct
  category, each with an `accentColor` + today's `featuredAt`.

## 5. Open a PR (this is a scheduled run)

- Create a branch `claude/rotate-featured-<date>`, commit, push, and open a PR into `main`. In the body,
  list the **new featured set** (slug · category) and the apps **rotated out**, note which categories
  this cycle covered (and which are still waiting their turn), and flag if the open-PR de-dup check was
  skipped. **Do not merge.**
- If the current set is already fresh and diverse (e.g. a rotation ran very recently), it's fine to
  **do nothing** — no branch, no empty PR — and say so briefly.

Keep it reversible and on-brand: the Featured rail is the directory's shop window — 14 sharp, varied,
genuinely-worth-it picks every cycle.
