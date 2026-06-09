# Backlog

Single source of truth for "tracked but deferred" work. Distinct from the implementation plan and from the `CLAUDE.md` contract.

## Conventions

Tag every item with a category:

- **[user]** — needs your input, decision, or asset
- **[polish]** — deferred refinement; safe to ship without
- **[debt]** — workaround that should be unwound when adjacent code is next touched
- **[verify]** — sanity check / external confirmation before launch
- **[future]** — explicitly post-v2

Mark done with `- [x]` and move to the **Resolved** section. Inline `// TODO(category): <message>` comments in code should mirror an entry here when the action isn't purely code-local.

---

## Pre-launch blockers (user action required)

These gate a clean v2 launch. Everything else can ship without.

- [ ] **[user]** Set Vercel env vars (Production + Preview): `RESEND_API_KEY`, `CONTACT_TO_EMAIL=team@ignaite.app`, optional `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL=https://ignaite.app`. Without `RESEND_API_KEY` the contact form returns an "Email is offline" notice instead of submitting.
- [ ] **[user]** Verify the `ignaite.app` domain inside Resend (Settings → Domains) so the contact form can send from `Ignaite <hello@ignaite.app>`. Until verified, leave `CONTACT_FROM_EMAIL` unset and the form falls back to `onboarding@resend.dev`.
- [ ] **[user]** Confirm `team@ignaite.app` is actively monitored (the destination for every form submission). Optionally mirror submissions to a Telegram/Discord webhook on submit.
- [ ] **[future]** Rebrand cutover leftovers — when `/workflow` or `/portfolio` is revived, rebrand the dormant Blokz references they carry: the fictional "Blokz Brief" sample + `*.blokz.dev` subdomains in `content/workflow/**` and `components/workflow/workflow-intro.tsx`, `data/projects.ts` (portfolio), and the `next.config.ts` slugs `blokz-oss`/`blokz-ai-incoming`. Internal event/storage keys `blokz:*` are non-user-facing and can stay. The product is now **Ignaite** (ignaite.app); the company stays **Blokz Development Co.**
- [ ] **[verify]** Confirm `public/app-ads.txt` is still required by Play Store ad SDKs (preserved verbatim from the legacy site).

## Pre-launch polish (optional, can ship without)

Things that would make the site feel more "us" before the world sees it.

- [ ] **[user]** Provide a vector SVG Blokz logo (wordmark + monogram). Replace the legacy `cdn.glitch.global` PNG referenced in `data/brand.ts` with `/public/brand/logo.svg`. Affects nav, footer, manifest icon, OG.
- [ ] **[user]** Rewrite manifesto principles in `content/manifesto/principles.ts` to your voice. Five-card grid; ≤ 2 short sentences per principle.
- [ ] **[user]** Rewrite the hero headline block in `data/brand.ts` (`brand.headline.eyebrow / title / titleAccent / sub`) if the current copy doesn't ring true.
- [ ] **[user]** Workflow **artifact** copy — voice/tone polish. The narrative transcripts in `content/workflow/stages.ts` were revoiced to the founder register in K-3 (see Resolved); the 12 MDX artifacts under `content/workflow/artifacts/<product>/<type>.mdx` are still in their first-draft voice. Read them through and tune to your personal voice before launch (the structure + depth are done).
- [ ] **[user]** Decide on a real Cal.com (or alternative) scheduling URL and set the `SCHEDULE_URL` constant in `components/contact/contact-success.tsx` to render the "Book a call" button on form-success.
- [ ] **[future]** _(Portfolio dormant — these three are deferred while the blockchain heritage is unpublished; they only matter if/when the portfolio is revived.)_ Replace the blanket Play-Store developer-page URL in `data/projects.ts` with per-app deep links (`details?id=<packageId>`). Only `blockscan` carries a verified package id (`com.bdc.blockscan.app`).
- [ ] **[future]** Provide per-app download / review counts beyond Blockchair's confirmed 10K+ (portfolio-dormant).
- [ ] **[future]** Drop real 512×512 app icons under `public/projects/<slug>/icon.png` (portfolio-dormant). Also: confirm **WebSight**'s tagline/description + add real stars/forks stats in `data/projects.ts` before reviving the portfolio.
- [ ] **[polish]** Load Geist Sans into the OG image template so the social-share cards match the live site's display type. `lib/og-image.tsx` currently uses Satori's default system sans (clean but not on-brand).

