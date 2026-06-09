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

### Chunk ledger (continuous letter sequence)

Chunks use one global A→Z sequence across iterations. Iteration 4 ran A0–E; Iteration 5 picks
up at **F**. (There was no roadmap file before this one — A0–E were tracked in commit messages
and `BACKLOG.md`'s Resolved archive, which is why "chunk F" didn't appear to exist yet.)

| Chunk | What                                                                                   | PR        | Status |
| ----- | -------------------------------------------------------------------------------------- | --------- | ------ |
| A0    | Schema sweep + migrate 16 entries to the `App` shape                                   | #12       | ✅     |
| A1    | +18 entries — agent / orchestration / vector-db                                        | #13       | ✅     |
| A2    | +18 entries — voice / vision / image-gen / video / audio                               | #14       | ✅     |
| A3    | +18 entries — search / observability / fine-tuning / browser-ext / automation          | #15       | ✅     |
| A4    | Freshness audit + status filter + platform contract                                    | #16       | ✅     |
| B     | Route restructure (`/tools`→`/`, home→`/about`, consolidate portfolio)                 | #17       | ✅     |
| C     | Per-app detail pages + SEO                                                             | #18       | ✅     |
| D     | UX polish — featured carousel, multi-select, sort, infinite scroll                     | #19       | ✅     |
| E     | Sponsored slots scaffold + 1 self-promo                                                | #21       | ✅     |
| —     | Featured-carousel polish · legacy `/apps` redirect hotfix                              | #22 · #20 | ✅     |
| F     | Design-system foundation (tokens + utilities + UI primitives)                          | #25       | ✅     |
| G     | Mobile directory hardening                                                             | #26       | ✅     |
| —     | Recovery-oriented empty state (ghost grid + chips)                                     | #27       | ✅     |
| H-1   | Mobile filter drawer + active-filter pills + clear-all undo                            | #28       | ✅     |
| H-2   | ⌘K command palette (global, lazy)                                                      | #29       | ✅     |
| I     | Interactive featured carousel (arrows, dots, fade) + a11y fix                          | #30       | ✅     |
| J     | Detail pages + sticky mobile action bar                                                | #31       | ✅     |
| K     | **/workflow narrative redesign** (vibecoding guide; K-1/K-2/K-3) — _later unpublished_ | #32–#35   | ✅     |
| —     | Unpublish `/workflow`; refocus on the directory (+ product-direction sweep)            | #36       | ✅     |
| L     | About + Portfolio section revamp (rhythm · contrast · stats strip)                     | #37       | ✅     |
| M-1   | Directory-app chrome (auto-hiding nav + filter-bar pin · ⌘K trigger · active route)    | #38       | ✅     |
| M-2   | Global hardening + a11y gate (dvh/scroll-padding · /contact contrast · raise to 0.98)  | #39       | ✅     |
| —     | Bugfix: `overflow:hidden`→`clip` so the directory filter bar's `sticky` actually pins  | —         | 🟦     |
| N-1   | Taxonomy v2 — +16 categories, one label map, hide empty chips (foundation)             | —         | 🟦     |
| N-2   | Taxonomy v2 — populate creator/consumer categories (writing…companion)                 | —         | ⬜     |
| N-3   | Taxonomy v2 — populate verticals + frontier (support…robotics)                         | —         | ⬜     |
| N-4   | Taxonomy v2 — align CLAUDE.md + docs + discover/audit routines                         | —         | ⬜     |

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

### 🟦 Chunk K — /workflow narrative redesign (realistic vibecoding guide)

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

### 🟦 Chunk L — About + Portfolio section revamp

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

## Iteration 6 — Directory taxonomy v2 (Chunk N) 🟦 in progress

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

## After Iteration 5

Remaining `BACKLOG.md` items are mostly `[user]` launch blockers (Vercel env, Resend domain,
vector logo, real copy, Play Store deep links) and post-launch ops (Playwright smoke suite,
Lighthouse-CI, Geist-in-OG, hero particles). Revisit and sequence once Iteration 5 lands.
