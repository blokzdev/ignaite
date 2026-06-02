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

- [ ] **[user]** Set Vercel env vars (Production + Preview): `RESEND_API_KEY`, `CONTACT_TO_EMAIL=team@blokz.dev`, optional `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL=https://blokz.dev`. Without `RESEND_API_KEY` the contact form returns an "Email is offline" notice instead of submitting.
- [ ] **[user]** Verify the `blokz.dev` domain inside Resend (Settings → Domains) so the contact form can send from `Blokz <hello@blokz.dev>`. Until verified, leave `CONTACT_FROM_EMAIL` unset and the form falls back to `onboarding@resend.dev`.
- [ ] **[user]** Confirm `team@blokz.dev` is actively monitored (the destination for every form submission). Optionally mirror submissions to a Telegram/Discord webhook on submit.
- [ ] **[verify]** Confirm `public/app-ads.txt` is still required by Play Store ad SDKs (preserved verbatim from the legacy site).

## Pre-launch polish (optional, can ship without)

Things that would make the site feel more "us" before the world sees it.

- [ ] **[user]** Provide a vector SVG Blokz logo (wordmark + monogram). Replace the legacy `cdn.glitch.global` PNG referenced in `data/brand.ts` with `/public/brand/logo.svg`. Affects nav, footer, manifest icon, OG.
- [ ] **[user]** Rewrite manifesto principles in `content/manifesto/principles.ts` to your voice. Five-card grid; ≤ 2 short sentences per principle.
- [ ] **[user]** Rewrite the hero headline block in `data/brand.ts` (`brand.headline.eyebrow / title / titleAccent / sub`) if the current copy doesn't ring true.
- [ ] **[user]** Workflow narrative — voice/tone polish. Sub-plan B of the AI-frontier pivot is structurally complete: **B-1** shipped the three-product showcase (Blokz Brief, Eval Forge, Edge Memo) with a product picker, platform tabs, and 12 SSG'd MDX artifacts at `/workflow/artifacts/[product]/[type]`; **B-2** (Eval Forge) and **B-3** (Edge Memo) filled the artifacts out to Blokz Brief depth (see Resolved). All that remains is rewriting the narrative beats in `content/workflow/phases.ts` and the artifact copy to your personal voice before launch.
- [ ] **[user]** Decide on a real Cal.com (or alternative) scheduling URL and set the `SCHEDULE_URL` constant in `components/contact/contact-success.tsx` to render the "Book a call" button on form-success.
- [ ] **[user]** Replace the blanket Play-Store developer-page URL in `data/projects.ts` with per-app deep links (`details?id=<packageId>`). Only `blockscan` carries a verified package id (`com.bdc.blockscan.app`); the other eight rows link to the dev page today.
- [ ] **[user]** Provide per-app download / review counts beyond Blockchair's confirmed 10K+ (currently only rating is shown on the other eight cards).
- [ ] **[polish]** Drop real 512×512 app icons under `public/projects/<slug>/icon.png`. Cards currently render a generated 2-letter monogram tinted by chain accent — works, but real icons read more credibly.
- [ ] **[polish]** Load Geist Sans into the OG image template so the social-share cards match the live site's display type. `lib/og-image.tsx` currently uses Satori's default system sans (clean but not on-brand).

## Post-launch enhancements

Anything in this section is explicitly safe to defer to after v2 goes live.

### Workflow

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
- [ ] **[a11y]** Raise the Lighthouse-CI accessibility gate from the temporary **0.95 floor back to 0.98** (`lighthouserc.json`). `/about` and `/contact` score 0.96 today — almost certainly color-contrast on `--color-ink-dim` / low-opacity mono labels over dark surfaces. Fix during Iteration 5's hardening chunks (G/L), then retighten the gate.
- [ ] **[verify]** Lighthouse-CI **Best-Practices** reads ~0.96 in CI because `@vercel/analytics` + `@vercel/speed-insights` request `/_vercel/insights/*`, which 404s anywhere that isn't Vercel (console errors), plus Lighthouse's advisory CSP/COOP audits. It's a CI-environment artifact — prod (on Vercel) is ~100 — so the assertion is `warn`, not `error`. Optionally add a CSP/COOP header pass later to reach a real 100.

### Tooling

- [ ] **[polish]** ESLint flat config doesn't yet enforce import order. Add `eslint-plugin-import` with `import/order` if import churn becomes painful in PR reviews.
- [ ] **[debt]** `lucide-react@1.x` dropped branded icons (Github, Discord, etc.) for trademark reasons — we ship custom inline SVG glyphs in `components/apps/card-bits.tsx`; Discord and Telegram fall back to generic icons. Acceptable; could swap to dedicated brand-icon SVGs later if precision matters.

### Future scope (post-v2)

- [ ] **[future]** Seed one real `oss-repo` entry in `data/projects.ts` once the first Blokz OSS repo is published. The OSS card variant already ships exercised via the "coming-soon" placeholder.
- [ ] **[future]** Add the first iOS title to `data/projects.ts` once it ships. The workflow page currently surfaces iOS as an aspirational platform tab.
- [ ] **[future]** Per-page OG image generators on `/apps/[slug]` and `/workflow/artifacts/[slug]` (right now they inherit the parent route's OG).
- [ ] **[future]** Public "build log" page that timestamps each commit to the revamp with a short rationale — meta proof of the vibecoding workflow.
- [ ] **[future]** Category quick-jump chip rail above the featured carousel (deep-links the directory filter). Considered during Chunk I and deferred: three category-jump surfaces already sit near the top (filter-bar category row, empty-state recovery chips, ⌘K Categories group), so a fourth risked clutter. Revisit if discovery analytics show users aren't finding the category filter.

---

## Resolved (rolling archive)

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
