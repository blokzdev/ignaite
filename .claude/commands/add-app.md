---
description: Research and author one or more new apps into the directory (data/apps/<slug>.json)
argument-hint: <app name | url | comma-separated list>
---

You are adding new entries to the Blokz.dev **AI-apps directory**. Each listing is **one JSON file**
at `data/apps/<slug>.json`, validated at build by the zod schema in `lib/apps-schema.ts` (the source
of truth) and aggregated by Velite. The directory is the product — accuracy and consistency matter
more than speed. **Never fabricate a fact.**

Apps to add: **$ARGUMENTS**
(If empty, ask the user which app(s) to add, or accept a name/URL list.)

> This command is **name-driven** (a human supplies the apps). For unattended / scheduled discovery —
> finding net-new apps with no input and opening a PR — use **`/discover-apps`** instead.

Work through this flow for each app:

## 1. Dedup

- Check `data/apps/` for an existing file by likely slug, and grep the dir for the name / vendor /
  homepage domain. If it already exists, stop and tell the user (offer `/audit-directory <slug>` to
  refresh it instead). The filename **is** the slug, so slugs are unique by construction.

## 2. Research (web-verify — no guessing)

- Fetch the official site (+ its `/pricing`) with WebSearch/WebFetch. Confirm:
  - **what it does** (one crisp sentence), **category**, **vendor**, **official URL**,
  - **pricing** tier, **platforms** (incl. mobile — see note below), **model support**.
- Prefer the canonical domain as the `primary` link. If a fact can't be verified, pick the
  conservative value and flag it in your summary as "needs human re-verify" — do not invent.

## 3. Author the entry (schema: `lib/apps-schema.ts`; types re-exported from `types/app.ts`)

Write a new file `data/apps/<slug>.json` — a single JSON object (quoted keys, no comments/trailing
commas). The zod schema validates it at build (`pnpm velite`, which runs `velite build --strict`) with
a precise per-file error if anything is off.

Required: `slug` (unique, kebab-case), `name`, `tagline` (≤100 chars, one line), `description`
(2–4 sentences), `category` (an `AppCategory`), `pricing` (an `AppPricing`), `platforms` (≥1
`AppPlatform`), `links` (≥1, **exactly one** `primary: true`).
Recommended: `insight` (the "Worth knowing" fact — see below), `vendor`, `modelSupport`
({ `kind`, `models?`, `notes?` }), `tags` (3–5), `accentColor` (brand hex), `addedAt` +
`lastVerifiedAt` = **today's date** (YYYY-MM-DD), plus the two facets below.

Do **not** seed a `changelog` on a new entry — the detail page derives the "Listed · `addedAt`" origin
node, and the `changelog` trail is reserved for substantive changes recorded later by `/audit-directory`.

Conventions (match existing entries):

- **`pricing` is cost only** (`free` / `freemium` / `paid` / `byo-key`) — there is **no
  `"open-source"` pricing value.** Open source is a separate signal: set **`openSource: true`** when
  the app's own source is open (a tool can be `freemium` AND `openSource`, e.g. Zed). Proprietary →
  leave `openSource` unset.
- **`deployment`** (`cloud` / `self-host` / `local` / `hybrid`) — set it where hosting is a real axis
  (services, self-hostable infra, desktop apps). Leave it **unset** for pure libraries / SDKs /
  MCP servers / browser extensions (they aren't "deployed"; `platforms` covers them).
- Model-serving / inference / gateways (Groq, OpenRouter, Together, Replicate, …) go in the
  **`inference`** category; reserve `fine-tuning` for training-focused tools.
- **No store link kinds exist** (`AppLinkKind` = website/docs/github/pricing/demo/video/twitter/discord).
  For apps with a Play Store / App Store presence, put `"android"`/`"ios"` in `platforms` and link the
  **official website** as primary (see `suno`, `perplexity`).
- **`insight`** — "Worth knowing", the directory's signature signal. Author ONE ≤140-char sentence
  stating a single _verifiable, non-obvious FACT_ the description doesn't carry: an acquisition/funding
  event, origin/lineage, a licensing nuance, a pivot/rename, a rare/unusual capability, or a notable
  "first"/standing. It is **not comparative** (that's `edge`) and **not a restatement of what it does**
  (that's `description`/`tagline`). Ground it in research; never fabricate; **omit if no sharp fact
  verifies** — coverage is intentionally partial, not universal. See the field's JSDoc in `types/app.ts`.
- **Enrichment — the "honest brief"** (all optional; omit > fabricate; verify each; same discipline as `insight`):
  - **`edge`** (≤160 chars) — the _comparative_ one-liner: what it does better than its category peers
    ("why pick THIS one"). One complete sentence, comparative + specific; distinct from `insight`; omit
    if no clear edge. (Author it to length — don't write long then truncate; a cut sentence loses its point.)
  - **`pros`** / **`cons`** (≤5 each, items ≤60 chars) — grounded strengths / honest limitations.
    Factual, non-marketing, never competitor-bashing. `cons` are the trust signal — never invent.
  - **`bestFor`** (≤4, items ≤32 chars) — use-case / audience descriptors ("Self-hosted teams").
  - **`alternatives`** (≤4 app **slugs**) — curated head-to-head competitors (prefer same category, may
    cross). Each must be an existing slug — validated in `velite.config.ts`'s `complete()` hook (bad/self
    refs fail the build). Powers the detail page's "Alternatives to <name>" rail (falls back to the
    derived same-category "Related" rail when unset).
  - **`references`** (≤4) — `{ title (≤80), url, source? (≤40), kind? }` (kind ∈ review|guide|benchmark|comparison|interview|analysis).
    **Third-party** coverage independent of the vendor (NOT its own site/docs). **Only real URLs you
    actually fetched — never construct a plausible link.** Omit if none verifiable.
- **`featured: true`** sparingly (it spans 2 columns + enters the carousel) — only for true standouts,
  and only if the user agrees.
- Pick the most specific fitting `category`; favor thin/empty ones where the app genuinely belongs
  (check coverage). Extending the `AppCategory` union is allowed if a real new use-case has no home —
  if so, add it to **both** the `AppCategory` union and the `APP_CATEGORIES` tuple in `types/app.ts`
  (the zod schema derives its enum from the tuple automatically) and the single `CATEGORY_LABEL` map in
  `lib/tools/category-labels.ts` (the one source of truth, re-exported from `hooks/use-directory-filters.ts`;
  `Record<AppCategory,string>` makes a missing label a compile error).
- One file per app means concurrent `/add-app` / `/discover-apps` runs never conflict; display order
  is sort-driven, not file order.

## 4. Validate

- `pnpm velite` must pass — it runs `velite build --strict`, validating the new JSON against the schema
  and **exiting non-zero** with a precise per-file error (bad enum, >140-char insight, missing/duplicate
  primary link, non-ISO date, duplicate slug, …) if anything is off; fix until clean. Then
  `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean.
  Link-check the primary URL resolves (a `403` from anti-bot protection on a real site is fine; a
  `404`/DNS failure is not).
- Spot-check it renders on `/` and at `/apps/<slug>`.

## 5. Report

- A short table of what you added (slug · category · pricing · platforms · insight), and an explicit
  list of any fields you couldn't fully verify so the user can confirm. Don't commit unless the user
  asked.
