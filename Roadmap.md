# Roadmap

The forward-looking companion to `BACKLOG.md`. `BACKLOG.md` tracks discrete deferred items;
this file tracks **iterations and their chunks** — the larger arcs of work, each chunk a
single PR. Use it to see where we are and what's next.

**Workflow**: each chunk below is planned in detail with the plan tool _just before_ it's
executed, then shipped as its own PR on its own branch, pausing for review between chunks.
When a chunk ships, tick it here and fold any spillover into `BACKLOG.md`.

Status legend: ⬜ planned · 🟦 in progress · ✅ shipped

---

## Shipped iterations (summary)

- **Iteration 1 — Brand pivot to the AI frontier** (Sub-plan A). Positioning, manifesto, SEO,
  OG. ✅
- **Iteration 2 — Home refinement + apps lifecycle.** Hero, Now/Next band, status lifecycle. ✅
- **Iteration 3 — Workflow build-out.** Five-phase scrolly, cinematic chapters, MDX artifacts. ✅
- **Iteration 4 — Apps directory revamp** (chunks A0–E). Schema sweep, data fill, route
  restructure (`/tools`→`/`), per-app detail pages, UX polish (carousel, multi-select, sort,
  infinite scroll), sponsored slots. ✅
- **Workflow narrative migration** (Sub-plan B): B-1 showcase, B-2 Eval Forge artifacts, B-3
  Edge Memo artifacts — all three sample products fleshed to full depth. ✅
- **Iteration 5 — Directory-grade UI/UX refinement** (chunks F–M). Design-system foundation,
  mobile hardening, ⌘K palette, filter UX, carousel, detail pages, global chrome + a11y gate. ✅
- **Iteration 6 — Directory taxonomy v2** (chunk N). +16 categories (→ 39), populated. ✅
- **Iteration 7 — Listing enrichment** (chunk O). "Honest brief" 5 fields + `insight` →
  "Worth knowing" fact, backfilled across the directory. ✅
- **Iteration 8 — Ignaite rebrand + directory product polish** (chunks P–S). Blokz → Ignaite,
  PWA, detail-page DEX refit, share-card OG, homepage elevation. ✅

### Chunk ledger (continuous letter sequence)

Chunks use one global A→Z sequence across iterations. Iteration 4 ran A0–E; Iteration 5 picks
up at **F**. (There was no roadmap file before this one — A0–E were tracked in commit messages
and `BACKLOG.md`'s Resolved archive, which is why "chunk F" didn't appear to exist yet.)

