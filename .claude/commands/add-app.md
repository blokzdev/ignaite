---
description: Research and author one or more new apps into the directory (data/apps.ts)
argument-hint: <app name | url | comma-separated list>
---

You are adding new entries to the Blokz.dev **AI-apps directory** (`data/apps.ts`). The directory is
the product — accuracy and consistency matter more than speed. **Never fabricate a fact.**

Apps to add: **$ARGUMENTS**
(If empty, ask the user which app(s) to add, or accept a name/URL list.)

Work through this flow for each app:

## 1. Dedup

- Search `data/apps.ts` for the name, likely slug, vendor, and homepage domain. If it already exists,
  stop and tell the user (offer `/audit-directory <slug>` to refresh it instead).

## 2. Research (web-verify — no guessing)

- Fetch the official site (+ its `/pricing`) with WebSearch/WebFetch. Confirm:
  - **what it does** (one crisp sentence), **category**, **vendor**, **official URL**,
  - **pricing** tier, **platforms** (incl. mobile — see note below), **model support**.
- Prefer the canonical domain as the `primary` link. If a fact can't be verified, pick the
  conservative value and flag it in your summary as "needs human re-verify" — do not invent.

## 3. Author the entry (schema: `types/app.ts`)

Required: `slug` (unique, kebab-case), `name`, `tagline` (≤100 chars, one line), `description`
(2–4 sentences), `category` (an `AppCategory`), `pricing` (an `AppPricing`), `platforms` (≥1
`AppPlatform`), `links` (≥1, **exactly one** `primary: true`).
Recommended: `vendor`, `modelSupport` ({ `kind`, `models?`, `notes?` }), `tags` (3–5),
`accentColor` (brand hex), `addedAt` + `lastVerifiedAt` = **today's date** (YYYY-MM-DD).

Conventions (match existing entries):

- **No store link kinds exist** (`AppLinkKind` = website/docs/github/pricing/demo/video/twitter/discord).
  For apps with a Play Store / App Store presence, put `"android"`/`"ios"` in `platforms` and link the
  **official website** as primary (see `suno`, `perplexity`).
- **`blokzMark`** (`deployed`/`vetted`/`contributing`) ONLY if the user says Blokz genuinely uses/vets
  it. Default: omit.
- **`featured: true`** sparingly (it spans 2 columns + enters the carousel) — only for true standouts,
  and only if the user agrees.
- Pick the most specific fitting `category`; favor thin/empty ones where the app genuinely belongs
  (check coverage). Extending the `AppCategory` union is allowed if a real new use-case has no home —
  if so, also add it to `APP_CATEGORIES` and the three `CATEGORY_LABEL` maps (`tool-card.tsx`,
  `app-detail.tsx`, `hooks/use-directory-filters.ts`).
- Append into the batch block near the end of `data/apps.ts` (display order is sort-driven, not file
  order).

## 4. Validate

- `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean. Link-check the primary URL resolves
  (a `403` from anti-bot protection on a real site is fine; a `404`/DNS failure is not).
- Spot-check it renders on `/` and at `/apps/<slug>`.

## 5. Report

- A short table of what you added (slug · category · pricing · platforms), and an explicit list of any
  fields you couldn't fully verify so the user can confirm. Don't commit unless the user asked.
