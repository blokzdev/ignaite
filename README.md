# Ignaite

**Ignaite** is an **AI-managed directory** of AI apps — every listing researched, written, and continuously audited by Claude Code, each carrying a one-line fact worth knowing.

The site is itself the product — and a demonstration of agentic engineering: the directory (`/`) is researched, written, and audited by Claude Code on recurring routines; `/about` explains how it's managed; `/contact` reaches the team behind it.

🌐 **Live:** [ignaite.app](https://ignaite.app)
📒 **Contract:** see [`CLAUDE.md`](./CLAUDE.md) for stack, conventions, and agent guardrails
📋 **Open items:** see [`BACKLOG.md`](./BACKLOG.md) for tracked deferrals
🗺️ **Plan of record:** see [`Roadmap.md`](./Roadmap.md) for iterations + chunks

---

## Stack

Next.js 15 (App Router · RSC · Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui primitives · `motion` + Lenis · React Three Fiber (the `/about` hero) · Velite-validated per-file JSON data layer (zod) · `nuqs` URL state · MDX + Shiki via `rehype-pretty-code` · Supabase (accounts + bookmarks — the content stays git-authored) · Resend · Vercel.

## Quick start

```bash
pnpm install
pnpm dev                        # http://localhost:3000
```

The contact form and the account layer need env vars in `.env.local` (everything else runs without them — both features degrade gracefully when unset):

```
RESEND_API_KEY=                 # required for the /contact server action
CONTACT_TO_EMAIL=team@ignaite.app
CONTACT_FROM_EMAIL=Ignaite <hello@ignaite.app>   # optional; must be a verified Resend domain
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Accounts + bookmarks (optional — sign-in stays dormant without them)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Common commands

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Dev server (Turbopack, hot reload)                    |
| `pnpm build`        | Production build (SSG; Velite validates data first)   |
| `pnpm start`        | Serve the production build locally                    |
| `pnpm velite`       | Validate `data/apps/*.json` + `data/sponsored/*.json` |
| `pnpm lint`         | Velite + ESLint                                       |
| `pnpm lint:fix`     | ESLint with autofix                                   |
| `pnpm typecheck`    | Velite + `tsc --noEmit`                               |
| `pnpm format`       | Prettier on the whole tree                            |
| `pnpm format:check` | Prettier check only                                   |
| `pnpm analyze`      | `next build` with `@next/bundle-analyzer` enabled     |

Pre-commit auto-runs `lint-staged` (ESLint --fix + Prettier on staged files).
Pre-push auto-runs `pnpm typecheck`.

## What's in the box

- **`/`** — the **AI-apps directory**: 1,000+ listings across 43 categories with category / pricing / license / deployment / platform / status filters + search + two-field sort (`nuqs` URL state), a rotating featured carousel, a recently-added rail, infinite scroll, and light-touch sponsored slots
- **`/apps/[slug]`** — one SSG detail page per listing: the honest brief (description, "Worth knowing" insight, the edge, pros/cons), level-aware capability chips, curated alternatives, references, a "Used in N recipes" rail, a dated change history, and `SoftwareApplication` + `BreadcrumbList` JSON-LD
- **`/recipes`** — curated **multi-app workflow recipes**: each step a listed app performing a verified capability, with linear or DAG (parallel + loop) flows, per-step substitution suggestions, and `HowTo` JSON-LD
- **`/compare`** — ~3.1k indexed head-to-head comparison pages derived from the curated alternatives graph, with a capability-overlap row and a deterministic "when to pick which" verdict
- **`/insights`** — build-time data-viz over the corpus (pricing mix, category coverage, capability families) with coverage-honest caveats — pure RSC, no charting dependency
- **`/category/[slug]`** + **`/categories`** — 43 static category landing pages (pure RSC) and a cluster-grouped index hub
- **Accounts + bookmarks** — optional Google sign-in (Supabase) with per-user bookmarks on apps and recipes and a `/account` area; the directory itself stays fully static — auth state hydrates client-side and the content is never served from the database
- **`/about`** — how the directory is AI-managed: R3F hero (cursor-reactive flow-field shader) → Now/Next band → how-we-work → manifesto
- **`/contact`** — a Resend-powered server action with IP rate-limiting and an honest "offline" fallback when `RESEND_API_KEY` is unset
- **Machine surfaces** — [`/llms.txt`](https://ignaite.app/llms.txt) + [`/llms-full.txt`](https://ignaite.app/llms-full.txt) (build-generated [llmstxt.org](https://llmstxt.org) indexes), [`/feed.json`](https://ignaite.app/feed.json) (JSON Feed 1.1 of the newest listings), and a freshness-aware sitemap
- **PWA** — installable with a custom install prompt, an `/offline` fallback, and a build-stamped service worker that refreshes its precache on every deploy
- **Hardened edges** — Content-Security-Policy + companion security headers on every route; Lighthouse CI gates on a11y/SEO in CI

A `/workflow` walkthrough (4-stage Claude Code session narrative + 12 MDX artifacts) exists in the repo but is unpublished — retained under `app/(marketing)/_workflow/` for possible republishing/repurposing. An earlier portfolio track was removed; its archive is git history (commit `12c3978`).

## The data layer

One JSON file per listing in [`data/apps/`](./data/apps/) and per recipe in [`data/recipes/`](./data/recipes/), validated by the zod schemas in [`lib/apps-schema.ts`](./lib/apps-schema.ts) / [`lib/recipes-schema.ts`](./lib/recipes-schema.ts) (the source of truth; types in [`types/`](./types/)) and aggregated by Velite ([`velite.config.ts`](./velite.config.ts) → generated `.velite/`). A bad entry, duplicate, or broken recipe→app reference fails the build, not silently. **Git is the source of truth for all content** — the Supabase layer only holds user data (accounts, bookmarks).

**Adding a listing** → create `data/apps/<slug>.json` and run `pnpm velite`, or use the Claude Code routines — **`/add-app`** (research + author + validate), **`/discover-apps`** (autonomous weekly discovery), **`/audit-directory`** (weekly re-verification), **`/rotate-featured`** (biweekly carousel rotation), **`/author-recipes`** / **`/audit-recipes`** (recipe authorship + re-verification). See [`docs/directory-playbook.md`](./docs/directory-playbook.md) and `CLAUDE.md` §5 + §12.

## Deploy

Production is wired to Vercel. `main` deploys automatically to [ignaite.app](https://ignaite.app); every branch + PR gets its own preview URL. Required Vercel env vars (Production + Preview):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (default `team@ignaite.app`)
- `CONTACT_FROM_EMAIL` (optional — must be on a verified Resend domain)
- `NEXT_PUBLIC_SITE_URL=https://ignaite.app`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (optional — enables accounts/bookmarks)

## License

- **Code:** [FSL-1.1-MIT](./LICENSE) (Functional Source License) — free to read, fork, and use for anything that isn't a competing commercial directory; each release automatically converts to MIT two years after publication.
- **Directory content** (listing copy, insights, editorial text): [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — reuse with attribution ("Ignaite (ignaite.app) — Ignaite Labs"), non-commercial.

See [`LICENSE`](./LICENSE) for the full terms.