| Chunk | What                                                                                             | PR        | Status |
| ----- | ------------------------------------------------------------------------------------------------ | --------- | ------ |
| A0    | Schema sweep + migrate 16 entries to the `App` shape                                             | #12       | ✅     |
| A1    | +18 entries — agent / orchestration / vector-db                                                  | #13       | ✅     |
| A2    | +18 entries — voice / vision / image-gen / video / audio                                         | #14       | ✅     |
| A3    | +18 entries — search / observability / fine-tuning / browser-ext / automation                    | #15       | ✅     |
| A4    | Freshness audit + status filter + platform contract                                              | #16       | ✅     |
| B     | Route restructure (`/tools`→`/`, home→`/about`, consolidate portfolio)                           | #17       | ✅     |
| C     | Per-app detail pages + SEO                                                                       | #18       | ✅     |
| D     | UX polish — featured carousel, multi-select, sort, infinite scroll                               | #19       | ✅     |
| E     | Sponsored slots scaffold + 1 self-promo                                                          | #21       | ✅     |
| —     | Featured-carousel polish · legacy `/apps` redirect hotfix                                        | #22 · #20 | ✅     |
| F     | Design-system foundation (tokens + utilities + UI primitives)                                    | #25       | ✅     |
| G     | Mobile directory hardening                                                                       | #26       | ✅     |
| —     | Recovery-oriented empty state (ghost grid + chips)                                               | #27       | ✅     |
| H-1   | Mobile filter drawer + active-filter pills + clear-all undo                                      | #28       | ✅     |
| H-2   | ⌘K command palette (global, lazy)                                                                | #29       | ✅     |
| I     | Interactive featured carousel (arrows, dots, fade) + a11y fix                                    | #30       | ✅     |
| J     | Detail pages + sticky mobile action bar                                                          | #31       | ✅     |
| K     | **/workflow narrative redesign** (vibecoding guide; K-1/K-2/K-3) — _later unpublished_           | #32–#35   | ✅     |
| —     | Unpublish `/workflow`; refocus on the directory (+ product-direction sweep)                      | #36       | ✅     |
| L     | About + Portfolio section revamp (rhythm · contrast · stats strip)                               | #37       | ✅     |
| M-1   | Directory-app chrome (auto-hiding nav + filter-bar pin · ⌘K trigger · active route)              | #38       | ✅     |
| M-2   | Global hardening + a11y gate (dvh/scroll-padding · /contact contrast · raise to 0.98)            | #39       | ✅     |
| N-1   | Taxonomy v2 — +16 categories, one label map, hide empty chips (foundation)                       | #117      | ✅     |
| N-2/3 | Taxonomy v2 — populate all 16 new categories (+101 apps, 16 re-files)                            | #118      | ✅     |
| N-4   | Taxonomy docs/routine alignment — _folded into Chunk O_                                          | —         | ✅     |
| O-1   | Listing enrichment — the "honest brief" (5 fields) + full backfill of all 388                    | #119      | ✅     |
| O-2   | Repurpose `insight` → "Worth Knowing" fact (relabel + re-author the redundant ~45%)              | #120      | ✅     |
| P     | Ignaite rebrand (Blokz → Ignaite) + plasma wordmark/favicons                                     | #102–#103 | ✅     |
| Q     | PWA — hand-rolled service worker + custom install prompt + `/offline`                            | #116      | ✅     |
| R     | Detail-page DEX refit + state-aware back-crumb + enriched per-app share-card OG (Geist)          | #120–#131 | ✅     |
| S     | Homepage/directory elevation — masthead plasma, hero slogan, mobile quick-sort                   | #132–#137 | ✅     |
| T     | Sort overhaul (two-field + flip, dropdown z-fix) + fresh recent rail                             | #144      | ✅     |
| U     | Featured rotation — `/rotate-featured` routine + `featuredAt` field (biweekly)                   | #145      | ✅     |
| V-1   | Performance + SEO — 39 SSG category pages + link mesh + 82% homepage HTML cut                    | #161      | ✅     |
| V-2   | Performance + SEO — structured-data pack, tag deep-links, llms.txt, JSON feed                    | #162      | ✅     |
| V-3   | Performance + SEO — CSP/security headers, build-stamped SW, LHCI fix, portfolio removal          | #163      | ✅     |
| V-4   | Public-repo hygiene — README refresh + FSL-1.1-MIT / CC BY-NC licensing                          | #164      | ✅     |
| X     | Comparisons engine — /compare hub + ~3.1k SSG head-to-heads (curated `alternatives`)             | #332      | ✅     |
| Z     | Insights v1 — /insights hub, hand-rolled SSG charts (no dep), coverage-honest aggregates         | #333      | ✅     |
| AA    | Capability schema — 155-leaf `AppCapability` enum + labels + alias map (id-only; level deferred) | #334      | ✅     |
| AB    | Capability backfill — Build-cluster calibration pilot (110 apps)                                 | #335      | ✅     |
| AB-2  | Capability fan-out — 8 domain clusters + straggler sweep → 100% active coverage (1,015/1,017)    | #336–#346 | ✅     |

---

## Iteration 9 — Directory browse & discovery freshness (Chunks T–U) ✅ complete

The screenshot-driven follow-up to the directory work: fix the sort control and keep the two
discovery rails from going stale.

- **Chunk T — Sort + rails (#144).** The mobile sort dropdown read as see-through (a z-index token
  typo — `z-[var(--z-overlay)]` vs the real `--z-index-overlay`; the sticky console painted over the
  portaled menu); fixed by using the `z-overlay`/`z-sticky` utilities. Replaced the redundant
  "Featured" sort with a **two-field + flip** model (`newest`/`oldest`/`az`/`za`, default Newest;
  `lib/tools/sort.ts`), active-row highlight instead of the radio dot, and a deterministic slug
  tie-break for bulk same-day adds. The **Recently-added** carousel now shuffles the 30 newest per
  visit (was a static top-14).
