# CLAUDE.md

This file is the contract between you (Claude) and this codebase. Read it end-to-end before making non-trivial changes. It documents the v2 architecture, conventions, and agent guardrails for the Blokz.dev landing site. For the forward-looking plan of record (iterations + chunks) see `Roadmap.md`; for tracked-but-deferred items see `BACKLOG.md`. (The original `/root/.claude/plans/*.md` lives only in the ephemeral dev environment and is not the source of truth.)

---

## 1. Overview

**Blokz.dev** is an **AI-managed directory** of AI apps — every listing researched, written, and continuously audited by Claude Code, each carrying a one-line AI insight. It is built and operated by **Blokz Development Company** (the studio, credited in the footer colophon), and is itself a demonstration of agentic engineering. The public surface is the **directory** (`/`), how it's managed (`/about`), and contact (`/contact`).

> **The portfolio is dormant.** The studio's earlier non-AI work (nine Android blockchain explorers) was unpublished to keep the site focused on the AI-frontier vision. `/about` no longer shows a portfolio/stats grid; the `/portfolio/<slug>` route lives under the private folder `app/(marketing)/_portfolio/`, with `data/projects.ts`, `components/apps/*`, and the orphaned `components/home/{apps-preview,stats-strip}.tsx` retained for a future AI-app/web/OSS revival (the real OSS project **WebSight** is already seeded in `data/projects.ts`). To republish: rename `_portfolio` → `portfolio`, re-compose the sections on `/about`, and re-add the sitemap + redirect entries.

> **`/workflow` is dormant.** The 4-stage Claude Code session walkthrough + 12 MDX artifacts were unpublished (Iteration 5, out-of-sequence product-direction change) to keep the homepage directory-focused and the detailed agentic process semi-proprietary. All of it is **retained in the repo** under the Next private folder `app/(marketing)/_workflow/` (underscore = excluded from routing), along with `components/workflow/*`, `components/claude-chat/*`, `content/workflow/*`, `hooks/use-workflow-*`, and `types/workflow.ts`. To republish: rename `_workflow` → `workflow` and re-add the references listed in `BACKLOG.md`. Everywhere below that describes `/workflow` as live should be read through this lens.

Brand line (source of truth: `data/brand.ts`): _An AI-managed directory of AI apps — researched, written, and kept current by Claude Code._

v2 is the live site (this codebase). The legacy v1 Glitch template is preserved only on the `glitch` branch; `main` is v2.

---

## 2. Tech stack (pinned)

| Layer            | Choice                                                  | Why                                                              | Version |
| ---------------- | ------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| Framework        | Next.js (App Router, RSC, Turbopack dev)                | SSG-first, RSC for content, native MDX, Vercel                   | 15.3.x  |
| UI runtime       | React                                                   | RSC + React Compiler (stable in 19)                              | 19.1.x  |
| Language         | TypeScript, `strict: true`                              | Type safety end-to-end                                           | 5.6.x   |
| Styling          | Tailwind CSS v4 (CSS-first `@theme`)                    | No JS config file; tokens in `globals.css`                       | 4.1.x   |
| Component prims  | shadcn/ui (Radix + Tailwind, copied into `ui/`)         | Owned components, no runtime dep                                 | latest  |
| Motion (DOM)     | `motion` (formerly framer-motion)                       | Shared layout, scroll, gestures                                  | 12.x    |
| Motion (scroll)  | `motion` + sticky CSS layout (NOT gsap)                 | The planned GSAP/ScrollTrigger scrolly was dropped; not a dep    | —       |
| Smooth scroll    | `lenis`                                                 | Inertial smooth scroll on `/about` (workflow dormant — see §1)   | 1.3.x   |
| 3D / shaders     | `three` + `@react-three/fiber` + `drei`                 | Hero flow-field only (the dormant `/workflow` had no R3F)        | 0.184.x |
| Content          | `@next/mdx`, `rehype-pretty-code` (Shiki), `remark-gfm` | Manifesto/projects/workflow as MDX                               | latest  |
| Directory data   | `velite` (+ its bundled `zod`)                          | Per-file `data/apps/*.json` validated + aggregated; build-only   | 0.3.x   |
| URL state        | `nuqs`                                                  | `/apps` filter state in URL                                      | latest  |
| Forms            | Native form + server action + `resend`                  | Contact form → `team@blokz.dev`                                  | 4.x     |
| Icons            | `lucide-react` + custom SVGs                            | Tree-shaken icons + custom chain marks                           | latest  |
| Fonts            | `geist` npm pkg + `@fontsource/instrument-serif`        | Self-hosted Geist Sans/Mono via next/font, no Google Fonts fetch | latest  |
| Analytics        | `@vercel/analytics` + `@vercel/speed-insights`          | Zero-config, privacy-friendly                                    | latest  |
| Lint             | ESLint flat (`eslint-config-next`)                      |                                                                  | 9.x     |
| Format           | Prettier + `prettier-plugin-tailwindcss`                |                                                                  | 3.x     |
| Hooks            | `simple-git-hooks` + `lint-staged`                      | Lighter than husky                                               | latest  |
| Package manager  | `pnpm`                                                  | Mandatory (`engine-strict=true`, pinned via `packageManager`)    | 10.x    |
| Runtime          | Node                                                    | LTS                                                              | ≥20.11  |
| Deploy           | Vercel                                                  | SSG + a contact **server action** (`contact/actions.ts`)         | n/a     |
| Tests (optional) | Playwright                                              | Smoke tests on hero/workflow                                     | 1.48+   |

