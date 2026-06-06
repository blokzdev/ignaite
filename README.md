# Blokz.dev

Marketing site for **Blokz Development Co.** — a vibecoding studio building AI apps end-to-end with Claude Code.

The site is itself a demonstration: it's built end-to-end with Claude Code. The public surface is the **AI-apps directory** (`/`), the studio story (`/about`), and contact (`/contact`). (A detailed `/workflow` walkthrough exists in the repo but is currently unpublished — see below.)

🌐 **Live:** [blokz.dev](https://blokz.dev)
📒 **Contract:** see [`CLAUDE.md`](./CLAUDE.md) for stack, conventions, and agent guardrails
📋 **Open items:** see [`BACKLOG.md`](./BACKLOG.md) for tracked deferrals
🗺️ **Plan of record:** see [`Roadmap.md`](./Roadmap.md) for iterations + chunks

---

## Stack

Next.js 15 (App Router · RSC · Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui primitives · `motion` + Lenis · React Three Fiber · MDX + Shiki via `rehype-pretty-code` · Resend · Vercel.

## Quick start

```bash
pnpm install
cp .env.example .env.local      # then fill in RESEND_API_KEY for the contact form
pnpm dev                        # http://localhost:3000
```

## Common commands

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Dev server (Turbopack, hot reload)                |
| `pnpm build`     | Production build (SSG)                            |
| `pnpm start`     | Serve the production build locally                |
| `pnpm lint`      | ESLint                                            |
| `pnpm lint:fix`  | ESLint with autofix                               |
| `pnpm typecheck` | `tsc --noEmit`                                    |
| `pnpm format`    | Prettier on the whole tree                        |
| `pnpm analyze`   | `next build` with `@next/bundle-analyzer` enabled |

Pre-commit auto-runs `lint-staged` (ESLint --fix + Prettier on staged files).
Pre-push auto-runs `pnpm typecheck`.

## What's in the box

- **`/`** — the **AI-apps directory**: ~70 curated tools with category / pricing / Blokz-mark / status filters + search + sort (`nuqs` URL state), a featured carousel, infinite scroll, and light-touch sponsored slots
- **`/apps/[slug]`** — per-app detail with `SoftwareApplication` JSON-LD (one SSG page per directory app)
- **`/about`** — studio identity: R3F hero (cursor-reactive flow-field shader) → Now/Next band → how-we-work → manifesto
- **`/contact`** — a Resend-powered server action with IP rate-limiting and an honest "offline" fallback when `RESEND_API_KEY` is unset
- **`/portfolio/[slug]`** _(dormant — not currently published)_ — per-project detail for Blokz's own shipped apps. Retained under the Next private folder `app/(marketing)/_portfolio/` (with `data/projects.ts` + `components/apps/*`) for when a real AI-app / web-app / OSS portfolio is revived
- **`/workflow`** _(dormant — not currently published)_ — a 4-stage Claude Code session walkthrough (conceptualize → specify → build → ship) across three sample products (Blokz Brief, Eval Forge, Edge Memo), rendered as chat transcripts, plus 12 Shiki-highlighted MDX artifacts at `/workflow/artifacts/[product]/[type]`. Retained in the repo under the Next private folder `app/(marketing)/_workflow/`; rename to `workflow/` to republish (see `BACKLOG.md`).

**Content tracks:**

- **Directory** (the live `/` homepage): [`data/apps.ts`](./data/apps.ts) · schema [`types/app.ts`](./types/app.ts) · UI `components/tools/*`
- **Portfolio** _(dormant)_: [`data/projects.ts`](./data/projects.ts) · schema [`types/project.ts`](./types/project.ts) · UI `components/apps/*` — retained for a future revival, not surfaced on the live site.

## Adding an entry

- **Directory app** → append an `App` to `data/apps.ts` (`slug`, `name`, `tagline`, `description`, `category`, `pricing`, `platforms`, `links` with ≥1 `primary: true`). Or run the **`/add-app`** Claude Code routine (research + author + validate); audit existing listings with **`/audit-directory`**. See [`docs/directory-playbook.md`](./docs/directory-playbook.md).
- **Portfolio project** _(dormant)_ → append a `Project` to `data/projects.ts`; it won't surface until the portfolio is republished (rename `_portfolio/` → `portfolio/`, re-add the sitemap + redirect).

Full recipes (directory + the dormant portfolio/workflow, brand-color changes, etc.) live in `CLAUDE.md` §5 + §12.

## Deploy

Production is wired to Vercel. `main` deploys automatically to [blokz.dev](https://blokz.dev); every branch + PR gets its own preview URL. Required Vercel env vars (Production + Preview):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (default `team@blokz.dev`)
- `CONTACT_FROM_EMAIL` (optional — must be on a verified Resend domain)
- `NEXT_PUBLIC_SITE_URL=https://blokz.dev`

## License

See [`LICENSE`](./LICENSE).