- **Chunk U — Featured rotation (#145).** New biweekly `/rotate-featured` routine + optional `featuredAt`
  schema field: features one strong active app across ~14 random categories, rotates the prior set
  out (changelog per change), opens a PR. Keeps the Featured carousel fresh + spreads the spotlight
  across all 43 categories over ~3 cycles.

---

## Iteration 10 — Performance + SEO (Chunk V) ✅ complete

The measurement-driven sweep: three audits (perf payloads, SEO surface, infra/docs) scoped one
chunk across three sequential PRs — make the directory's scale crawlable, cut what nobody
downloads, and harden the edges.

- **Chunk V-1 — Category pages + homepage diet (#161).** 39 pure-RSC `/category/[slug]` landing
  pages (zero route JS) + a `/categories` cluster hub closed the biggest SEO gap (categories
  existed only as `/?category=` query state — zero indexable URLs). Internal-link mesh: detail
  stat-strip category cell, related-rail "View all", footer Browse block, +40 sitemap entries with
  audit-driven `lastModified`. Homepage static fallback trimmed from ALL ~460 cards to the hydrated
  grid's exact first batch: **6.58 MB → 1.20 MB raw HTML (659 → 278 KB gz)**, also fixing a
  fallback-vs-hydrated card-order mismatch.
- **Chunk V-2 — Machine-readable pack (#162).** SoftwareApplication JSON-LD enriched (`sameAs`,
  honest per-tier `offers` — paid apps get none rather than a fabricated price), BreadcrumbList
  via the category pages, WebSite+SearchAction, `<time dateTime>` freshness. Tag chips became
  `/?q=` deep-links (793 free-form tags, 59% singletons → no tag pages; curated pages BACKLOG'd).
  Build-generated `/llms.txt` + `/llms-full.txt` (llmstxt.org) and `/feed.json` (JSON Feed 1.1,
  50 newest), advertised via a site-wide feed alternate in `buildMetadata()`.
- **Chunk V-3 — Headers, SW stamp, removal (#163).** CSP + COOP/Referrer/nosniff/Permissions
  headers in `next.config.ts` (SSG-compatible: `'unsafe-inline'` script/style, preview-only
  vercel.live allowances, dev-only `'unsafe-eval'`). `public/sw.js` → build-stamped
  `app/sw.js/route.ts` (cache name embeds the deploy SHA → byte-diff → reinstall → fresh
  `/offline` precache; closes the stale-precache debt). `lighthouserc.json` stopped auditing the
  dead `/portfolio/blockchair` redirect in favor of `/category/agent`. And the dormant
  **portfolio track was fully removed** (code/data/assets; archive = git `12c3978`; inbound
  redirects retained; `images.remotePatterns` dropped, tightening `img-src` to `'self' data:`).
- **Chunk V-4 — Public-repo hygiene (#164).** README rewritten to current reality (459 listings,
  category pages, machine surfaces, PWA, headers; portfolio removal noted). LICENSE replaced: the
  leftover v1 Glitch-template MIT (wrong copyright holder) → **FSL-1.1-MIT** for code (free
  non-competing use, auto-MIT after 2 years) + a **CC BY-NC 4.0** addendum for the directory's
  editorial content. Fixed the stale "R3F hero on `/`" claims in CLAUDE.md (it renders on `/about`).

---

## Iteration 11 — Directory expansion: Comparisons · Recipes · Insights (Chunks X →) 🟦 in progress

The scope-expansion program (full plan: the approved design doc). Reframes the directory from a
**verified list of atoms** into a **verified graph** via one substrate (a controlled capability
vocabulary) feeding three projections: **Comparisons** (a cheap SEO/link view, no new entity),
**Insights** (a shareable data-viz/backlink layer), and **Recipes** (the one new entity — multi-app
workflows). Governing rule: every surface is a deterministic projection/graph over the verified
corpus, never hand-maintained prose, so the audit moat doesn't multiply.

- **Chunk X — Comparisons engine (#332).** Pure build-time SSG projection over `@/.velite`, no
  schema change. `lib/tools/comparisons.ts` derives the eligible cohort from the curated
  `alternatives` graph (undirected, lexicographic-canonical pairs, both-active) — **3,136 indexed
  head-to-heads** (the doorway-page-safe subset; the mechanical same-category cross-product is
  intentionally NOT generated). `/compare/<a>-vs-<b>` (`dynamicParams=false`, Set-validated — never
  parses `-vs-`) renders an enum-delta table (category/pricing/license/deployment/platforms/model/
  vendor) + side-by-side honest-brief, with `CollectionPage` + `BreadcrumbList` JSON-LD and an
  a11y `<table>`. A bounded `/compare` hub indexes by category and pivots to category pages for the
  long tail. Sitemap wired. **0 B route JS** (pure RSC — the lightest routes on the site).
- **Chunk Z — Insights v1 (#333).** A build-time data-viz layer over the corpus: `lib/stats.ts`
  (server-only aggregates) + `components/insights/bar-chart.tsx` (hand-rolled, pure-RSC, **0 B route
  JS**, no charting dep) + `/insights` hub. Dense honest core: pricing-mix, category-coverage (by
  cluster, unique-primary so totals reconcile), platform reach, plus open-source / deployment /
  model-support — each partial field carries an explicit **"recorded for N of M"** caveat and an
  `Unrecorded` slice (never assumes a value for an unset field). Charts deep-link into the directory
  via `facetHref`/`categoryHref`; `Dataset` JSON-LD; "data as of" provenance. Growth/"what's new"
  charts deferred (single-quarter corpus); `/embed` + per-metric pages → Z-2 (needs a headers sign-off).
- **Chunk AA — Capability schema (this PR).** The keystone substrate: a controlled **155-leaf
  `AppCapability` enum / 14 families** (`types/app.ts`, type derived from the tuple so they can't
  drift) + `CAPABILITY_LABEL` (`lib/tools/capability-labels.ts`, compile-complete `Record`) + a
  synonym→leaf `CAPABILITY_ALIASES` map (`capability-aliases.ts`, the future function-call matcher) +
  the optional `capabilities: [{ id, level?, note? }]` field (id-only v1, `level` deferred, cap 6,
  web-verify-or-omit) + a velite dup-id hard-fail. `bestFor` re-scoped to **persona/audience only**.
  Additive + inert (0 listings carry it yet) → 0 B bundle delta. Taxonomy drafted by a 7-agent
  workflow (survey → synthesize → red-team) + founder sign-off.
- **Chunk Y — Comparison OG + in-product discovery** (next): per-pair Satori OG (guarded endpoint),
  ⌘K + nav + an `/apps/[slug]` "Compare with…" rail, the `noindex,follow` long-tail cohort, llms.txt.
- **Chunk AB / AB-2 — capability backfill ✅** — the parallel-agent campaign: a Build-cluster pilot
  (#335) → an 8-cluster fan-out + straggler sweep (#336–#346), every PR web-verify → adversarial audit →
  defense-in-depth merge, only `capabilities`+`bestFor` touched (`lastVerifiedAt` never bumped).
  **100% active coverage** (1,015/1,017; 2 correctly omitted — no verifiable leaf). The routines
  (`add-app`/`discover-apps`/`audit-directory`) now author + maintain `capabilities` so the gap can't reopen.
- **Chunk AC — capability-aware UI ✅** — split into three merged PRs: detail-page capability chips +
  the `CapabilityFamily` map (#349), the `/compare` capability-overlap row + the deterministic,
  parity-gated "when to pick which" verdict (#350), and the family-level capability Insights chart +
  the `capability → app` machine index (llms.txt / llms-full.txt / feed.json) + a soft velite coverage
  advisory (#351).
- **Chunk AD — the Recipe entity ✅ (#352)** — the directory's first _authored_ content type: a curated
  workflow over listed apps (per-file `data/recipes/*.json` → `lib/recipes-schema.ts` → Velite
  collection → `lib/recipes.ts` + `lib/tools/recipe-index.ts`), `steps[]` each a FK to an app + the
  capability it performs, required `longSummary` + ≥1 independent `references`, the apps audit spine
  reused. `complete()` integrity: step-FK existence / dup-slug / dup-seq / seq↔date hard-fail;
  archived-app dependency → auto-demote to `status:"stale"` + warn (never throws). Shipped with a
  red-teamed **4-recipe substance-floor pilot** (1 dropped for competitor-marketing refs — the gate
  working). **Recipe v1 is a LINEAR ordered chain.**
- **Chunk AE — Recipe routes + SEO (NEXT)** — `/recipes` hub + `/recipes/<slug>` (SSG), `HowTo`
  JSON-LD (semantic/LLM value; Google deprecated the rich result — thesis is internal-link densification
  - llms/feed), per-pair OG, sitemap, recipes in feed.json + llms.txt + ⌘K, the per-app "Used in N
    recipes" rail (`recipesUsingApp`), and the `status:"stale"` renderer. Not a sign-off gate →
    fire-and-forget. Builds against the linear model.
- **Chunk AF — capability `level` + substitution engine** (sign-off gate) — `capabilities[].level`
  (primary/secondary via a second verify pass) + the "prefer fewer platforms / open-source / free"
  set-cover substitution on recipe steps + `author-recipes`/`audit-recipes` routines.
- **Chunk AG — multi-dimensional recipes** (design+pilot; **after AE**, founder-directed) — extend the
  Recipe model beyond the linear chain to **parallel branches + fan-in** (additive: step `id` +
  optional `dependsOn: id[]` → a DAG) and **back-and-forth iteration** (an optional `loop`/group marker
  with an exit condition). Additive, zero migration — the 4 linear recipes stay valid (same
  defer-until-a-consumer-needs-it discipline as `capability.level`). Needs its own pilot (hand-author
  one real parallel + one real iterative recipe), a graph-aware red-team rubric, a flow renderer (linear
  list stays the fallback), and the true graph exposed in the machine surfaces. Note: _arbitrary_
  on-the-fly graph synthesis is the **Recipe Spider's** job; the stored entity stays curated.
- **Capstone vision — the "Recipe Spider"** (post-AF; BACKLOG'd): on-device + cloud recipe synthesis
  over the verified capability graph — deterministic graph traversal first, a small in-browser model
  for intent, a frontier model (Claude) graph-grounded for the hard cases. Every recipe is a path
  through verified nodes, so it inherits the no-fabrication moat. See `BACKLOG.md` → Directory
  expansion → "The Recipe Spider".

---

## Iteration 5 — Directory-grade UI/UX refinement (Chunks F → M) ✅ complete

**Goal**: make ignaite.app look and feel like a polished directory product on every screen
size — fixed/pinned search & filter, mobile layouts with no zoom/overflow, larger tap
targets, and the affordances of a real directory app (command palette, filter drawer, sticky
action bars, carousel navigation).

**Why now**: content and IA are done; the gap is fit-and-finish. Exploration found the design
system is thin (only color + radius tokens; container/section/spacing/z-index scales are
copy-pasted ad-hoc), and the directory has localized mobile gaps (small tap targets, no text
truncation, sort hidden on mobile, an invisible "load more", no loading/empty/end states).

**Dependency posture** (user-approved): add the standard libraries, lazy-loaded / code-split
so the static `/` First Load stays under the 200KB ceiling (CLAUDE.md §10):

- `cmdk` — ⌘K command palette
- `sonner` — toast notifications
- `@radix-ui/react-popover`, `-dropdown-menu`, `-select`, `-scroll-area` — shadcn primitives
  (`@radix-ui/react-dialog` already present; reuse for `sheet`)

**Features locked in** (user-selected): ⌘K command palette · mobile filter drawer + active
filter pills · sticky mobile action bar on detail pages · carousel arrows + dots · plus
opportunistic quick wins uncovered along the way.

**Conventions (every chunk)**: reuse `cn()` + existing `card-bits` glyphs + the `nuqs`
filter store + `useReducedMotion()`; every motion-bearing addition ships a reduced-motion
fallback; RSC-default with small client islands; tokens only in `globals.css`; no barrel
files. Each PR carries the §9 a11y checklist and §15 definition-of-done, and ticks the
relevant `BACKLOG.md` items.

**Per-chunk verification gate**: `pnpm lint` / `typecheck` / `build` clean · `pnpm analyze`
(no stray dep in non-`/`/`/workflow` chunks) · manual responsive pass at
360 / 390 / 768 / 1024 / 1440 / 1920 · keyboard + reduced-motion · Lighthouse mobile ≥90,
a11y ≥98.

Branches: `claude/iter5-chunk-<letter>-<slug>`.

---

### ⬜ Chunk F — Design-system foundation

The shared layer every later chunk builds on; mostly non-visual.

- `app/globals.css`: add z-index / duration / shadow token scales; add `@layer utilities` —
  `.container-site`, `.section-y`, `.h-dvh` / `.min-h-dvh`, `.safe-px`, `.no-scrollbar`
  (consolidate the repeated hidden-scrollbar pattern), `.scroll-fade-x` (edge-fade mask), and
  a styled `::-webkit-scrollbar`.
- `components/ui/`: copy in `input`, `skeleton`, `scroll-area`, `popover`, `dropdown-menu`,
  `select`, `sheet` (Dialog-based), `command`; wire `sonner` `<Toaster/>` in `app/layout.tsx`.
- `hooks/use-scroll-threshold.ts` (generalize nav's inline scrollY>8); `use-media-query` if absent.
- Low-risk sweep: adopt `.container-site` in nav/footer/page shells (mechanical, no visual change).

---

### ⬜ Chunk G — Mobile directory hardening (highest impact)

No overflow/zoom, real controls, real states.

- `tool-card.tsx`: `line-clamp-2` tagline/description, `truncate` vendor, `min-w-0` tag list,
  tags → first N + "+N"; ≥40px secondary links; `@media (hover:hover)` guard on the hover-lift.
- `tool-grid.tsx`: add the missing `md:grid-cols-3` step (1 → sm:2 → md:3 → lg:3 → xl:4).
- `tool-filter-bar.tsx`: chips `h-7→h-9`; `.scroll-fade-x` on filter rows; always show count;
  surface sort on mobile (dropdown-menu). Keep `sticky top-16`.
- `tools-browser.tsx`: replace `sr-only` load-more with a visible ≥44px button on mobile
  (keep IO auto-load on larger screens); skeleton cards on batch append; end-of-results
  marker; richer empty state with a "clear filters" action.

---

### ⬜ Chunk H — Filter UX + ⌘K command palette

- `command-palette.tsx` (`cmdk`): global ⌘K / `/`; fuzzy-search ~70 apps by name/vendor/tag,
  grouped by category → `/apps/[slug]`; quick-actions to category filters, `/workflow`,
  `/contact`. Lazy-loaded; reduced-motion safe.
- Mobile **filter drawer** (`sheet`): all filters + sort, active-filter count badge, apply/clear.
- **Active-filter pills**: removable chip row reflecting `nuqs` state; "clear all" + `sonner` toast.

---

### ⬜ Chunk I — Featured carousel + discovery polish

- `featured-carousel.tsx`: `.scroll-fade-x` mask, desktop prev/next arrows (scroll-by-card),
  scroll-snap position dots, keyboard nav; keep PR #22 `-my-3 py-3` clearance. Optional:
  category quick-jump chip rail that deep-links filter state.

---

### ⬜ Chunk J — Detail pages + sticky mobile action bar

- Extract shared `components/detail/detail-shell.tsx`; adopt in `tools/app-detail.tsx` +
  `apps/project-detail.tsx`.
- **Sticky mobile action bar**: pinned bottom CTA ("Open {app}"), safe-area aware, hidden ≥sm.
- Quick wins: breadcrumb, "copy link" + toast, related rail to shared grid, overflow-proof
  long URLs/tags. SSG must stay intact.

---

### ✅ Chunk K — /workflow narrative redesign (realistic vibecoding guide)

Reframe `/workflow` from an abstract 5-phase showcase into a realistic Claude-Code-session guide:
**4 stages** (Conceptualize → Specify → Build → Ship; env folds into Build), **every stage a chat
transcript with tool-use blocks** (drops the R3F build-tunnel → `three` leaves `/workflow`), keep
the 3 products + 12 artifacts + platform tabs, rename **phase → stage**. Authored against CLAUDE.md

- the user's vibecoding-harness reference. Split into 3 sub-PRs:

* **K-1** — reusable `components/claude-chat/*` (window/message/tool-block) + `harness-bits`
  (DocCard / DocGraph / PlanChecklist) + chat types; dogfooded by rebuilding the Conceptualize chat
  on them (zero visual change). Roadmap reshuffle.
* **K-2** — the redesign: 4-stage model (`stages.ts`), intro/doc-graph, stage segments, recomposed
  page, all stages on `ClaudeChat`, delete bespoke chapters + build-tunnel, author all 4×3
  transcripts.
* **K-3** — voice/tone + platform-depth polish; drop unused `canvas-confetti`.

---

### ✅ Chunk L — About + Portfolio section revamp

- `/about` section-rhythm standardization: responsive `.section-y` + `.section-y-lg` (Manifesto
  centerpiece), adopted across Now/Next, How-we-work, AppsPreview; anchor `scroll-mt` on the real
  targets (`#now-next`, `#portfolio`).
- Contrast sweep on portfolio surfaces: introduced `--color-ink-soft` and removed the sub-AA
  `text-ink-dim/70` labels in `card-bits` `StatLine`, `scroll-cue`, `project-filter-bar`; progresses
  the `[a11y]` 0.98 gate-raise (gate itself retightens in Chunk M).
- Identity pass: a compact, data-derived credibility **stats strip** on `/about`
  (`components/home/stats-strip.tsx` + `lib/projects.ts` `portfolioStats()`) — 9 apps shipped, chains
  explored, building since 2020; no fabricated figures.
- Note: principle-card `<h3>` semantics, the Manifesto-header reduced-motion guard, and card
  hover/touch safety were already correct (Tailwind v4 gates `hover:` + the global
  `[data-motion="reduce"]` rule) — no redundant changes made.

---

### ✅ Chunk M — Global chrome + motion polish (split M-1 chrome / M-2 a11y gate)

**M-1 (directory-app feel):** auto-hiding sticky nav (`use-scroll-direction`, reduced-motion-safe,
reveals on `focus-within`) that publishes `--nav-h`; the directory filter bar sticks to
`top: var(--nav-h)` so it rides to the top edge when the nav hides — a coordinated subsystem, not two
hacks. Plus active-route highlight (`usePathname` + `lib/nav.ts`, nav + mobile sheet), a desktop
"Search ⌘K" pill + a mobile sheet "Search apps…" item (both fire the existing `blokz:open-command`).

**M-2 (hardening, next PR):** `100vh→100dvh` + `min-h-dvh` hero + global `scroll-padding-top:var(--nav-h)`;
`/contact` contrast sweep; raise `lighthouserc.json` a11y gate `0.95→0.98` and close the BACKLOG item.

- `site-nav.tsx`: active-route highlighting (`usePathname()`); **⌘K trigger wired to the
  `blokz:open-command` event** (H-2); optional scroll-direction hide/show via
  `use-scroll-threshold`; mobile-sheet parity.
- `site-footer.tsx`: rhythm via `.container-site` / `.section-y`; tidy mobile meta-row.
- Global: subtle route-change scroll-to-top / page transition (reduced-motion safe); skip-link
  first-focusable audit; final scrollbar / `dvh` / safe-area sweep; **re-raise the Lighthouse a11y
  gate to 0.98** (`lighthouserc.json`).

---

### ↩︎ Out-of-sequence — `/workflow` descoped & unpublished

Product-direction change (not a planned chunk): the `/workflow` section shipped by Chunk K (above)
was **taken off the live site** to keep the homepage directory-focused and the detailed
agentic-engineering process semi-proprietary. It was **not deleted** — the route moved into the Next
private folder `app/(marketing)/_workflow/`, with all `components/workflow/*`, `components/claude-chat/*`,
`content/workflow/*`, `hooks/use-workflow-*`, and `types/workflow.ts` retained dormant in the repo.
Nav / command-palette / sitemap / Lenis references were removed; the "see how we ship" CTAs now point
at a new high-level **"How we work"** band on `/about` (`components/home/how-we-work.tsx`,
`#how-we-work`). Full restore steps + a `[future]` item to build the three sample products for real
live in `BACKLOG.md` → Workflow. (Chunk K's work is preserved, just unpublished.)

---

### ↩︎ Out-of-sequence — portfolio descoped, `/about` fully forward-looking

Product-direction change: the studio's legacy **non-AI Android blockchain explorers** were removed
from the public site to keep the focus on the AI-apps directory + vibecoding studio identity.
`/about` is now fully forward-looking (Hero → Now/Next → How-we-work → Manifesto) — the
portfolio grid + the blockchain-derived stats strip were dropped, and the Now/Next "Now" copy was
reframed off the explorers. The portfolio is **kept dormant** (mirrors `/workflow`): route moved to
`app/(marketing)/_portfolio/`, dropped from the sitemap, `/portfolio/*` + the legacy `/apps/<slug>`
explorer URLs redirect to `/about`. `data/projects.ts` + `components/apps/*` + the orphaned
`apps-preview`/`stats-strip` are retained. The real OSS project **WebSight** is seeded into the data
for the eventual revival (build it out with real AI apps / web apps / OSS over time).

---

## Iteration 6 — Directory taxonomy v2 (Chunk N) ✅ complete

**Goal**: make the category taxonomy all-encompassing and futureproof. The launch set of 23 was
developer/infra-heavy (`ide, mcp, eval, vector-db, inference, fine-tuning, observability, …`) with
no home for the consumer + vertical application layer where AI apps now proliferate. This adds
**16 categories** (→ 39), grouped into Build / Create / Work / Verticals / Frontier clusters, and
**populates every new one** so no chip ships empty.

**New categories**: `security` · `music` · `design` · `writing` · `productivity` · `analytics` ·
`translation` · `meeting` · `marketing` · `support` · `companion` (incl. dating/matchmaking) ·
`healthcare` · `legal` · `finance` · `education` · `robotics`.

**Why now**: the directory is the product; coverage gaps (companions, support, legal, healthcare,
marketing, writing, …) are exactly where new apps land. Surfaced by the request to add
uneversleep (→ `marketing`) and dataing (→ `companion`).

**Delivery — 4 PRs, sequenced `N-1 → (N-2 ∥ N-3) → N-4`** (N-2/N-3 branch off `main` only after
N-1 merges, else `velite --strict` fails on a category not yet in the enum):

- **N-1 (foundation, code-only)**: extend `AppCategory` union + `APP_CATEGORIES` (clustered order);
  consolidate the three drifting `CATEGORY_LABEL` maps into one source of truth
  (`lib/tools/category-labels.ts`, re-exported from `use-directory-filters`); hide globally-empty
  category chips in `directory-console.tsx` so categories can roll out ahead of population.
- **N-2 (data)**: re-file clearly-miscategorized existing listings (with a `changelog` entry each)
  - author net-new apps for the creator/consumer cluster (incl. uneversleep, dataing).
- **N-3 (data)**: author net-new apps for verticals + frontier; re-file any that clearly belong.
- **N-4 (docs/routines)**: align `CLAUDE.md`, this Roadmap, `docs/directory-playbook.md`, and the
  `/discover-apps` · `/audit-directory` · `/add-app` commands to the new taxonomy + label map.

**Conventions**: extend the union (CLAUDE.md §11 allows it) — no schema restructure, no new dep;
`Record<AppCategory, string>` makes label completeness a compile-time guarantee; authoring follows
`.claude/commands/add-app.md` (web-verify, `insight` ≤140, one primary link, no `changelog` on new
entries, `addedAt`/`lastVerifiedAt` = today). Per-chunk gate: `pnpm velite` (strict) / `typecheck`
/ `lint` / `build` clean + responsive/a11y pass.

Branches: `claude/directory-taxonomy-<slug>`.

---

## Iteration 7 — Listing enrichment (Chunk O) ✅ complete

**Goal**: make every listing a _decision brief_, not just a description — owning the "honest,
authoritative, AI-managed" positioning. Extends the editorial system (`insight` + `changelog`) with
five optional, verifiable, durable fields and renders them on the detail page, then backfills all 388.

**Fields** (schema in `lib/apps-schema.ts`; all optional, omit > fabricate): `edge` (≤120-char
comparative one-liner — why pick this over peers) · `pros`/`cons` (grounded strengths / honest limits,
the cons are the trust signal) · `bestFor` (use-case/audience tags) · `alternatives` (curated peer
**slugs**, cross-validated in `velite.config.ts`'s `complete()` hook, upgrade the detail "Related"
rail into "Alternatives to <name>") · `references` (third-party authoritative coverage —
**verify-or-omit**, never the vendor's own pages). Deliberately **no** volatile quantitative metrics.

**Delivered as one PR** (per request): schema + velite cross-ref validation + 5 detail-page UI sections
(`app-detail.tsx`, curated-aware `related-rail.tsx`, `alternativeApps()` in `lib/apps.ts`) + routine/doc
alignment (`add-app.md`, `audit-directory.md`, `discover-apps.md`, `CLAUDE.md` — also finishing the
N-4 taxonomy doc fixes) + full backfill of 388 via parallel agents (patch-file → central merge so
existing fields are never touched). Coverage: edge/pros/cons/bestFor 100%, alternatives ~385/388,
references ~68 (best-effort, link-checked). Quality bar over completeness — fields omitted, never
invented; one acquirer error (`lakera` Cisco→Check Point) corrected along the way.

**O-2 — repurpose `insight` → "Worth Knowing".** Adding `edge` (O-1) collided with the older `insight`
field: a sample found ~45% of insights paraphrased the description or duplicated `edge`, while the good
~55% were all verifiable FACTS. O-2 sharpens `insight` into a typed **"Worth knowing"** fact (one
verifiable, non-obvious fact the description can't carry — acquisition/lineage/licensing/pivot/rare
capability; never comparative, never a paraphrase), relabels the callout (Lightbulb icon; data key
`insight` unchanged), re-authors the redundant ~45% (rewrite-to-fact or omit — coverage now
intentionally partial), and rewords the brand/routine docs. Clean three-signal detail page: _what it
is_ (`description`) · _a fact worth knowing_ (`insight`) · _why pick it_ (`edge`).

---

## Iteration 8 — Ignaite rebrand + directory product polish (chunks P–S) ✅ complete

Logged retroactively during a docs-reconcile pass — this work shipped PR-by-PR after the roadmap
ledger had gone stale, so the chunk letters here are narrative, not PR-number-ordered (the rebrand
landed around the same window as Chunk N). Summary-grade; representative PRs cited.

- **Chunk P — Ignaite rebrand.** Renamed the product from Blokz → **Ignaite** (ignaite.app) across
  brand data, copy, and metadata; animated the wordmark "AI" as fluid plasma; completed
  cross-device favicons (#102, #103).
- **Chunk Q — PWA.** Shipped a hand-rolled service worker (`public/sw.js`), a custom bottom
  install prompt (`components/pwa/*`, `hooks/use-install-prompt.ts`), manifest shortcuts, and an
  `/offline` fallback (#116). _(Closes the BACKLOG "Full PWA installability" item.)_
- **Chunk R — Detail-page DEX refit + share cards.** Two-column "zone model" `/apps/[slug]`
  (masthead · stat strip · dossier rail), static toolbar, state-aware back-crumb with a scrollable
  trail, mobile share sheet, and an enriched per-app **share-card OG rendered in Geist**
  (`lib/og-image.tsx` + `app/(marketing)/apps/[slug]/opengraph-image.tsx`) (#120–#131). _(Closes
  the BACKLOG "Geist-in-OG" + "per-app `/apps/[slug]` OG" items.)_
- **Chunk S — Homepage / directory elevation.** Masthead plasma, new hero slogan + cyan-weighted
  seamless plasma, mobile quick-sort dropdown, skeleton-card fidelity, and assorted console
  bugfixes (#132–#137).
- **Ongoing `/discover-apps` routines** grew the directory from **388 → 408** listings across the
  39-category taxonomy.

---

## After Iteration 5

Remaining `BACKLOG.md` items are mostly `[user]` launch blockers (Vercel env, Resend domain,
vector logo, real copy, Play Store deep links) and post-launch ops (Playwright smoke suite,
Lighthouse-CI, Geist-in-OG, hero particles). Revisit and sequence once Iteration 5 lands.
