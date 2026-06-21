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

## 1. Dedup (by slug **and** name **and** primary domain)

The trap is a **slug variant**: the same app re-added under a different slug (e.g. `bland` beside
`bland-ai`, `leonardo` beside `leonardo-ai`) — a slug-only check sails right past it. So check **all
three** signals against every existing listing (and open discovery PRs):

- **Normalized name** — lowercase + strip non-alphanumerics (`"Bland AI"` → `blandai`).
- **Primary-link domain** — the host of the candidate's primary URL, `www.`-stripped (`bland.ai`).
- **Slug** — the filename.

Run this candidate checker over `data/apps/*.json` (edit the `cands` list to your candidates):

```bash
node -e '
const fs=require("fs"),p="data/apps";
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"");
const host=u=>{try{return new URL(u).host.replace(/^www\./,"").toLowerCase()}catch{return""}};
const idx=fs.readdirSync(p).filter(f=>f.endsWith(".json")).map(f=>{const a=JSON.parse(fs.readFileSync(p+"/"+f,"utf8"));return{slug:a.slug,n:norm(a.name),h:host((a.links.find(l=>l.primary)||a.links[0]).url)};});
const cands=[["EXAMPLE NAME","https://example.com"]]; // ← your [name, primaryUrl] pairs
for(const [name,url] of cands){const n=norm(name),h=host(url);const hit=idx.filter(e=>e.n===n||e.h===h);
console.log(hit.length?("DUP  "+name+"  ->  "+hit.map(e=>e.slug+" ["+[e.n===n?"name":"",e.h===h?"domain":""].filter(Boolean).join("+")+"]").join(", ")):("ok   "+name));}'
```

- A **name OR domain** hit means it's almost certainly already listed → **stop** and tell the user
  (offer `/audit-directory <slug>` to refresh it instead).
- A **domain** hit with a genuinely **different product name** can be a legitimate sibling on a shared
  company domain (e.g. `langchain`/`langgraph`, `adobe-express`/`adobe-firefly`) — allowed, but only
  when it's truly a distinct product, not the same app.
- Backstop: `velite build --strict` now **hard-fails** on a duplicate (same normalized name + primary
  domain), so a missed dup fails CI — but catch it here first to avoid wasted authoring.

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
`AppPlatform`), `links` (≥1, **exactly one** `primary: true`), `addedSeq` (the **accession
number** — the directory's total add-order chronology, what the Newest/Oldest sort orders by:
take the highest existing `"addedSeq"` across `data/apps/*.json`, **plus any claimed by open
discovery PRs**, and assign +1; multiple apps in one run get consecutive numbers; never reuse or
renumber — velite hard-fails duplicates and any seq that contradicts `addedAt` order).
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
- **No cross-field redundancy** — each distinctive point gets ONE home. The `tagline` *describes*
  what the app is/does; it does **not** sell (no stats, superlatives, or comparative claims — those
  are `edge`/`pros`, and a headline stat belongs in `description`). A distinctive stat/phrase (e.g.
  "130+ languages", "50M+ users") may appear in `description` **once** + **at most one** of
  {`edge`, `pros`} — **never** stacked across tagline + edge + pros (it piles up in the detail
  page's masthead → edge callout → pros box and reads repetitive). Resolution: comparative → `edge`;
  non-obvious fact → `insight`; one discrete strength among several → `pros`; else the lone plain
  mention stays in `description`. Before saving, re-read the six text fields together and strip any echo.
- **`featured: true`** sparingly (it spans 2 columns + enters the carousel) — only for true standouts,
  and only if the user agrees.
- Pick the most specific fitting **primary** `category`; favor thin/empty ones where the app genuinely
  belongs (check coverage). Extending the `AppCategory` union is allowed if a real new use-case has no
  home — if so, add it in **four** places: the `AppCategory` union **and** the `APP_CATEGORIES` tuple in
  `types/app.ts` (the zod schema derives its enum from the tuple), the `CATEGORY_LABEL` map in
  `lib/tools/category-labels.ts`, the `CATEGORY_DESCRIPTION` map in `lib/tools/category-meta.ts`, and the
  matching cluster's `categories` list in `lib/tools/category-clusters.ts`. Compile-time guards
  (`Record<AppCategory,…>` + the cluster guard) fail the build until label, description, and cluster all
  exist; everything else (filters, category pages, sitemap, palette) is enum-driven and follows.
- **`secondaryCategories`** (optional array, ≤2) — additional categories the app **genuinely also
  belongs to** (a real second home a user would reasonably look under too), distinct from the primary
  `category`. Setting them drives **full cross-category membership** — the app then appears on each
  category's page, filter, count, and sitemap entry — while the primary `category` stays the single
  canonical home (the card chip, related rail, breadcrumb, JSON-LD, and sort). **Strict bar:** never the
  primary, never a mere tag-mention or tangential feature; **most apps get none.** The schema refine
  rejects self-refs and duplicates. (Example: a meeting notetaker that's also a sales/revenue-intelligence
  platform → `category: "meeting"`, `secondaryCategories: ["sales"]`.)
- One file per app means concurrent `/add-app` / `/discover-apps` runs never conflict; display order
  is sort-driven, not file order.

## 4. Validate

- `pnpm velite` must pass — it runs `velite build --strict`, validating the new JSON against the schema
  and **exiting non-zero** with a precise per-file error (bad enum, >140-char insight, missing/duplicate
  primary link, non-ISO date, duplicate slug, a **duplicate listing** sharing a name + primary domain
  with another entry, …) if anything is off; fix until clean. Then
  `pnpm typecheck`, `pnpm lint`, `pnpm build` must be clean.
  Link-check the primary URL resolves. An anti-bot block (`403`/`429`/`503`) on a **demonstrably
  live** site is fine — don't skip the app: corroborate liveness via independent current sources
  (search results, live docs/blog subdomains, recent third-party coverage), verify fields from
  those sources, and flag the blocked primary URL in your summary. A `404`/dead domain/DNS failure
  is not fine.
- Spot-check it renders on `/` and at `/apps/<slug>`.

## 5. Report

- A short table of what you added (slug · category · pricing · platforms · insight), and an explicit
  list of any fields you couldn't fully verify so the user can confirm. Don't commit unless the user
  asked.