Don't add a dependency without confirming with the user (see §11). Don't change a pinned major version without confirmation.

---

## 3. Commands

```bash
pnpm install         # install deps (pnpm only — npm/yarn rejected by engine-strict)
pnpm dev             # next dev --turbopack
pnpm build           # next build --turbopack (SSG)
pnpm start           # serve production build locally
pnpm lint            # eslint
pnpm lint:fix        # eslint --fix
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
pnpm typecheck       # tsc --noEmit
pnpm analyze         # ANALYZE=true next build (bundle analyzer)
# Note: no `pnpm test` yet — a Playwright smoke suite is a tracked BACKLOG item, not set up.
```

Pre-commit (auto): `lint-staged` → eslint --fix + prettier --write on staged files.
Pre-push (auto): `pnpm typecheck`.

---

## 4. Folder map

```
app/                              # Next App Router
  (marketing)/                    # route group sharing nav + footer
    layout.tsx                    #   sets <SiteNav/> + <SiteFooter/>
    page.tsx                      #   / — AI-apps DIRECTORY (data/apps/*.json via Velite; filter+search+sort, ~125 entries)
    about/
      page.tsx                    #   /about — studio identity (Hero, Now/Next, manifesto, portfolio grid)
      opengraph-image.tsx         #   per-route OG
    apps/
      [slug]/page.tsx             #   /apps/<slug> — directory-app detail (SSG; renders components/tools/app-detail)
      [slug]/opengraph-image.tsx  #   per-app OG
    _portfolio/                   #   DORMANT (private folder, not routed — see §1). Rename to `portfolio` to republish.
      [slug]/page.tsx             #   was /portfolio/<slug> — Blokz shipped-PROJECT detail (data/projects.ts, SSG)
    _workflow/                    #   DORMANT (private folder, not routed — see §1). Rename to `workflow` to republish.
      page.tsx                    #   was /workflow — 4-stage Claude Code session narrative (components/workflow/workflow.tsx)
      artifacts/[product]/[type]/page.tsx
                                  #   was /workflow/artifacts/<product>/<type> — MDX artifact viewer (SSG, 12)
      opengraph-image.tsx
    contact/
      page.tsx                    #   /contact — dedicated contact page
      actions.ts                  #   server action → Resend  (NOT an /api/* route)
      opengraph-image.tsx
  manifest.ts                     # PWA manifest (typed)
  robots.ts                       # robots.txt
  sitemap.ts                      # sitemap.xml (apps + static; portfolio + workflow dropped while dormant)
  opengraph-image.tsx             # root OG image (per-route can override)
  icon.tsx / apple-icon.tsx       # dynamic favicons via next/og
  globals.css                     # Tailwind v4 @theme block + base/utility layers
  layout.tsx                      # root layout: fonts, providers, analytics, Organization JSON-LD

# ── TWO content tracks — keep them straight ──────────────────────────────
#   DIRECTORY = the curated AI-apps list (the / homepage). LIVE.
#               data/apps/<slug>.json (one file per listing) · zod schema =
#               source-of-truth lib/apps-schema.ts · types/app.ts (enums +
#               re-exported derived types) · velite.config.ts → generated
#               .velite/ (full apps.json + slim apps-search.json) · lib/apps.ts ·
#               components/tools/*
#   PORTFOLIO = Blokz's own shipped apps. DORMANT (see §1) — the blockchain
#               heritage was unpublished; /about no longer shows it and the
#               route lives at app/(marketing)/_portfolio/. Retained for a
#               future AI-app/web/OSS revival (WebSight is seeded in the data).
#               data/projects.ts · types/project.ts · lib/projects.ts · components/apps/*
#               + the now-orphaned components/home/{apps-preview,stats-strip}.tsx
# ─────────────────────────────────────────────────────────────────────────

components/
  ui/                             # shadcn primitives present: button, badge, tabs, sheet, dialog, tooltip, separator
  nav/site-nav.tsx                  # desktop nav + mobile trigger that opens the unified console
  command/command-palette-body.tsx  # unified console (also the mobile nav menu): navigate + categories + apps. ⌘K = search-first; mobile Menu trigger = menu-first (no keyboard until you tap search)
  footer/site-footer.tsx
  hero/
    hero.tsx                      # server shell: text-first copy + dynamic R3F canvas
    r3f-hero.tsx                  # client; R3F canvas, dynamic-imported ssr:false
    flow-field-plane.tsx          # the shader mesh
    shaders.ts                    # inline GLSL (vert/frag) — there is NO top-level shaders/ dir
    hero-copy.tsx                 # headline overlay (eyebrow, title, CTAs)
    hero-fallback.tsx             # reduced-motion / no-WebGL fallback
    scroll-cue.tsx
  home/{now-next-band, how-we-work}.tsx   # /about bands: Now/Next + "How we work" (#how-we-work anchor)
  manifesto/{manifesto, principle-card}.tsx
  tools/                          # ── DIRECTORY (App) ──
    tools-browser.tsx             #   client orchestrator: filter state, infinite scroll, sponsored interleave
    tool-filter-bar.tsx           #   sticky filter + search + sort bar (nuqs URL state)
    tool-grid.tsx / tool-card.tsx #   responsive grid + the App card
    featured-carousel.tsx         #   featured rail (scroll-snap)
    sponsored-card.tsx            #   sponsored slot card
    app-detail.tsx                #   /apps/[slug] body
  apps/                           # ── PORTFOLIO (Project) ──
    apps-browser.tsx / apps-preview.tsx
    project-grid.tsx              #   bento grid container
    project-card{,-android,-oss,-web}.tsx   # dispatcher + variants
    project-filter-bar.tsx
    project-detail.tsx            #   /portfolio/[slug] body
    card-bits.tsx                 #   shared chips / monogram / status glyphs
  workflow/                       # ── DORMANT (consumed only by app/(marketing)/_workflow; not in any shipped bundle) ──
    workflow.tsx                  # client orchestrator: product + platform tabs, renders stage segments
    workflow-intro.tsx            # hero: agentic-engineering framing, one-time setup, DocGraph
    stage-segment.tsx             # one stage: sticky header (number/title/summary/beats) + ClaudeChat
    product-tabs.tsx / platform-tabs.tsx   # segmented controls
    artifact-frame.tsx            # styled MDX viewer with "open full" CTA
  claude-chat/                    # reusable Claude Code chat-transcript UI (DORMANT — only the dormant _workflow uses it)
    claude-chat.tsx               #   the chat window (messages → bubbles, motion stagger)
    chat-message.tsx              #   you=right / claude=left bubble + tool-block column
    tool-block.tsx                #   renders run/write/plan/pr/note tool-use blocks
    harness-bits.tsx              #   PlanChecklist + DocGraph (the doc architecture table)
  contact/{contact-form, contact-success}.tsx
  effects/{lenis-provider, reduced-motion-provider, noise-overlay, glow-orb, magnetic-button}.tsx
  seo/json-ld.tsx                 # JSON-LD blob renderer

content/                          # typed content + MDX
  manifesto/principles.ts         # typed array — no MDX
  workflow/                       # ── DORMANT content (retained; only the dormant _workflow route reads it) ──
    stages.ts                     # per-product stage metadata + chat transcripts (brief / forge / memo)
    products.ts                   # the 3 sample products
    artifacts/
      index.ts                    # artifact registry + dynamic loaders + per-type SEO metadata
      {brief,forge,memo}/{claude-md,prd,spec,prompt-library}.mdx   # 12 artifacts

data/                             # source-of-truth, typed
  apps/<slug>.json                # DIRECTORY: one JSON file per listing (~125), validated by Velite
  projects.ts                     # PORTFOLIO: Blokz's shipped projects (Project[])
  sponsored.ts                    # sponsored directory slots
  brand.ts                        # logo, social handles, contact, hero copy
  chains.ts                       # chain metadata (icon, color, label)

velite.config.ts                  # Velite: validates data/apps/*.json + data/sponsored/*.json against
                                  #   lib/{apps,sponsored}-schema.ts, generates .velite/ (full apps.json +
                                  #   slim apps-search.json). Runs via `velite build --strict` prepended to
                                  #   build/lint/typecheck (NOT dev) — invalid data fails CI/pre-push (the
                                  #   config-level `strict` flag is a no-op in 0.3.1; only the CLI flag exits
                                  #   non-zero). The `complete()` hook also throws on duplicate slugs/ids.
.velite/                          # GENERATED + gitignored — never edit/commit; import via @/.velite

lib/
  apps-schema.ts                  # DIRECTORY source-of-truth: zod schema; App = z.infer<…> (build-only)
  utils.ts                        # cn() + small formatters
  apps.ts                         # directory query helpers (listApps, getApp, relatedApps, …)
  projects.ts                     # portfolio query helpers (listProjects, getProject, …)
  interleave.ts                   # deterministic sponsored-slot interleave
  rate-limit.ts                   # contact rate-limit (in-memory; upgrade path: Upstash)
  og-image.tsx                    # shared OG image template (Satori)
  seo.ts                          # buildMetadata() + siteUrl

hooks/
  use-reduced-motion.ts  use-mouse.ts  use-scroll-progress.ts  use-media-query.ts
  use-workflow-product.ts  use-workflow-platform.ts

types/
  app.ts                          # DIRECTORY: App, AppCategory, AppPricing, AppPlatform, AppLinkKind, ModelSupport, …
  project.ts                      # PORTFOLIO: Project, ProjectType, ProjectStatus, Chain, Platform, LinkKind, …
  sponsored.ts                    # Sponsored slot
  workflow.ts                     # WorkflowProduct, ArtifactType, Stage, ChatMessage, ChatToolBlock, …

public/
  brand/                          # rehosted Blokz logo + favicons
  projects/<slug>/                # portfolio icons / screenshots
  app-ads.txt                     # ported from v1 (Play Store ad SDK requirement)

CLAUDE.md  README.md  Roadmap.md  BACKLOG.md  LICENSE
.nvmrc  .npmrc  next.config.ts  tsconfig.json  eslint.config.mjs  prettier.config.mjs
package.json  pnpm-lock.yaml
```