## Post-launch enhancements

Anything in this section is explicitly safe to defer to after v2 goes live.

### PWA

> The PWA ships with a hand-rolled service worker (`public/sw.js`), a custom bottom install
> prompt (`components/pwa/*`, `hooks/use-install-prompt.ts`), manifest shortcuts/screenshots,
> and an `/offline` fallback. These extend it further.

- [ ] **[future]** Revisit **Serwist / Workbox** (`@serwist/next`) if caching needs outgrow the hand-rolled shell SW (precise revisioning, richer runtime strategies, background sync). Gated by CLAUDE.md §11 — requires a new dependency **and** a `next.config.ts` change, so it needs explicit sign-off.
- [ ] **[future]** Aggressive offline — runtime-cache visited `/apps/<slug>` pages + the slim directory search JSON (`@/.velite` `apps-search.json`) so installed users can browse listings offline. More cache-invalidation surface; pair with a SW version bump strategy.
- [ ] **[debt]** The Sonner `<Toaster>` (`components/ui/toaster.tsx`) is **never mounted** in the tree, so `toast()` calls (e.g. in `components/tools/tools-browser.tsx`) are currently no-ops. Either mount `<Toaster/>` in `app/layout.tsx` or remove the dead toast calls. (Out of scope for the PWA work, which uses a bespoke banner — recorded here so it isn't lost.)

### Workflow

> **Status: `/workflow` is DORMANT (unpublished).** Iteration 5, out-of-sequence product-direction
> change: the section was taken off the live site to keep the homepage directory-focused and the
> detailed agentic-engineering process semi-proprietary. **Nothing was deleted** — the route was
> moved into the Next private folder `app/(marketing)/_workflow/` (underscore = excluded from
> routing), and `components/workflow/*`, `components/claude-chat/*`, `content/workflow/*` (stages +
> 12 artifacts), `hooks/use-workflow-*`, and `types/workflow.ts` all remain in the tree (unreferenced
> by any live route, so excluded from every shipped bundle). The polish items below only matter if/when
> it's republished.
>
> **To republish `/workflow`:**
>
> 1. `git mv "app/(marketing)/_workflow" "app/(marketing)/workflow"`.
> 2. `data/brand.ts` → re-add `{ href: "/workflow", label: "Workflow" }` to `nav` (this restores it in
>    site-nav, the mobile sheet, and the footer Sitemap list).
> 3. `components/command/command-palette-body.tsx` → re-add the `{ label: "Workflow", href: "/workflow" }`
>    entry to `PAGES`.
> 4. `app/sitemap.ts` → re-add the `/workflow` static route entry.
> 5. `components/effects/lenis-provider.tsx` → add `"/workflow"` back to `SMOOTH_ROUTES`.
> 6. Repoint the CTAs if desired: hero (`components/hero/hero-copy.tsx`) and Now/Next
>    (`components/home/now-next-band.tsx`) currently link to `#how-we-work` on `/about`; the footer
>    badge (`components/footer/site-footer.tsx`) links to `/about#how-we-work`. Consider whether the
>    new `components/home/how-we-work.tsx` `/about` band should stay alongside a republished `/workflow`.
>
> - [ ] **[future]** Build one or more of the three sample products for real — **Blokz Brief** (arxiv →
>       paper digest), **Eval Forge** (spec → eval suite), **Edge Memo** (on-device meeting capture) — as
>       actual shipped apps and/or directory entries, rather than illustrative-only workflow narratives.
> - [ ] **[future]** **Remove the dormant `_workflow` tree entirely** (the end-state, _not_ a Velite
>       migration — keep it for reference only, then delete once we've extracted what we need from the
>       artifacts/transcripts). When pulled, delete `app/(marketing)/_workflow/`, `components/workflow/*`,
>       `components/claude-chat/*`, `content/workflow/*`, `hooks/use-workflow-{product,platform}.ts`, and
>       `types/workflow.ts`; drop the now-dead bits (`lenis` is already route-gated off `/workflow`, the
>       `nav`/`PAGES`/`sitemap`/`SMOOTH_ROUTES` entries are already removed — see the republish list above,
>       which becomes the deletion checklist in reverse). **First** grep that nothing live still imports
>       from those paths (the tree is currently unreferenced by any routed page, so this should be clean),
>       and decide whether the `/about` `how-we-work.tsx` band fully supersedes it. Supersedes the
>       republish path above — pick one.

- [ ] **[polish]** Code-reveal Shiki typing animation for inline beat content (the MDX artifact pages already syntax-highlight via `rehype-pretty-code`; this extends it to typing-animation reveals on scroll inside chapter beats).
- [ ] **[polish]** Keyboard navigation between beats + `?` shortcut help dialog.
- [ ] **[polish]** Evaluate GSAP-pinned scrolly chapters. The current sticky-column layout reads well; revisit if the cinematic pinning genuinely adds something.
- [ ] **[polish]** Chapter-1 chat-window streaming animation (currently the 6 messages reveal-via-stagger, not character-by-character).
- [ ] **[polish]** Chapter-2 document-stack hover Flip expansion (currently a simple grid of linked tiles).

### Hero

- [ ] **[polish]** Add ~200 instanced "packet" particles drifting along the flow-field gradient. Plan called for this; deferred so chunk 1 shipped clean.
- [x] **[polish]** Add a faint procedural dot-grid overlay to the hero shader to evoke block structure — landed in Iteration 2 as a 60-cell mask in `components/hero/shaders.ts` (Iteration 2, see Resolved).
- [ ] **[debt]** Migrate hero shaders from inline template literals in `components/hero/shaders.ts` to `shaders/*.glsl` files imported as raw strings (verify Turbopack's `?raw` path or add a loader). Marker: `TODO(debt)` in the file.

### Performance + ops

- [ ] **[polish]** Residual bundle gap after the chunk-2 trim sprint. `/apps` 146 KB, `/apps/[slug]` 134 KB, `/workflow/artifacts/[slug]` 134 KB, `/_not-found` 118 KB. The remaining mass is React 19 + Next 15 runtime + motion library — roughly the modern-Next floor. Further wins would require lazy-loading `motion/react` per feature (large refactor). CLAUDE.md §10 ceilings already updated to reflect realistic targets.
- [ ] **[polish]** Swap the in-memory IP rate limiter (`lib/rate-limit.ts`) for `@upstash/ratelimit` once we want hardened protection against sustained abuse. Today it resets on cold start and doesn't share state across regions — fine for expected volume.
- [ ] **[polish]** Full PWA installability — add a service worker if mobile install rate becomes a stated goal. `app/manifest.ts` already advertises the icons.
- [ ] **[polish]** Playwright smoke suite for the hero, apps directory filter, workflow, and contact-form happy path. The CI workflow (`.github/workflows/ci.yml`) is ready to host a `test` job once the suite + `@playwright/test` land.
- [ ] **[verify]** Lighthouse-CI **Best-Practices** reads ~0.96 in CI because `@vercel/analytics` + `@vercel/speed-insights` request `/_vercel/insights/*`, which 404s anywhere that isn't Vercel (console errors), plus Lighthouse's advisory CSP/COOP audits. It's a CI-environment artifact — prod (on Vercel) is ~100 — so the assertion is `warn`, not `error`. Optionally add a CSP/COOP header pass later to reach a real 100.

### Tooling

- [ ] **[polish]** ESLint flat config doesn't yet enforce import order. Add `eslint-plugin-import` with `import/order` if import churn becomes painful in PR reviews.
- [ ] **[debt]** `lucide-react@1.x` dropped branded icons (Github, Discord, etc.) for trademark reasons — we ship custom inline SVG glyphs in `components/apps/card-bits.tsx`; Discord and Telegram fall back to generic icons. Acceptable; could swap to dedicated brand-icon SVGs later if precision matters.
- [ ] **[future]** JSON Schema for editor autocomplete on `data/apps/*.json`. Generate `data/apps/schema.json` from the zod `appSchema` (`lib/apps-schema.ts`) via `zod-to-json-schema` and add a `"$schema"` key per listing so VS Code offers field/enum completion + inline validation while a routine authors an entry. Needs a new dev dep → its own small PR.
- [ ] **[future]** Migrate `data/projects.ts` → per-file `data/projects/<slug>.json` + a zod `projectSchema` under Velite, mirroring the apps + sponsored data layers (`lib/apps-schema.ts`, `lib/sponsored-schema.ts`). **Trigger: when `/portfolio` revives** — the portfolio is deliberately kept (not deleted) for showcasing **WebSight** + future shipped Blokz products, so this earns its keep then. Same payoff as apps: schema-validated per-file entries, no merge-conflict monolith, no hand-maintained interface drift. Lower priority than apps/sponsored because the portfolio is currently dormant and edited rarely.
- [ ] **[polish]** Optional `slug === filename` guard in the Velite `complete()` hook (`velite.config.ts`) — catch a listing whose `slug` drifts from its `data/apps/<slug>.json` filename. The hook already throws on **duplicate** slugs/ids (see Resolved); this is the remaining **drift** case. Marginal: the kebab-case slug regex + unique filenames already prevent most drift, and a mismatch is harmless (Velite reads `slug` from content), just confusing. (Velite's `complete` records don't carry the source filename, so this needs a small custom loader or a glob read.)
- [ ] **[future]** **Auto-merge for routine PRs (`/discover-apps` + `/audit-directory`) once CI is green — deferred; revisit after watching a few weeks of routine runs.** Today both routines open a PR and **stop** for human review. Tempting to auto-merge so new listings / audit refreshes go live without manual merge, **but** the strict CI gate validates _form, not truth_: schema/typecheck/lint/build/Lighthouse all pass green on a **fabricated** pricing tier, a hallucinated `insight`, a mischaracterized or scammy app, or a 200-but-wrong link. Auto-merge to `main` = auto-deploy to prod with no human eyes, which also cuts against the site's own model (vibecoding = "human as **architect/reviewer**"). Three options on the table when we revisit:
  1. **Tiered (recommended):** auto-merge **only freshness-only `audit-directory` PRs** (just `lastVerifiedAt` bumps, CI green, no "needs human" flags) — the frequent, tedious, genuinely-safe case; keep `discover-apps` + any audit PR that changes a real field (pricing/archive/links) manual. Highest convenience-to-risk ratio.
  2. **Full auto-merge both** on green — max autonomy, but unreviewed net-new AI content (highest fabrication risk) ships to prod; relies on easy revert + periodic spot-checks.
  3. **Keep review, cut the friction** — no content auto-merge; just enable GitHub one-click auto-merge + repo "auto-delete head branches" so approval is one click and branches self-clean.
     **Mechanism** (whichever we pick): prefer GitHub-native auto-merge (`enable_pr_auto_merge`, squash) so the routine enables-and-exits rather than babysitting CI; require the CI checks via branch protection; enable auto-delete-branch-on-merge. Hard guardrail: never auto-merge a PR carrying a "needs human re-verify / needs human decision" flag. Optional stronger gate: an independent AI fact-check pass as a required check before auto-merge (caveat: AI-checking-AI → correlated blind spots, don't rely on it alone for `discover`).

### Future scope (post-v2)

- [ ] **[future]** Seed one real `oss-repo` entry in `data/projects.ts` once the first Blokz OSS repo is published. The OSS card variant already ships exercised via the "coming-soon" placeholder.
- [ ] **[future]** Add the first iOS title to `data/projects.ts` once it ships. The workflow page currently surfaces iOS as an aspirational platform tab.
- [ ] **[future]** Per-page OG image generators on `/apps/[slug]` and `/workflow/artifacts/[slug]` (right now they inherit the parent route's OG).
- [ ] **[future]** Public "build log" page that timestamps each commit to the revamp with a short rationale — meta proof of the vibecoding workflow.
- [ ] **[future]** Category quick-jump chip rail above the featured carousel (deep-links the directory filter). Considered during Chunk I and deferred: three category-jump surfaces already sit near the top (filter-bar category row, empty-state recovery chips, ⌘K Categories group), so a fourth risked clutter. Revisit if discovery analytics show users aren't finding the category filter.
- [ ] **[future]** **Google AdSense / programmatic ads — evaluated and deferred (not recommended now).** The sponsored slots are intentionally **curated direct-sold / affiliate** placements (`data/sponsored/*.json` + `SponsoredCard`), which is on-brand for an AI-managed, neutral directory and keeps the privacy-friendly, fast stack intact. AdSense was considered and rejected for v2 because it conflicts with the core constraints: (a) **perf budget** — `adsbygoogle.js` is a heavy third-party script with layout shift, against CLAUDE.md §10 (LCP <2.5s, CLS <0.05, Lighthouse ≥90 / Best-Practices 100); (b) **brand** — programmatic "around the web" units undercut the curated/editorial positioning; (c) **compliance** — personalized ads need a GDPR/ePrivacy **consent banner + CMP** (IAB TCF) and a **privacy-policy page**, none of which exist today; (d) **overhead** — AdSense account + site approval + a root **`ads.txt`** (note: the existing `public/app-ads.txt` is the unrelated Play Store/AdMob file). **If ever revisited:** add it behind an env-gated, lazy-loaded, consent-gated boundary with reserved ad-slot space (protect CLS); config would live in env vars (`NEXT_PUBLIC_ADSENSE_CLIENT` + per-slot ids) + `ads.txt`; the `SponsoredSlot.tracking` `{ impressionPixel, clickPixel }` fields already cover direct-sold measurement without any network.
- [ ] **[future]** Long-form app pages are a wired-but-unused skeleton: the schema declares `hasLongForm` + `longDescription` (`lib/apps-schema.ts`) and `app-detail.tsx` already renders `longDescription` if present, but 0/125 listings set either, there's no `content/apps/` directory, and no `/apps/[slug]` long-form route. Either build it out (author `content/apps/<slug>.mdx` for a few flagship apps + an MDX viewer) or drop the two fields. No-op as-is; decide when the first app warrants a deep dive.

---

## Resolved (rolling archive)

Iteration 5 Chunk F — Directory data layer + signals/positioning refresh

- [x] **[debt]** Directory data split from the monolithic `data/apps.ts` array (125 entries — a merge-conflict bottleneck for the weekly `/discover-apps` + `/audit-directory` routines, with no semantic validation) into **one JSON file per listing** at `data/apps/<slug>.json`, validated by a zod schema that is now the single source of truth (`lib/apps-schema.ts`; `App = z.infer<…>`, no hand-maintained interface) and aggregated by **Velite** (`velite.config.ts` → gitignored `.velite/`). The schema enforces what `tsc` can't (kebab slug, tagline ≤100, insight ≤140, ≥1 platform, exactly one primary link, hex colour, ISO dates, and **featured ⇒ accentColor**). A Velite `complete` hook emits a slim `apps-search.json` so the command palette (on every page) ships ~5 fields × 125 instead of full records — verified no full data / zod / velite in any client chunk. `velite build` is prepended to dev/build/typecheck/lint; routines + CLAUDE.md + README updated to author/validate per-file JSON.
- [x] **[polish]** Retired the studio-centric `blokzMark` editorial badge in favour of a **derived license signal** (`lib/tools/license.ts`: open-source / open-core / proprietary from `openSource` + `pricing`) on the card, detail, and Source filter. Proprietary is the intentional unbadged default (see comment in `tool-card.tsx`).
- [x] **[polish]** Authored a per-listing `insight` (the directory's signature signal — ≤140-char, non-obvious, verifiable editorial one-liner) across all 125 listings; rendered on card + detail.
- [x] **[debt]** Brought the **sponsored slots** under the same per-file-JSON + zod + Velite pattern as apps: `data/sponsored.ts` → `data/sponsored/<id>.json` validated by `sponsoredSchema` (`lib/sponsored-schema.ts`, now the source of truth; `Sponsored = z.infer<…>`, `types/sponsored.ts` re-exports it type-only as `SponsoredSlot`). Added a second Velite collection (`velite.config.ts`); the client browser imports the generated array from `@/.velite` (no zod/velite in the client chunk). The schema allows the slot link to be a root-relative path (the `/contact?subject=…` self-promo) as well as absolute http(s). Also **jittered the interleave cadence** from a rigid every-12 to a seeded, deterministic 10–15 gap (`lib/interleave.ts` now takes `number | { min, max, seed }`) — varied spacing that still agrees SSR↔client and stays append-stable across infinite-scroll batches.
- [x] **[verify]** Made the Velite data gate **hard** so bad data from the weekly `/discover-apps` + `/audit-directory` routines fails CI instead of silently vanishing. Previously a schema-invalid `data/apps/*.json` / `data/sponsored/*.json` was dropped from output with the build still **green** (exit 0). **Key finding:** the config-level `strict: true` is a **no-op in Velite 0.3.1** — only the **`--strict` CLI flag** sets a non-zero exit. So `--strict` is now appended to the `velite build` invocations on the CI + pre-push paths in `package.json` (`velite`, `build`, `lint`, `typecheck`, `analyze`); `dev` is left lenient so a half-written file mid-edit doesn't kill the dev server (errors still print). Per-file schema validation can't see cross-file collisions, so the Velite `complete()` hook also **throws on duplicate app slugs / sponsored ids** (a thrown error there exits non-zero too — verified). All 125 apps + the sponsored slot re-validated clean against the stricter gate; tested that a malformed entry and a duplicate slug each exit 1.
- [x] **[polish]** Repositioned the site from "vibecoding studio / AI app studio" to an **AI-managed directory** (`data/brand.ts` hub → hero, SEO, OG, footer colophon "Built & operated by Blokz Development Co.", Organization JSON-LD). Stale `~70`/`Blokz-mark` README copy corrected to `~125`/`license`.

Iteration 5 Chunks L–M — About/Portfolio revamp + global chrome + a11y gate

- [x] **[a11y]** Raised the Lighthouse-CI accessibility gate back to **0.98** (`lighthouserc.json`). Contrast offenders fixed across Chunks L + M: introduced `--color-ink-soft`; removed the sub-AA `text-ink-dim/70` labels in `card-bits` `StatLine`, `scroll-cue`, `project-filter-bar` (L), and the `/contact` placeholder + char-count hint `…ink-dim/60` (M-2). All five audited routes now clear AA on the static audit.
- [x] **[polish]** (M-1) Auto-hiding sticky nav + directory filter-bar pin via a shared `--nav-h`; ⌘K palette trigger (desktop pill + mobile sheet item); active-route highlight (`lib/nav.ts`). (M-2) `100dvh` body + `min-h-dvh` hero + global `scroll-padding-top: var(--nav-h)` (replaced per-section `scroll-mt-24`).

Iteration 5 Chunk K — /workflow redesign (chat-transcript narrative)

- [x] **K-1/K-2** `/workflow` rebuilt from the 5-phase R3F/scrolly narrative into a 4-stage Claude Code **session** (`conceptualize → specify → build → ship`), each rendered as a chat transcript via the reusable `components/claude-chat/*` family (`claude-chat` window, `chat-message`, `tool-block`, `harness-bits` DocGraph/PlanChecklist). Data model moved from `content/workflow/phases.ts` (`Phase`) to `content/workflow/stages.ts` (`Stage` + `ChatMessage[]` transcripts). New `workflow-intro.tsx` (agentic-engineering framing + one-time setup + DocGraph) and `stage-segment.tsx` shell. Deleted: `phase-chapter.tsx`, `chapter-{conceptualize,spec,environment,develop,ship}.tsx`, `build-tunnel.tsx` + fallback. **`/workflow` no longer loads `three`/R3F** — R3F is now hero-only. The 12 MDX artifacts are unchanged and still SSG.
- [x] **K-3** Transcripts revoiced to the founder register ("Natural & direct" — the `you` lines read like a real builder talking to their agent), Specify→Build handoff smoothed. **Platform correctness fixed**: `ChatToolBlock` `run` blocks now accept `cmd: string | Record<WorkflowPlatform, string>`, so the Build verify (`pnpm test` / `gradle test` / `cargo test` / `xcodebuild test`) and Ship deploy (Vercel / fastlane / winget / TestFlight) commands flip with the platform tab — not just the `note` lines.
- [x] **K-3** Dropped the unused `canvas-confetti` + `@types/canvas-confetti` deps (the chapter-5 ship-beat confetti was deleted with the redesign; grep-confirmed no source refs). `-1` runtime dep, `-1` dev dep.
- [x] **K-3** Reconciled `CLAUDE.md` to the redesign — folder map, §2 stack note (R3F hero-only), §5/§12 "add a workflow stage" recipes, §8 motion/3D rules (no R3F or confetti on `/workflow`).

CI — continuous integration gate

- [x] Core CI workflow `.github/workflows/ci.yml` — on every PR + push to `main`: `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `build` (Node from `.nvmrc`, pnpm from `packageManager`, store cached). Gives the "CI green" gate the merge workflow depends on.
- [x] **[polish]** Lighthouse-CI job in the same workflow (`lighthouserc.json`) — audits `/`, `/about`, `/workflow`, `/contact`, and a sample `/apps/<slug>` against the production build. Hard gates: accessibility ≥ 0.98, best-practices = 1.0, SEO = 1.0; performance is a warning (CI runners are too noisy to block on). Reports upload to temporary public storage.

Sub-plan B-2 / B-3 — Workflow artifact fill-in

- [x] **B-2** Eval Forge artifacts fleshed out to Blokz Brief depth — `content/workflow/artifacts/forge/{claude-md,prd,spec,prompt-library}.mdx`. Concept banners, `(sketch)` labels, and "lands with Sub-plan" footers removed; full section sets, tables, and code blocks added (web dashboard + Rust `clap` CLI + emitted Vitest harness + GitHub Action gate; `EvalKind` / `GoldCase` / `RunResult` shapes; meta-eval scorer).
- [x] **B-3** Edge Memo artifacts fleshed out to Blokz Brief depth — `content/workflow/artifacts/memo/{claude-md,prd,spec,prompt-library}.mdx`. Same scaffolding removed; on-device iOS-first pipeline (three quantized Core ML models — transcribe / summarise / extract), privacy-first guardrails (offline by construction, opt-in self-hosted E2EE sync), goldset scored on WER + action-item recall.
- [x] `content/workflow/phases.ts` header comment updated — all three products now carry full beats + artifacts; only voice/tone polish remains (now an active **Pre-launch polish** item).

Iteration 2 — Home page refinement + apps lifecycle (this branch)

- [x] Hero copy refreshed in `data/brand.ts` — title `"AI apps."` / titleAccent `"Built by AI."` / sub leads with research areas (multi-agent, edge inference, memory) and closes on Claude Code. Owns the meta-loop framing (AI building AI) as the brand's distinctive claim; replaces the four-fragment buzzword stack and does not lean on the legacy Android portfolio as identity.
- [x] Hero typography rebalanced in `components/hero/hero-copy.tsx` — title line now Geist Sans medium with tight tracking; accent line keeps Instrument Serif italic. Honors CLAUDE.md §10 "serif for display accents."
- [x] Hero capability strip added — mono `MULTI-AGENT · EDGE INFERENCE · MEMORY ARCHITECTURES · BUILT WITH CLAUDE CODE` between sub and CTAs.
- [x] Hero shader refined in `components/hero/shaders.ts` — saturation knocked down (accent mix `0.85→0.55`, hot `0.55→0.30`, glow `0.12→0.08`) and a 60-cell procedural dot-grid added to evoke block structure. Closes the long-standing BACKLOG hex-lattice item.
- [x] New `components/home/now-next-band.tsx` — a two-column glass band between hero and manifesto framing the studio's pivot: NOW (production Android apps, runway) / NEXT (AI for B2B + B2C, agentic engineering, link to `/workflow`).
- [x] Scroll cue redesigned in `components/hero/scroll-cue.tsx` — replaced the rotated "SCROLL" + vertical line with a "Now · Next" preview label and a small bobbing chevron-down.
- [x] Manifesto header tightened in `components/manifesto/manifesto.tsx` — "Five things we believe." → "What we believe."
- [x] `types/project.ts` `ProjectStatus` union extended with `"deprecated"` (between `coming-soon` and `archived`).
- [x] `components/apps/card-bits.tsx` `STATUS_MAP` extended with a `DEPRECATED` pill (neutral grey variant, dot at 0.7 opacity — same treatment as archived).
- [x] `lib/projects.ts` `statusOrder` extended so deprecated sorts after coming-soon, before archived.
- [x] `data/projects.ts` — **Blockscan** and **SlyFox** marked `status: "deprecated"` and dropped from `featured`. **Etherscan** and **TRON Explorer** flagged `featured: true` so the home-page apps preview keeps three live cards covering distinct chains (Blockchair / Etherscan / TRON Explorer).

Iteration 1 — Brand pivot to the AI frontier (Sub-plan A)

- [x] **[user]** LinkedIn URL fixed — `data/brand.ts` now `linkedin.com/company/blokzdev/`.
- [x] Brand positioning sweep — `data/brand.ts` tagline + positioning + headline (eyebrow + titleAccent + sub) refreshed to lead with AI as the frontier, anchored on shipped work, gesturing at web3/edge/multi-agent as stacks chosen by user pain.
- [x] Manifesto principle 02 — replaced "Decentralization is a UX problem" with "Research-rooted. User-driven." Principle 05 body tweaked to acknowledge AI assistants alongside chain explorers.
- [x] `/apps`, `/contact` page sub-copy refreshed to match new positioning.
- [x] Root OG image — eyebrow `// AI APP STUDIO`, titleB `AI at the frontier.`
- [x] `lib/seo.ts` keywords — dropped web3 emphasis, added AI app studio / applied AI / edge AI / multi-agent systems / memory architectures / B2B AI / B2C AI; kept blockchain + block explorer (real shipped products).
- [x] `data/projects.ts` — seeded an additional `type: "web-app"` `coming-soon` placeholder ("AI app in motion") so the Web card variant also ships exercised.

Sub-plan B (workflow narrative migration) is now an active **Pre-launch polish** item — see below.

Phase 5 chunk 3 (commit `d15a086`)

- [x] **[polish]** `app/icon.tsx` and `app/apple-icon.tsx` — dynamic favicons via `next/og` `ImageResponse`.
- [x] **[future]** Per-page OG image generators on `/`, `/apps`, `/workflow`, `/contact` via the shared `lib/og-image.tsx` template.
- [x] Site-wide `Organization` JSON-LD in `app/layout.tsx`.
- [x] A11y — `aria-hidden` on decorative R3F canvases (hero + build-tunnel).

Phase 5 chunk 2 (commit `4b3134f`)

- [x] **[polish]** Bundle trim — lazy `MobileSheet` (Radix Dialog deferred), scoped `NuqsAdapter` to `/apps`, gated `LenisProvider` to `/` + `/workflow`. ~20 KB off every route's First Load JS; ~10 KB off shared chunks.

Phase 4

- [x] **[polish]** Chapter 1 visual treatment — Mac-style chat window with 6 staggered messages.
- [x] **[polish]** Chapter 2 visual treatment — 3 doc tiles linking to live artifact pages.
- [x] **[polish]** Chapter 3 visual treatment — faux zsh terminal, AnimatePresence-keyed swap per platform tab.
- [x] **[polish]** Chapter 4 visual treatment — R3F build-pipeline tunnel with scroll-driven camera dolly, ring-glow lerp, and reduced-motion SVG fallback.
- [x] **[polish]** Chapter 5 visual treatment — release-train station strip with canvas-confetti burst on the Shipped station.
- [x] **[polish]** MDX pipeline + `/workflow/artifacts/[slug]` route + 4 sample artifacts.

Phase 5 chunk 4 (this commit)

- [x] **[debt]** `README.md` rewritten — project intro, stack, quick start, common commands, what's in the box, project structure pointer, adding a project recipe, deploy notes, license link.
- [x] **[user]** `.env.example` authored with inline comments for `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
- [x] `CLAUDE.md` §10 perf budget refreshed — ceilings updated to realistic numbers; framework-floor explainer added.

Phase 1–3 (rolling)

- [x] **[debt]** `lucide-react@1.14.0` characterised — confirmed canonical package; brand icons removed by upstream and mitigated with inline GitHub/GitLab SVG.
- [x] **[polish]** Seed an `oss-repo` placeholder card in `data/projects.ts` (status `coming-soon`) so the OSS card variant ships exercised.
