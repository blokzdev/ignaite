# Ignaite

**Ignaite** is an **AI-managed directory** of AI apps — every listing researched, written, and continuously audited by Claude Code, each carrying a one-line fact worth knowing.

The site is itself the product — and a demonstration of agentic engineering: the directory (`/`) is researched, written, and audited by Claude Code on recurring routines; `/about` explains how it's managed; `/contact` reaches the studio behind it.

🌐 **Live:** [ignaite.app](https://ignaite.app)
📒 **Contract:** see [`CLAUDE.md`](./CLAUDE.md) for stack, conventions, and agent guardrails
📋 **Open items:** see [`BACKLOG.md`](./BACKLOG.md) for tracked deferrals
🗺️ **Plan of record:** see [`Roadmap.md`](./Roadmap.md) for iterations + chunks

---

## Stack

Next.js 15 (App Router · RSC · Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui primitives · `motion` + Lenis · React Three Fiber (the `/about` hero) · Velite-validated per-file JSON data layer (zod) · `nuqs` URL state · MDX + Shiki via `rehype-pretty-code` · Resend · Vercel.

## Quick start

```bash
pnpm install
pnpm dev                        # http://localhost:3000
```

The contact form needs env vars in `.env.local` (everything else runs without them):

```
RESEND_API_KEY=                 # required for the /contact server action
CONTACT_TO_EMAIL=team@ignaite.app
CONTACT_FROM_EMAIL=Ignaite <hello@ignaite.app>   # optional; must be a verified Resend domain
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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

- **`/`** — the **AI-apps directory**: ~460 listings across 43 categories with category / pricing / license / deployment / platform / status filters + search + two-field sort (`nuqs` URL state), a rotating featured carousel, a recently-added rail, infinite scroll, and light-touch sponsored slots
- **`/apps/[slug]`** — one SSG detail page per listing: the honest brief (description, "Worth knowing" insight, the edge, pros/cons), curated alternatives, references, a dated change history, and `SoftwareApplication` + `BreadcrumbList` JSON-LD
- **`/category/[slug]`** + **`/categories`** — 39 static category landing pages (pure RSC) and a cluster-grouped index hub
- **`/about`** — how the directory is AI-managed: R3F hero (cursor-reactive flow-field shader) → Now/Next band → how-we-work → manifesto
- **`/contact`** — a Resend-powered server action with IP rate-limiting and an honest "offline" fallback when `RESEND_API_KEY` is unset
- **Machine surfaces** — [`/llms.txt`](https://ignaite.app/llms.txt) + [`/llms-full.txt`](https://ignaite.app/llms-full.txt) (build-generated [llmstxt.org](https://llmstxt.org) indexes), [`/feed.json`](https://ignaite.app/feed.json) (JSON Feed 1.1 of the newest listings), and a freshness-aware sitemap
- **PWA** — installable with a custom install prompt, an `/offline` fallback, and a build-stamped service worker that refreshes its precache on every deploy
- **Hardened edges** — Content-Security-Policy + companion security headers on every route; Lighthouse CI gates on a11y/SEO in CI

A `/workflow` walkthrough (4-stage Claude Code session narrative + 12 MDX artifacts) exists in the repo but is unpublished — retained under `app/(marketing)/_workflow/` for possible republishing/repurposing. The studio's earlier portfolio track was removed; its archive is git history (commit `12c3978`).

## The data layer

One JSON file per listing in [`data/apps/`](./data/apps/), validated by the zod schema in [`lib/apps-schema.ts`](./lib/apps-schema.ts) (the source of truth; types in [`types/app.ts`](./types/app.ts)) and aggregated by Velite ([`velite.config.ts`](./velite.config.ts) → generated `.velite/`). A bad or duplicate entry fails the build, not silently.

**Adding a listing** → create `data/apps/<slug>.json` and run `pnpm velite`, or use the Claude Code routines — **`/add-app`** (research + author + validate), **`/discover-apps`** (autonomous weekly discovery), **`/audit-directory`** (weekly re-verification), **`/rotate-featured`** (biweekly carousel rotation). See [`docs/directory-playbook.md`](./docs/directory-playbook.md) and `CLAUDE.md` §5 + §12.

## Deploy

Production is wired to Vercel. `main` deploys automatically to [ignaite.app](https://ignaite.app); every branch + PR gets its own preview URL. Required Vercel env vars (Production + Preview):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (default `team@ignaite.app`)
- `CONTACT_FROM_EMAIL` (optional — must be on a verified Resend domain)
- `NEXT_PUBLIC_SITE_URL=https://ignaite.app`

## License

- **Code:** [FSL-1.1-MIT](./LICENSE) (Functional Source License) — free to read, fork, and use for anything that isn't a competing commercial directory; each release automatically converts to MIT two years after publication.
- **Directory content** (listing copy, insights, editorial text): [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — reuse with attribution ("Ignaite (ignaite.app) — Blokz Development Co."), non-commercial.

See [`LICENSE`](./LICENSE) for the full terms.