---

## 5. Content authoring

> Two tracks, two recipes — see the "TWO content tracks" callout in §4. The `/` homepage
> directory is the **App** track; `/about` + `/portfolio` is the **Project** track.

### Add a directory app (the `/` directory — App track)

1. Create `data/apps/<slug>.json` — one JSON object, validated by the zod schema in `lib/apps-schema.ts` (the source of truth; types re-exported from `types/app.ts`). Required: `slug`, `name`, `tagline`, `description`, `category`, `pricing`, `platforms`, `links` (≥1, **exactly one** `primary: true`). Optional: `insight` (the directory's signature signal — a single ≤140-char, non-obvious, **verifiable** editorial sentence per listing; never fabricated, omit if nothing sharp), `vendor`, `openSource` (license signal — **decoupled from `pricing`**, which is cost-only: `free`/`freemium`/`paid`/`byo-key`, no `open-source`; the card/detail derive an open-source / **open-core** / proprietary chip from `openSource` + `pricing`), `deployment` (`cloud`/`self-host`/`local`/`hybrid`, set where hosting is a real axis — unset for libraries/SDKs), `status`, `tags`, `modelSupport`, `addedAt`, `lastVerifiedAt`, `featured`, `accentColor`, `changelog` (the visible audit trail — an append-only array of `{ date, kind, summary, asOf?, source? }` entries that `/audit-directory` records on a substantive change; **not** authored for new entries, the detail page derives the "Listed · addedAt" origin node). (Model-serving/inference/gateways → the `inference` category.) Run `pnpm velite` (runs `velite build --strict`) — it schema-validates the file and **exits non-zero** with a precise per-file error if anything is off (duplicate slugs fail too), so a bad entry fails CI rather than silently dropping.
2. One card renders all apps — `components/tools/tool-card.tsx` (no per-type dispatch); the detail body is `components/tools/app-detail.tsx`.
3. Set `featured: true` to surface it in the featured carousel (use sparingly).
4. Run `pnpm dev` and verify it appears on `/`, that the category/pricing/status filter chips include it, and that `/apps/<slug>` renders. (One file per listing → concurrent `/add-app` & `/discover-apps` runs never conflict.)

### Add a portfolio project (the Project track — DORMANT)

> **Dormant feature (see §1).** The portfolio is unpublished: `/about` shows no portfolio grid and the route lives under `app/(marketing)/_portfolio/`. A new `Project` won't appear on the live site until you republish (rename `_portfolio` → `portfolio`, re-compose `/about`, re-add sitemap + redirect). The recipe below still applies for editing the retained data / a future revival.

1. Append a `Project` entry to `data/projects.ts` (schema in `types/project.ts`). Required: `slug`, `name`, `tagline`, `description`, `type`, `status`, `platforms`, `chains`, `media.icon`, `stats`, `links` (≥1 `primary: true`).
2. Drop assets in `public/projects/<slug>/`: `icon.png` (512×512 source), screenshots if any.
3. Pick the right `type` so the correct card variant renders (dispatch in `components/apps/project-card.tsx`):
   - `android-app` / `ios-app` → mobile card · `web-app` → web card · `oss-repo` / `library` / `service` → OSS card · `desktop-app` → mobile card layout.
4. Set `featured: true` for projects that should lead the `/about` portfolio preview (use sparingly).
5. Run `pnpm dev` and verify it appears on `/about` and `/portfolio/<slug>`.

### Add a new workflow stage

> **Dormant feature (see §1).** `/workflow` is unpublished and lives under `app/(marketing)/_workflow/`. These recipes still apply if you republish or just edit the retained content, but a new stage won't appear on the live site until the route is un-privated.

1. Add a `Stage` entry to the relevant product array in `content/workflow/stages.ts` — each of `brief`/`forge`/`memo` carries the same four stages (`conceptualize → specify → build → ship`) with a `beats` list, per-platform `platformNotes`, and a `transcript` (the Claude Code chat as `ChatMessage[]`).
2. Every stage renders through the same `stage-segment.tsx` shell (sticky header + `<ClaudeChat>`) — there are **no** bespoke per-stage scene components. Platform-varying terminal commands go in the transcript's tool blocks: use a `run` block whose `cmd` is a `Record<WorkflowPlatform, string>` (or a `note` block) so flipping the platform tab changes the command.
3. There are **no** `phase-<n>.mdx` files and no R3F/GSAP scenes on `/workflow` — the narrative lives in `stages.ts` and renders as chat transcripts via `components/claude-chat/*`. `workflow.tsx` orchestrates with `motion` + a sticky layout.

### Add a workflow artifact

1. Artifacts are per-product, per-type: `content/workflow/artifacts/<product>/<type>.mdx` where product ∈ {brief, forge, memo} and type ∈ {claude-md, prd, spec, prompt-library}.
2. Register the loader in `content/workflow/artifacts/index.ts`; the route `/workflow/artifacts/[product]/[type]` SSGs from there, and per-type SEO metadata lives in the same file.

### Add / edit a manifesto principle

`content/manifesto/principles.ts` is a typed array of `{ id, number, title, body }`. Keep body to ≤ 2 short sentences. The grid auto-handles offset/rhythm for up to 7 principles.

### Update brand colors

Edit the `@theme` block at the top of `app/globals.css`. Tailwind v4 picks up the change on save. Avoid hardcoding hex values anywhere outside `globals.css`; reach for the CSS var (`var(--accent)` or the Tailwind utility `bg-accent`).

---

## 6. Component conventions

- **File naming**: `kebab-case.tsx` (e.g., `project-card-android.tsx`). Export the component as `PascalCase` (`ProjectCardAndroid`). One component per file unless a tiny sibling component is exclusively used by it.
- **Default to RSC**. Add `"use client"` only when the component uses hooks, browser APIs, event handlers, or motion libraries. Keep client islands small — pass server-rendered children down rather than promoting whole subtrees.
- **R3F components are always client + dynamic-imported**: `const R3FHero = dynamic(() => import('./r3f-hero'), { ssr: false })`.
- **Props**: prefer named props over positional. Use `Readonly<{}>` for component props. No default-export for utility components; reserve default-exports for Next route files (`page.tsx`, `layout.tsx`).
- **Composition over conditional bloat**: e.g., `ProjectCard` dispatches to `ProjectCardAndroid` / `ProjectCardOss` / `ProjectCardWeb` via a small switch; do NOT add a giant `if/else` inside one card component.
- **`cn()` utility**: import from `lib/utils.ts`. Always use it when conditionally composing classNames. Never string-concatenate Tailwind classes by hand.
- **No barrel files** (`index.ts` re-exports) — they hurt tree-shaking and IDE jump-to-definition.

### Project schema (frozen at v2 launch — extend, don't rewrite)

```ts
// types/project.ts
type ProjectType =
  | "android-app"
  | "ios-app"
  | "web-app"
  | "desktop-app"
  | "oss-repo"
  | "library"
  | "service";
type ProjectStatus = "live" | "beta" | "coming-soon" | "archived";
type Chain = "bitcoin" | "ethereum" | "bsc" | "tron" | "polygon" | "solana" | "multi-chain" | "n-a";
type Platform = "android" | "ios" | "web" | "windows" | "macos" | "linux" | "cross-platform";
type LinkKind =
  | "play-store"
  | "app-store"
  | "github"
  | "gitlab"
  | "website"
  | "docs"
  | "demo"
  | "download"
  | "npm"
  | "discord"
  | "telegram"
  | "video";

interface ProjectLink {
  kind: LinkKind;
  url: string;
  label?: string;
  primary?: boolean;
}
interface ProjectStat {
  kind:
    | "downloads"
    | "rating"
    | "reviews"
    | "stars"
    | "forks"
    | "users"
    | "tvl"
    | "version"
    | "custom";
  value: string;
  raw?: number;
  label?: string;
}
interface ProjectMedia {
  icon: string;
  cover?: string;
  screenshots?: { src: string; alt: string; device?: "phone" | "tablet" | "desktop" }[];
  video?: string;
  accentColor?: string;
}
interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  platforms: Platform[];
  chains: Chain[];
  category?: "explorer" | "wallet" | "messaging" | "tool" | "infra" | "experiment";
  tags?: string[];
  media: ProjectMedia;
  stats: ProjectStat[];
  links: ProjectLink[];
  launchedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  hasLongForm?: boolean;
}
```

**To add a new project type or LinkKind**: extend the union, add a renderer (or rendering branch) where the type/kind is consumed, and never widen the type to `string` to skip the work.

---

## 7. Styling rules

- **Tailwind v4** is the default. Use utility classes for layout, spacing, color, typography, state variants.
- **Design tokens** live in `app/globals.css` inside `@theme { … }`. Token names follow the `--color-*` Tailwind-v4 convention: `--color-canvas` (page bg), `--color-surface` (elevated bg), `--color-ink`, `--color-ink-soft` (secondary text — brighter than ink-dim for emphasis; AA-safe), `--color-ink-dim`, `--color-accent`, `--color-accent-hot`, `--color-accent-deep`, `--color-violet`, `--color-success`, `--color-warn`, `--color-danger`. The ink scale reads ink → ink-soft → ink-dim (primary → secondary → muted); avoid opacity hacks like `text-ink-dim/70` on small text — they drop below AA. Reference via Tailwind utilities (`bg-canvas`, `text-ink`, `text-accent`, `ring-accent-hot`) or CSS vars in arbitrary values (`bg-[var(--color-canvas)]`). Custom utilities `.glass`, `.text-display`, `.text-eyebrow`, `.ease-out-expo`, `.section-y` / `.section-y-lg` (responsive section rhythm, adopted on `/about`) are also defined here.
- **Don't use arbitrary value escape hatches** (`bg-[#08D9D6]`) — add a token first, use the named class. Exception: one-off layout numbers (e.g., `mt-[18vh]`) and `bg-[var(--color-*)]` refs are fine.
- **Component-scoped CSS**: if a component needs styling that utility classes can't express (e.g., GLSL shader textures, complex `mask-image`), put it inline via `style={{}}` or, for repeated cases, add a small CSS file colocated next to the component (`r3f-hero.module.css`).
- **No CSS-in-JS libs** (no styled-components, no emotion).
- **Dark by default**. No light theme in v1.
- **Glass card recipe**: `rounded-2xl bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/[0.08]`. Don't reinvent.
- **Typography scale**: `text-xs` (12px mono labels) → `text-sm` (14 body) → `text-base` (16 body) → `text-lg/xl/2xl` (UI emphasis) → `text-3xl/4xl/5xl/6xl/7xl` (display via Instrument Serif).
- **Tracking**: `tracking-[-0.02em]` on display headings; `uppercase tracking-[0.08em]` on mono eyebrows.

---

## 8. Motion & 3D

**Mandatory rule**: every motion-bearing component ships with a `prefers-reduced-motion` fallback. No exceptions.

- **Reduced-motion source-of-truth**: `useReducedMotion()` from `hooks/use-reduced-motion.ts`. The `ReducedMotionProvider` toggles `data-motion="reduce"` on `<html>` so CSS-only fallbacks work via `[data-motion="reduce"] *`.
- **R3F components**: always client + `next/dynamic({ ssr: false })`. Wrap in a `<Suspense>` with a fast SVG/CSS-gradient placeholder so LCP is text-driven, not canvas-driven. Hydrate after `requestIdleCallback`. R3F now lives **only on the hero (`/`)** — `/workflow` is a pure chat-transcript narrative with no canvas.
- **Lenis**: register once in `LenisProvider` (gated to `/about` via `SMOOTH_ROUTES`; re-add a route there if you republish `/workflow`); it integrates with `motion`'s scroll utilities. No GSAP/ScrollTrigger in the codebase. Always clean up listeners in the `useEffect` return.
- **`motion` library**: use `whileInView` with `viewport={{ once: true, amount: 0.35 }}` for entrance animations so they don't re-fire on scroll-back. Use shared `layoutId` sparingly — they're powerful but easy to mis-pair. The workflow stage segments are `motion`-driven with a sticky layout (no scrub timelines); chat bubbles reveal via a reduced-motion-safe stagger.
- **Three.js asset budget**: the hero flow-field is the only R3F scene. No postprocessing dependency (bloom was dropped); keep it cheap. `three` MUST stay out of every chunk except `/`.
- **No confetti**: `canvas-confetti` was removed with the `/workflow` redesign — don't reintroduce it without confirming a dependency add (§11).

---

## 9. Accessibility checklist (mandatory per PR)

- [ ] Skip link is the first focusable element on every page.
- [ ] All interactive elements have visible focus rings (`outline: 2px solid var(--accent-hot); outline-offset: 4px`).
- [ ] Body text contrast ≥ 4.5:1 against its background; large text ≥ 3:1. Check both `--bg` and `--bg-elev` surfaces.
- [ ] No information conveyed by color alone (status dots are paired with labels).
- [ ] All images have `alt` (or `alt=""` for decorative).
- [ ] Form fields have real `<label>`s, `aria-describedby` for help/error text, sensible `inputmode`.
- [ ] Scroll-driven content has a non-scroll fallback for reduced-motion users.
- [ ] Keyboard nav reaches every interactive element in logical order. Workflow page advances beat-by-beat with `Tab` / `Space` / `Enter`; `?` opens shortcut help.
- [ ] Screen-reader summary is provided for any visual narrative (sr-only `<ol>` mirroring the workflow stages).
- [ ] Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>` each appear exactly once on a page. Section headings descend predictably (`h1` → `h2` → `h3`).

---

## 10. Performance budget

| Metric                          | Target                      |
| ------------------------------- | --------------------------- |
| Lighthouse Performance (mobile) | ≥ 90                        |
| Lighthouse Accessibility        | ≥ 98                        |
| Lighthouse Best Practices       | 100                         |
| Lighthouse SEO                  | 100                         |
| LCP                             | < 2.5s                      |
| CLS                             | < 0.05                      |
| INP                             | < 200ms                     |
| Bundle ceiling (route `/`)      | ≤ 200KB gz (incl. R3F lazy) |
| Bundle ceiling (`/apps`)        | ≤ 160KB gz                  |
| Bundle ceiling (`/workflow`)    | n/a — dormant (see §1)      |
| Bundle ceiling (other routes)   | ≤ 140KB gz                  |

The floor for any client-touched route is roughly 128 KB (React 19 + Next 15 framework chunks + shared `motion` library). The ceilings above are set ~10–15 KB above measured current numbers so reasonable additions don't regress past them. Verify with `pnpm analyze`. `three` (R3F) MUST NOT appear in chunks for routes other than `/` (the hero is the only R3F scene).

**Image rules**:

- All `<img>` go through `next/image` with explicit `width` + `height` (or `fill` + parent aspect-ratio container).
- AVIF first, WebP fallback, raster last.
- `priority` flag is reserved for the hero brand mark and one above-the-fold project icon — never more.
- Project screenshots: ship at 1x + 2x in `public/projects/<slug>/`, let `next/image` srcset.

**Font rules**:

- Geist Sans + Geist Mono come from the `geist` npm package (`geist/font/sans`, `geist/font/mono`) — self-hosted, next/font-optimized. Their CSS variables (`--font-geist-sans`, `--font-geist-mono`) are wired to Tailwind's `--font-sans` / `--font-mono` via `@theme inline` in `globals.css`.
- Instrument Serif comes from `@fontsource/instrument-serif/400-italic.css` imported once in `app/globals.css` — italic display accent only, no other weights.
- No external font CDN. No raw `<link rel="stylesheet">` to fonts.googleapis.com.

---

## 11. Agent guardrails

You (Claude) have freedom in these areas — proceed without asking:

- ✅ Create, edit, or delete files under `app/`, `components/`, `content/`, `data/`, `lib/`, `shaders/`, `hooks/`, `types/`, `public/`.
- ✅ Refactor utility code in `lib/`.
- ✅ Add or refine MDX content under `content/`.
- ✅ Tweak styles in `app/globals.css` (within existing tokens) and Tailwind class usage anywhere.
- ✅ Add new shadcn components by copying them from upstream into `components/ui/`.
- ✅ Add reasonable unit/Playwright tests.

You MUST confirm with the user before:

- 🛑 Adding a new npm dependency (or removing one). State why, what it costs in bundle size, and what alternatives you considered.
- 🛑 Upgrading any pinned major version in §2.
- 🛑 Changing `next.config.ts`, `tsconfig.json`, ESLint or Prettier configs.
- 🛑 Editing `.env*`, `vercel.json`, `package.json` `engines`/`scripts`, GitHub Actions workflows.
- 🛑 Changing the `Project` / workflow content schemas (extending unions is fine; restructuring isn't).
- 🛑 Deploying, force-pushing, or any destructive git operation (`reset --hard`, `clean -f`, branch deletion).
- 🛑 Editing or removing `LICENSE`.
- 🛑 Committing files with secrets (`.env*`, keys, tokens).

**Git workflow**:

- **One branch per PR.** Cut each PR's branch fresh from an up-to-date `main` (e.g. `claude/<short-slug>`), even when several PRs happen in one session — don't keep stacking unrelated work onto a stale session branch. The harness may assign a starting branch per session; reuse it only for the first PR, then branch anew. Never push to `main` directly; open a PR. The legacy `claude/revamp-blokz-landing-zkhIT` branch is retired.
- Commit messages: imperative mood, ≤ 72 char subject, optional body. Conventional Commit prefixes welcome but not required (`feat:`, `fix:`, `chore:`).
- Group related changes in one commit; don't make 10 micro-commits for one feature.
- Never `--no-verify` or `--no-gpg-sign` unless the user explicitly asks.

### Open-items tracking workflow

`BACKLOG.md` at the repo root is the single source of truth for "tracked but deferred" work — anything you'd otherwise mention only in chat. Use it relentlessly so nothing gets lost between Phases.

**When to add an entry**:

- A decision is blocked on the user (missing asset, copy, env var, scheduling URL, etc.) → add with `**[user]**` tag.
- A piece of code is functional but un-refined and the time to refine it isn't now → `**[polish]**`.
- A workaround was applied that should be unwound when adjacent code is next touched → `**[debt]**`.
- An assumption (Play Store ad SDK requirement, a third-party version pin, a fair-use claim, etc.) should be sanity-checked before launch → `**[verify]**`.
- A nice-to-have is explicitly post-v2 → `**[future]**`.

**Format**: file the item under the matching Phase section if it surfaced during that Phase's work, otherwise under "Carried from Phase 1" or "Future enhancements". Always include enough context (file path, what's blocking, what unblocks it) so the item is actionable months later without reading chat history.

**Inline `// TODO` comments** are encouraged for code-local items:

```ts
// TODO(user): swap to /public/brand/logo.svg once vector is supplied.
// TODO(polish): replace this static gradient with a moving shader uniform.
// TODO(debt): consolidate this duplicated reduced-motion check.
// TODO(verify): does Play Store still require this exact path?
```

The `(category)` parenthetical mirrors a `BACKLOG.md` tag. **Rule**: if the item isn't purely code-local (e.g., it depends on the user or spans multiple files), the inline `// TODO` must be paired with a `BACKLOG.md` entry. Pure code-local items can stay as inline `TODO` only.

**When closing an item**: change the BACKLOG checkbox to `[x]` and move it to the **Resolved** section at the bottom (rolling archive). If the item came from an inline `// TODO`, remove the comment in the same commit.

Triage `BACKLOG.md` at the end of every Phase and again before launch.

---

## 12. Common tasks playbook

### Grow / maintain the directory (recurring)

The `/` directory is the product — keep it comprehensive + current. Two committed Claude Code routines
encode the flow (see `docs/directory-playbook.md`):

- **`/add-app <name | url | list>`** — research + author new `App` listings as `data/apps/<slug>.json`
  (dedup → web-verify → schema-valid entry → `pnpm velite`, which runs `--strict` and hard-fails on a
  bad/duplicate entry). No fabrication; author a verifiable
  `insight`; `addedAt`/`lastVerifiedAt` = today; `featured` sparingly.
- **`/discover-apps [focus]`** — autonomous counterpart to `/add-app`: finds net-new apps not yet
  listed and opens a PR. Built for unattended/scheduled runs.
- **`/audit-directory [--category c] [--stale-since date]`** — re-verify existing listings (links,
  pricing, platforms, model support, still-alive), fix drift, archive discontinued apps, bump
  `lastVerifiedAt`, and **append a `changelog` entry on every substantive change** (the visible audit
  trail rendered on `/apps/<slug>` by `components/tools/change-history.tsx`). Run ~weekly, oldest-verified first.

Schedule `/discover-apps` + `/audit-directory` weekly via Claude Code **Routines** (account-owned —
the user sets them up; they open PRs for review). Exact routine prompts: `docs/directory-playbook.md`.

### Add a new app card type (e.g., `chrome-extension`)

1. Extend `ProjectType` union in `types/project.ts`.
2. Create `components/apps/project-card-extension.tsx` rendering the variant.
3. Add a `case "chrome-extension":` branch to the dispatcher in `components/apps/project-card.tsx`.
4. Update `lib/projects.ts` filter helpers if the new type unlocks a new filter chip.
5. Add an example entry to `data/projects.ts` (status `"coming-soon"` if not real yet) so the variant ships exercised.

### Add a new workflow stage

1. Append a `Stage` to each product array in `content/workflow/stages.ts` (keep `brief`/`forge`/`memo` parallel — same `id`, `number`, `beats` shape, `platformNotes`, and a `transcript`).
2. No bespoke visual needed — `stage-segment.tsx` renders every stage as a sticky header + `<ClaudeChat>`. Author the narrative as `transcript: ChatMessage[]` using the `run`/`write`/`plan`/`pr`/`note` tool blocks.
3. Keep platform-varying commands reactive: a `run` block's `cmd` may be a `Record<WorkflowPlatform, string>`, and `note` blocks are platform-keyed — both flip with the platform tab. The chat stagger is already reduced-motion-safe.

### Change brand colors

1. Edit the `@theme` block in `app/globals.css`. That's it — every utility class derives from there.
2. If the change is dramatic, regenerate OG images by rebuilding (`app/opengraph-image.tsx` reads tokens).

### Re-host a logo

1. Drop the SVG (preferred) or 2x PNG in `public/brand/`.
2. Update `data/brand.ts` `logo.src` to the local path.
3. Run `pnpm dev`, verify nav + footer + manifest icon.

### Add an OSS repo to the showcase

1. New entry in `data/projects.ts` with `type: "oss-repo"`, `status: "live"`, `platforms: ["cross-platform"]`, stats `{ kind: "stars" }` + `{ kind: "forks" }` + `{ kind: "version" }`, links `{ kind: "github", primary: true }` + `{ kind: "npm" }` if published.
2. Drop a 512×512 icon in `public/projects/<slug>/icon.png`.

---

## 13. Domain glossary & brand asset registry

**Vocabulary**:

- **Vibecoding** — agentic engineering: conceptualizing, prompting, and shipping software end-to-end with an AI agent as primary author and human as architect/reviewer.
- **Sample products** — the three fictional products narrated across `/workflow` and its artifacts: **Blokz Brief** (arxiv → paper digest), **Eval Forge** (spec → eval suite), **Edge Memo** (on-device meeting capture). Not real products — illustrative of the workflow only. (The earlier single "Blokz Receipt" placeholder was retired.)
- **Bento masonry** — the apps grid layout: CSS Grid + manual `span` annotations on `featured` entries; not a JS masonry lib.
- **Glass card** — the standard surface treatment (recipe in §7).
- **Chain mark** — small monogram badge for a blockchain (BTC, ETH, BSC, TRON, MULTI).

**Brand asset registry**: see `data/brand.ts` for the live source-of-truth (extracted from legacy v1 `settings.json` before cleanup). Shape includes `name`, `legalName`, `domain`, `tagline`, `positioning`, `headline` (eyebrow/title/titleAccent/sub for the hero), `logo` (PNG src/alt/width/height — swap to `/public/brand/logo.svg` once a vector is supplied), `social` (telegram/github/linkedin/twitter/gdev/email/playStore/flowPage), and `nav` (top-level routes). Add new brand-level constants here rather than hardcoding.

---

## 14. Environment & secrets

`.env.local` (gitignored — never commit):

```
RESEND_API_KEY=             # required for the /contact server action
CONTACT_TO_EMAIL=team@blokz.dev
CONTACT_FROM_EMAIL=Blokz <hello@blokz.dev>   # optional; falls back to onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # prod: https://blokz.dev
```

Vercel project env (production + preview):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (optional)
- `NEXT_PUBLIC_SITE_URL` = `https://blokz.dev`

Never log secret values. Never check secrets into the repo. If you find a leaked secret in history, alert the user and recommend rotation.

---

## 15. Definition of done

A change is "done" only when ALL of these hold:

- [ ] `pnpm lint` clean.
- [ ] `pnpm typecheck` clean.
- [ ] `pnpm build` succeeds.
- [ ] Bundle analyzer shows no unexpected dep crept into a non-`/` chunk.
- [ ] Manual a11y pass on touched pages (focus ring visible, keyboard nav works, reduced-motion fallback renders).
- [ ] Lighthouse mobile run on touched routes meets §10 thresholds (or regression is explained).
- [ ] Visual confirmation in a real browser (Chrome + Firefox) — UI work isn't done until you've seen it move. Take a screenshot if you can't run a browser.
- [ ] For UI work: tested at viewport widths 360 (mobile), 768 (tablet), 1440 (desktop), 1920 (wide).
- [ ] Commit message describes the _why_, not just the _what_.

---

## Quick references

- Plan of record: `Roadmap.md` (iterations + chunks) · deferred items: `BACKLOG.md`
- Branch: one fresh branch per PR off up-to-date `main` (e.g. `claude/<short-slug>`); PR into `main` (see §11 Git workflow)
- Contact destination: `team@blokz.dev`
- Production domain (TBD cutover): `blokz.dev`
- Play Store dev: `https://play.google.com/store/apps/dev?id=8878695474933625157`
