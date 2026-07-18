# Ignaite User Layer — Supabase Architecture & Phase-1 Design

> `docs/architecture-supabase-user-layer.md`
> Status: **design of record** for the Supabase user layer. Phase 1 is specified in full implementation detail; Phases 2–5 are roadmap-level but concrete. Nothing here has been merged — every dependency add, `next.config.ts`/`package.json`/workflow edit, and `.env*` change flagged below is a **CLAUDE.md §11 confirm-first action** and must be signed off before implementation.

---

## 1. Summary

Ignaite stays **git-first**. Every app (`data/apps/<slug>.json`) and recipe (`data/recipes/<slug>.json`) continues to be authored in the repo by Claude Code routines → PR → Velite `--strict` validation → merge. That is the **write model** and the single source of truth; it does not change.

On top of that we add a **user layer native to Supabase** (Postgres + Auth + RLS, Google sign-in) and, from Phase 2 onward, a **derived read model**: a one-directional pipeline projects the *validated* `.velite/*.json` artifact into Supabase content tables so the DB can serve semantic search, real joins with user data, and live `apps ↔ recipes` counts. Supabase is never the source of truth for content — it is a downstream, self-healing mirror of git.

**Phase 1** (this document's implementation core) ships the foundation with **zero content in the DB**: Google auth via `@supabase/ssr`, a `profiles` row per user, and `bookmarks` that store **slugs as soft-FKs** resolved on the frontend against the existing static Velite corpus. The entire feature is architected so that **no `cookies()` read ever enters the render path of a marketing route** — `/`, `/about`, and `/apps/*` stay statically prerendered and their ≤200 KB / ≤160 KB gz budgets are untouched — and `supabase-js` stays **server-side only**. Admin is locked to a single durable identity (the Google UID behind `ganesh575@gmail.com`), enforced in Postgres — not a client string check.

**The single most important invariant of this design — read before implementing:** auth state and bookmark state on static routes are **client-hydrated after mount**, never server-resolved-and-passed-down. §2a states this in full; every code sample below obeys it.

---

## 2. Architecture overview — write model vs. read model

Two models, one direction of flow. Content flows git → Supabase. User data lives only in Supabase. There is **no Supabase → git edge** anywhere; even Phase-4 contributions and Phase-5 "publish" go git-ward by opening a human-review PR.

```
  ┌──────────────────────────── WRITE MODEL (git = source of truth) ────────────────────────────┐
  │                                                                                              │
  │   Claude Code routine ──PR──▶ GitHub ──review + CI (velite build --strict)──▶ squash-merge   │
  │   (/discover-apps,           (.github/workflows/ci.yml)                          to  main    │
  │    /author-recipes, …)                                                             │         │
  └───────────────────────────────────────────────────────────────────────────────────┼─────────┘
                                                                                        │ push:[main]
                                    ┌───────────────────────────────────────────────────▼──────────────┐
                                    │  .github/workflows/sync-supabase.yml   (Phase 2 — push:[main] ONLY)│
                                    │    checkout(fetch-depth:0) → pnpm i → pnpm velite build --strict   │
                                    │    → node scripts/sync-supabase.ts                                 │
                                    │        reads .velite/{apps,recipes}.json  (validated, derived)     │
                                    │        → rpc project_content(p_apps, p_recipes, p_commit)          │
                                    └───────────────────────────────────────────────────┬──────────────┘
                                                       service_role (single txn)         │
                                                              ┌──────────────────────────▼────────────────────┐
   USER ACTIONS (Phase 1, direct)                            │                Supabase Postgres                │
   ┌───────────────────────────────┐   auth cookie / RLS     │  ── read model (Phase 2+) ──                    │
   │ browser → Next server action  │◀───────────────────────▶│  apps · recipes · recipe_steps(app_id FK)       │
   │  signInWithGoogle / signOut   │                         │  app_recipe_counts (view)                       │
   │  toggleBookmark / updateProfile│                         │  ── user layer (Phase 1) ──                     │
   │  getMyBookmarkedSlugs / …      │                         │  profiles · bookmarks · admins                  │
   └───────────────────────────────┘                         └──────────────────────────┬────────────────────┘
                                                     read-only, RLS-enforced             │
                                                              ┌──────────────────────────▼────────────────────┐
                                                              │        Next.js 15 on Vercel (SSG + islands)     │
                                                              │  /, /about, /apps/* stay STATIC — auth state is │
                                                              │  client-hydrated; supabase-js is server-only    │
                                                              └─────────────────────────────────────────────────┘
```

Key properties:

- **Content is downstream of git, always.** The sync only *reads* `.velite` and *writes* Supabase.
- **User data is Supabase-native** and never round-trips to git (except a Phase-5 opt-in "publish this generated recipe" which opens a PR — landing in git first, then projected back by the same sync).
- **The site stays SSG-first.** Phase 1 introduces the first `middleware.ts` and the first Supabase clients, but scoped so the directory and marketing routes remain static (§2a).
- **Project the derived artifact, not raw JSON.** The sync reads `.velite/apps.json` / `.velite/recipes.json` — post-Velite, so FK checks passed, the archived-app → recipe `status:'stale'` auto-demotion is already applied, and the DB is byte-faithful to what the site renders. `data/*.json` is never read by the sync.

### 2a. Static-vs-dynamic strategy (the load-bearing decision)

The entire value proposition is *"keep `/`, `/about`, and `/apps/*` statically prerendered while adding a full auth + bookmarks layer."* In Next 15, **any `cookies()` read in a route's render path is a Dynamic API** — and `createServerClient`'s `getAll()` reads cookies. Reading it in the **shared `app/(marketing)/layout.tsx`** (the common shell for `/`, `/about`, and `/apps/[slug]`) would opt the **entire route group** into dynamic rendering, destroying SSG for the directory and every app-detail page and blowing the §10 budgets. Reading it inside `/apps/[slug]` or `/` to resolve a per-user "is bookmarked" boolean does the same to those routes individually. We reject PPR as the escape hatch because it requires a `next.config.ts` change that Phase 1 explicitly excludes.

Therefore, the rule for **every marketing route** (`/`, `/about`, `/apps/[slug]`, `/recipes/[slug]`, `/category/*`, `/categories`, `/sign-in`):

> **No `cookies()` in the render path. No `createServerClient()` in a marketing Server Component or in the marketing layout. No per-user data resolved server-side and passed down as a prop.**

All per-user state on these routes is **client-hydrated after mount** through small islands that call server actions:

| Per-user thing on a static route | How it hydrates without breaking SSG |
|---|---|
| Nav avatar / "Sign in" affordance | `<AccountMenu>` client island rendered **statically** in `<SiteNav>`; on mount it calls the `getSessionSummary()` server action and swaps a stable-width skeleton for the avatar or the Sign-in pill. No prop from the layout. |
| Bookmark toggle on a card / detail header | `<BookmarkToggle>` client island starts **indeterminate**; a single `<BookmarkProvider>` client island (mounted once in the marketing layout, wrapping server-rendered children) fetches the user's whole set via one `getMyBookmarkedSlugs()` server-action call and shares it via React context. Each toggle reads its state from context — one round-trip for the whole page, not one per card. |

`<BookmarkProvider>` is a **client boundary that renders server children through it** — the cards and detail bodies stay RSC-rendered; only the provider and the leaf toggles are client. It imports **no** `supabase-js` (the server action does the DB work), so nothing Supabase reaches the `/` or `/apps/*` chunk. Anonymous users get an empty set back instantly (no session → RLS returns zero rows), so the toggles resolve to "not bookmarked / sign-in-on-click" with no flash of wrong state beyond the initial skeleton.

The **only** routes that legitimately read `cookies()`/`getClaims()` in their render path are the authenticated `(account)` group and the `/auth/*` handlers — those are *meant* to be dynamic, live in their own chunk, and are exempt from the SSG budgets.

---

## 3. The `apps ↔ recipes` deterministic relationship

The edge **already exists in the data model today**, enforced at build time — Phase 2 turns it into a live SQL count.

**Today (build-time):**
- `lib/recipes-schema.ts` — each `RecipeStep` carries `appSlug` (kebab regex).
- `velite.config.ts` `complete()` hook, guard **(d)**: every `step.appSlug` must exist in the apps `Map` or the **build throws**. Guard **(e)**: if a step's app is `archived`, the recipe is soft-demoted to `status:'stale'` in the *generated* record only (never throws — a throw would deadlock unattended auto-merge).
- The reverse edge ("how many recipes an app appears in") is already computed by `lib/tools/recipe-index.ts` → `recipesUsingApp`, re-exported from `lib/recipes.ts`.

**Phase 2 (live in Supabase):** identity is a **surrogate UUID PK + `slug UNIQUE` + FKs on `id`** (not slug-as-PK), so a slug rename is a single `UPDATE apps SET slug=…` that leaves every FK untouched.

> **Status normalization is mandatory here.** Per `lib/apps-schema.ts`, an **active app has `status` absent** ("Absence = active"). If the projection writes that absence as SQL `NULL`, then `status <> 'archived'` evaluates to `NULL` (not `TRUE`) and the row is silently excluded from the count — every active app would drop to `recipe_count = 0`, defeating the whole feature. The `project_content` RPC (§5, Phase 2) therefore **coalesces `status` to `'active'` on write**, and every filter below additionally uses `is distinct from 'archived'` / `coalesce(status,'active')` as belt-and-suspenders so a stray NULL can never miscount.

```sql
create table recipe_steps (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references recipes(id) on delete cascade,
  app_id      uuid not null references apps(id) on delete restrict, -- deterministic edge, rename-stable
  step_index  int  not null,
  step_id     text,        -- graph node id (nullable → linear)
  capability  text,
  unique (recipe_id, step_index)
);
create index recipe_steps_app on recipe_steps (app_id);

-- LIVE "recipes per app". An app can appear in several steps of ONE recipe → DISTINCT is required.
-- `is distinct from 'archived'` is NULL-safe: a row whose status is NULL is still counted.
create view app_recipe_counts as
select a.id, a.slug,
       count(distinct rs.recipe_id) filter (
         where r.deleted_at is null
           and coalesce(r.status, 'active') is distinct from 'archived'
       ) as recipe_count
from apps a
left join recipe_steps rs on rs.app_id = a.id
left join recipes      r  on r.id = rs.recipe_id
where a.deleted_at is null
group by a.id, a.slug;
```

`count(distinct recipe_id)` — **not** `count(*)` — because one recipe may reference the same app in multiple steps; a plain count over-counts. At today's recipe volume the view is instant; promote to a trigger-maintained counter or a matref-refreshed-at-end-of-sync only if it ever gets slow.

A projection regression test asserts that an **active-but-null-status** app both appears in `app_recipe_counts` with the correct number and is returned by `match_apps` (§5) — the exact failure the coalesce guards against.

---

## 4. PHASE 1 — full implementation

Phase 1 scope: **Google auth + `profiles` + `bookmarks` + self-serve account deletion**. No content tables. Bookmarks store slugs; the frontend resolves them against static Velite content. The whole feature ships ~0 KB of `supabase-js` to the `/` and `/apps/*` browser chunks, and — per §2a — **0 bytes of `cookies()` into any marketing render path.**

### 4a. Dependencies to add (CLAUDE.md §11 — needs user sign-off)

| Package | Version | Approx cost | Why | Ships to browser? |
|---|---|---|---|---|
| `@supabase/supabase-js` | 2.110.x | **~53.5 KB gz** / 209 KB min | Core client (auth-js + postgrest). Used only in server actions, route handlers, and middleware. | **No** (server-only in Phase 1) |
| `@supabase/ssr` | 0.12.x | **~5.6 KB gz** / 16 KB min (only transitive dep: `cookie`) | Current cookie-based SSR layer; replaced the deprecated `@supabase/auth-helpers-*`. Provides `createServerClient` / `createBrowserClient`. | **No** in Phase 1 |

**That's the entire dependency delta.** No `next-auth`, no standalone `zod` (Velite bundles its own; env validation uses a tiny hand-rolled accessor, see §4b). No client provider that imports `supabase-js`, no realtime, no browser Supabase client on any static route. Rate-limiting reuses the repo's existing `lib/rate-limit.ts` — no new dep.

**Alternatives considered:**
- *NextAuth/Auth.js* — rejected: duplicates Supabase Auth, adds its own session store, and we want RLS keyed on `auth.uid()` in Postgres regardless. One auth system.
- *Deprecated `@supabase/auth-helpers-nextjs`* — rejected: officially superseded by `@supabase/ssr`.
- *Global browser client + React context* — rejected: pulls the 53.5 KB `supabase-js` into the shared chunk and blows the `/` and `/apps/*` budgets. We go server-only + client-hydrated-via-server-actions instead (§2a).

> **Sign-off ask:** "Add `@supabase/supabase-js` + `@supabase/ssr` (~59 KB gz combined, server-side only — stays out of the `/` and `/apps/*` client chunks)."

### 4b. Supabase + Google OAuth setup (user-supplied inputs)

File these as `BACKLOG.md` **[user]** items — they block implementation:

**Supabase project**
- Create the project; note the project ref `<ref>`.
- **Confirm asymmetric JWT signing keys are enabled** (default for projects created after 2025-10-01; older projects: Dashboard → Authentication → JWT Keys → migrate to an asymmetric — RS256/ES256 — signing key). This is what lets `getClaims()` verify locally against the JWKS with **zero network calls**. **Fallback behavior if the project is still on a legacy symmetric (shared-secret) key:** `getClaims()` still works and every trust decision below is still correct — but it verifies by calling the Auth server rather than locally, so the middleware refresh does one network round-trip per protected request instead of none. The design does **not** hard-depend on local verification; it only gets cheaper with asymmetric keys. **Action:** confirm the key type at setup and, if symmetric, migrate before launch so the matcher-scoped middleware stays network-free. (`getUser()` remains the always-correct network check we fall back to for any decision where a fresh server-side check is warranted.)

**Google Cloud Console → APIs & Services → Credentials → OAuth client ID → Web application**
- Authorized JavaScript origins: `https://ignaite.app`, `http://localhost:3000`
- Authorized redirect URI: **`https://<ref>.supabase.co/auth/v1/callback`** ← this is **Supabase's** callback, *not* the app's `/auth/callback`. Conflating them is the #1 "login does nothing" bug.
- OAuth consent screen: External; scopes `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`; **Publish**.

**Supabase → Authentication → Providers → Google:** enable, paste Client ID + Client Secret.

**Supabase → Authentication → URL Configuration:**
- Site URL: `https://ignaite.app`
- Redirect allow-list (Supabase silently drops any `redirectTo` not listed here):
  - `https://ignaite.app/auth/callback`
  - `http://localhost:3000/auth/callback`
  - `https://*-<team>.vercel.app/auth/callback` (preview wildcard)

**Env vars** — follow the existing `process.env.X ?? fallback` pattern (per `lib/seo.ts`), but promote the new secrets to a small validated accessor (`lib/supabase/env.ts`) that throws at boot if a required var is missing. `.env.local` (gitignored — editing `.env*` is a §11 action; mirror this block into CLAUDE.md §14):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx   # client-safe (2026 naming; replaces anon)
SUPABASE_SECRET_KEY=sb_secret_xxxxx                          # server-only — NEVER NEXT_PUBLIC_.
```

Set the same three in Vercel (production + preview). The publishable key is safe in `NEXT_PUBLIC_`; the secret key in Phase 1 is used **only** by the `delete-account` Edge Function (§4h) — no other Phase-1 code touches it — and later by the Phase-2 sync and Phase-3 admin trigger. If you defer self-serve deletion, the secret key can be added later.

> **CSP note:** because all Phase-1 Supabase traffic is server→Supabase (server actions, route handler, middleware, Edge Function), **`next.config.ts` needs no change.** Those calls are not subject to browser CSP. Do *not* touch CSP in Phase 1. (See §7 for the future-browser-client caveat.)

### 4c. SQL migration — profiles + bookmarks + admin lock

One idempotent migration. Order: extensions → profiles → trigger → bookmarks → admins + `is_admin()`. Everything in `public` except the `extensions` schema and SECURITY DEFINER helpers pinned to `search_path = ''`. All user-writable text columns carry **length/format CHECK constraints** so an authenticated user cannot write unbounded rows.

RLS discipline used throughout: wrap every JWT/security-definer call as `(select auth.uid())` / `(select public.is_admin())` so Postgres init-plans it once per statement (not once per row); scope every policy `to authenticated`; index every column a policy references; **one policy per operation**.

```sql
-- ============================================================
-- 0. EXTENSIONS  (never in an API-exposed schema)
-- ============================================================
create schema if not exists extensions;
create extension if not exists moddatetime with schema extensions;  -- updated_at helper
create extension if not exists vector      with schema extensions;  -- pgvector, used Phase 2; safe to enable now

-- ============================================================
-- 1. PROFILES  (1:1 with auth.users)
-- ============================================================
create table public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  handle       text        unique,
  display_name text,
  avatar_url   text,
  bio          text,
  is_public    boolean     not null default false,       -- owner-only until public-profiles ships
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- write-side caps (a CHECK passes when the column is NULL, so these only bound non-null values):
  constraint profiles_handle_format  check (handle is null or handle ~ '^[a-z0-9_]{3,30}$'),
  constraint profiles_name_len       check (display_name is null or char_length(display_name) <= 80),
  constraint profiles_bio_len        check (bio is null or char_length(bio) <= 500),
  constraint profiles_avatar_len     check (avatar_url is null or char_length(avatar_url) <= 2048)
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure extensions.moddatetime (updated_at);

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

create policy "profiles: owner read"   on public.profiles for select to authenticated
  using ( (select auth.uid()) = id );
create policy "profiles: owner insert" on public.profiles for insert to authenticated
  with check ( (select auth.uid()) = id );
create policy "profiles: owner update" on public.profiles for update to authenticated
  using ( (select auth.uid()) = id ) with check ( (select auth.uid()) = id );
-- No DELETE policy: account deletion cascades from auth.users, never a client table API.

-- >>> FUTURE public profiles — flip on when the feature ships:
-- grant select on public.profiles to anon;
-- create policy "profiles: public rows readable" on public.profiles for select
--   to anon, authenticated using ( is_public = true );

-- 1a. Auto-create a profile on signup. SECURITY DEFINER (bypasses RLS), search_path='' (schema-qualify all).
--     The profile insert is wrapped in its OWN exception block: profile creation must NEVER be able to
--     abort account creation. A missing profile is trivially recoverable (recreated lazily on first
--     /account visit); a signup blocked by ANY exception in this trigger — a future NOT NULL column, an
--     unexpected constraint, a type error on malformed Google metadata — would take down ALL Google
--     sign-ups site-wide. on-conflict handles the duplicate-id case; the exception block handles the rest.
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  begin
    insert into public.profiles (id, display_name, avatar_url)
    values (
      new.id,
      left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 80),
      left(coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'), 2048)
    )
    on conflict (id) do nothing;
  exception
    when others then
      null;  -- never block account creation; profile is recreated lazily if this ever fails
  end;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. BOOKMARKS  (apps + recipes; slug is a SOFT-FK in Phase 1)
-- ============================================================
create type public.bookmark_item_type as enum ('app', 'recipe');

create table public.bookmarks (
  id         uuid                       primary key default gen_random_uuid(),
  user_id    uuid                       not null references auth.users(id) on delete cascade,
  item_type  public.bookmark_item_type  not null,
  item_slug  text                       not null,        -- soft-FK: content not in DB yet
  note       text,
  created_at timestamptz                not null default now(),
  unique (user_id, item_type, item_slug),                -- dedup + leads-with-user_id → satisfies RLS lookups
  constraint bookmarks_slug_format check (item_slug ~ '^[a-z0-9-]{1,80}$'),
  constraint bookmarks_note_len    check (note is null or char_length(note) <= 280)
);

-- Reverse lookup ("who bookmarked this slug" / Phase-2 popularity). The UNIQUE index already covers user_id.
create index bookmarks_item_idx on public.bookmarks (item_type, item_slug);

alter table public.bookmarks enable row level security;
grant select, insert, delete on public.bookmarks to authenticated;

create policy "bookmarks: owner read"   on public.bookmarks for select to authenticated
  using ( (select auth.uid()) = user_id );
create policy "bookmarks: owner insert" on public.bookmarks for insert to authenticated
  with check ( (select auth.uid()) = user_id );
create policy "bookmarks: owner delete" on public.bookmarks for delete to authenticated
  using ( (select auth.uid()) = user_id );
-- No UPDATE policy: bookmarks are add/remove only (note edits, if ever, add one later).

-- ============================================================
-- 3. ADMIN LOCK  (locked table keyed on immutable UID)
-- ============================================================
create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;    -- RLS ON + ZERO policies => only service_role/postgres
revoke all on public.admins from anon, authenticated;   -- explicit: end users have no table privilege

create function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

-- SEED ONCE, from the SQL editor (service role), after ganesh575@gmail.com's first sign-in:
--   insert into public.admins (user_id, note)
--   select id, 'founder / sole admin' from auth.users where email = 'ganesh575@gmail.com';
```

**Why the locked-table admin lock (not a JWT email string):**
- `auth.jwt() ->> 'email'` is a real claim but **email is mutable** (a user can change it via a confirmed flow; if email confirmations were ever disabled, someone could register the pinned address). Email is a natural key, not a stable identity.
- `raw_user_meta_data` / `user_metadata` is **client-writable** via `supabase.auth.updateUser()` — it must **never** gate authorization.
- The `admins` table is keyed on the **immutable `auth.users.id` UUID** issued by Supabase (can't be spoofed or changed by the user). RLS-on-zero-policies means only `service_role`/`postgres` can read or write it — defense in depth.
- `is_admin()` is `stable` (RLS can init-plan it) and `security definer` (can read the locked table).
- If real RBAC ever grows (Phase-4 moderators), promote to a `user_roles` table + a Custom Access Token Hook that stamps the role into **`app_metadata`** (server-only, safe) so RLS reads it straight from the JWT with no per-row lookup. The email string check is acceptable only as a *secondary belt*, never the sole gate.

### 4d. Auth wiring for Next 15 — file tree + code shape + bundle strategy

**Architecture decision: server-only clients + client-hydrated state (§2a).** Sign-in, sign-out, session reads, profile writes, and bookmark writes all run through **server actions + `createServerClient`**. There is **no global auth provider that imports `supabase-js`**, and **no marketing route reads `cookies()` in render**. Auth UI are tiny client islands that *call server actions* — they never import `supabase-js`. To further consolidate the middleware gate (§review), the three authed surfaces share the single `/account/*` URL prefix.

```
middleware.ts                          # NEW root middleware → updateSession (session refresh)
lib/supabase/
  env.ts                               # validated accessor for the 3 Supabase env vars (throws at boot if missing)
  client.ts                            # createBrowserClient — for FUTURE reactive islands; imported NOWHERE on / or /apps/*
  server.ts                            # createServerClient — async cookies(); server comps + actions
  middleware.ts                        # updateSession(request) — getClaims refresh + cookie sync + gate
lib/auth/
  actions.ts                           # 'use server': signInWithGoogle, signOut, toggleBookmark,
                                        #   getSessionSummary, getMyBookmarkedSlugs
  bookmarks.ts                         # server reads used by the /account/bookmarks page (full rows)
app/
  auth/
    callback/route.ts                  # PKCE code → session (exchangeCodeForSession) + x-forwarded-host handling
    auth-code-error/page.tsx           # error landing
  (account)/                           # NEW authed route group — OUTSIDE (marketing): no Lenis, no directory console
    layout.tsx                         # own shell; robots noindex; inherits root providers only
    account/page.tsx                   # profile view/edit (server comp: getClaims → profiles row)
    account/actions.ts                 # 'use server': updateProfile, requestAccountDeletion
    account/settings/page.tsx          # /account/settings
    account/bookmarks/page.tsx         # /account/bookmarks — resolves slugs against .velite content
  (marketing)/
    sign-in/page.tsx                   # <form action={signInWithGoogle}> — noindex — no browser client
components/auth/
  account-menu.tsx                     # client island: self-hydrates via getSessionSummary(); avatar or Sign-in pill
  sign-out-button.tsx                  # client island → server action
  bookmark-provider.tsx                # client island: fetches getMyBookmarkedSlugs() once, shares a Set via context
  bookmark-toggle.tsx                  # client island: reads context + useOptimistic + <form action={toggleBookmark}>
```

**`lib/supabase/server.ts`** (Next 15 async `cookies()`; the `setAll` try/catch is *required* — Server Components can't write cookies, middleware persists them). **Never imported by a marketing Server Component** (§2a) — only by server actions, route handlers, and `(account)` pages:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./env";

export async function createClient() {
  const cookieStore = await cookies(); // async in Next 15
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch { /* Server Component — read-only cookies; middleware refreshes them. Intentional no-op. */ }
      },
    },
  });
}
```

**`lib/supabase/middleware.ts`** — refresh + **gate all `/account/*` prefixes** (single check now that settings/bookmarks live under `/account`). `getClaims()` = local JWKS verify when asymmetric keys are on (else a network verify — still correct, §4b). **Never** run code between `createServerClient` and `getClaims`, and **always** return `supabaseResponse` unmodified — either violation causes intermittent random logouts:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./env";

const PROTECTED = ["/account"]; // /account, /account/settings, /account/bookmarks all covered by one prefix

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims(); // do NOT insert code above this line
  const claims = data?.claims;

  const path = request.nextUrl.pathname;
  if (!claims && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return supabaseResponse; // MUST be returned unmodified
}
```

Every `(account)` page **also** keeps its own `getClaims()` redirect as defense-in-depth (§4e) — middleware is the gate, the page check is the belt.

**`middleware.ts`** (root) — scope the matcher to auth/account routes so the static directory isn't taxed per request:

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Cheapest for an SSG site: only the authed + auth surfaces run session refresh.
  // All three authed pages share the /account prefix, so one matcher entry covers them.
  matcher: ["/account/:path*", "/auth/:path*", "/sign-in"],
};
```

**`app/auth/callback/route.ts`** (PKCE exchange + Vercel preview host handling):

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/account";
  if (!next.startsWith("/")) next = "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // Vercel preview/prod LB
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) return NextResponse.redirect(`${origin}${next}`);
      if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

**`lib/auth/actions.ts`** (server actions — no browser client anywhere). The two **read** actions below are what the client islands hydrate from (§2a); the **write** actions are rate-limited via the existing `lib/rate-limit.ts`:

```ts
"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

// ── reads: power the client-hydrated nav + bookmark state (§2a). Anonymous → cheap empty result. ──

export async function getSessionSummary() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;
  const { data: profile } = await supabase
    .from("profiles").select("display_name, avatar_url, handle").eq("id", data.claims.sub).single();
  return { signedIn: true, ...profile };
}

export async function getMyBookmarkedSlugs(): Promise<{ app: string[]; recipe: string[] }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { app: [], recipe: [] };
  const { data: rows } = await supabase.from("bookmarks").select("item_type, item_slug");
  const out = { app: [] as string[], recipe: [] as string[] };
  for (const r of rows ?? []) out[r.item_type as "app" | "recipe"].push(r.item_slug);
  return out;
}

// ── writes ──

export async function signInWithGoogle(next = "/account") {
  const supabase = await createClient();
  const origin = (await headers()).get("origin")!;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect("/sign-in?error=oauth");
  if (data.url) redirect(data.url); // sets code_verifier cookie, then 302 to Google. Never wrap in try/catch (NEXT_REDIRECT).
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Idempotent, non-toggling, error-surfacing. The caller passes the DESIRED end state,
 * so two concurrent "add" calls both no-op-converge instead of racing a read-then-write
 * into a UNIQUE-violation crash. Returns {ok} so the island's useOptimistic can roll back.
 */
export async function setBookmark(
  kind: "app" | "recipe",
  slug: string,
  desired: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { ok: false };

  if (!rateLimit(`bm:${userId}`, { limit: 30, windowMs: 60_000 }).success) return { ok: false };

  const row = { user_id: userId, item_type: kind, item_slug: slug };
  const { error } = desired
    ? await supabase.from("bookmarks").upsert(row, { onConflict: "user_id,item_type,item_slug", ignoreDuplicates: true })
    : await supabase.from("bookmarks").delete().match(row);

  return { ok: !error };
}
```

> `setBookmark` replaces the earlier read-then-toggle `toggleBookmark`: `upsert … ignoreDuplicates` (server-side `insert … on conflict do nothing`) for add and a plain `delete … match` for remove are each a **single idempotent statement**, so a rapid double-click can't hit the UNIQUE constraint or leave a half-written state, and both surface their error. There is **no `revalidatePath('/apps/${slug}')`** — per-user bookmark state was never baked into the static page, so revalidating a static route for one user's toggle would be meaningless (and would fight SSG). The island updates itself optimistically and via the shared context (§2a).

**Reading identity in an `(account)` server component** — use `getClaims()` (or `getUser()` for a network check), **never `getSession()`** for trust decisions. This read is *only* in the dynamic `(account)` subtree, never in a marketing route:

```tsx
// app/(account)/account/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in"); // belt; middleware is the primary gate
  const userId = data.claims.sub;

  const { data: profile } = await supabase
    .from("profiles").select("display_name, avatar_url, bio, handle").eq("id", userId).single();
  // ...render
}
```

**Bundle-budget strategy (non-negotiable):**
- `supabase-js` lands in a route chunk **only if** that chunk imports a *browser* client. Phase 1 imports `createBrowserClient` **nowhere** on `/` or `/apps/*`; the auth islands import only server actions.
- **No per-user state is server-resolved on a static route.** Nav auth state hydrates via `getSessionSummary()`; bookmark state hydrates via one `getMyBookmarkedSlugs()` call behind `<BookmarkProvider>` (§2a). Neither touches `cookies()` in the page render path, so `/`, `/about`, and `/apps/*` stay statically prerendered.
- The account subtree lives in its own `app/(account)/` route group → its own chunk, dynamic (it *does* read `cookies()`/`getClaims()` in render, which is correct there), middleware-scoped, and `noindex`.
- The desktop nav avatar/sign-in affordance mirrors the existing pathname-gated `dynamic()` island used for `directory-console` in `site-nav.tsx` — the island is plain React calling server actions, so nothing Supabase reaches the shared chunk.

### 4e. User UI/UX

All surfaces use the real token system so they look native: `.glass` cards (`rounded-2xl bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/[0.08]`), `.section-y`/`.section-y-lg` rhythm, `.container-site` (max-w-7xl) column, `.text-display`/`.text-eyebrow` for headings/labels, the ink scale (`text-ink → ink-soft → ink-dim`), and `accent`/`accent-hot` for interactive + focus. Focus rings are already global (`2px accent-hot`). Every motion-bearing element gets a `useReducedMotion()` fallback.

**Sign-in entry point — two exact slots (recon-confirmed):**
1. **Desktop nav** — `components/nav/site-nav.tsx`, inside the `hidden items-center gap-2 md:flex` cluster (after the `brand.nav` `<ul>`, alongside the conditional Search pill). Render `<AccountMenu>` **statically** — the nav does **not** read the session and receives **no session prop from the layout** (that would force the marketing group dynamic; §2a). `<AccountMenu>` self-hydrates on mount via `getSessionSummary()`: it shows a fixed-width skeleton, then swaps to the avatar dropdown (signed in) or a `Sign in` rounded-full pill (signed out) — a stable width avoids CLS.
2. **Mobile + ⌘K console** — `components/command/command-palette-body.tsx`: add an **Account / Bookmarks** row to the `PAGES` array and `MenuView`. The console is opened via the existing `blokz:open-command` CustomEvent. **Do not** add account routes to `brand.nav` in `data/brand.ts` — that array feeds SEO/JSON-LD nav; account links belong only in the nav component + `PAGES`.

**Avatar / account menu** (`account-menu.tsx`, client island): avatar (from the hydrated `avatar_url`, `next/image` with explicit width/height) → dropdown with **Account**, **Bookmarks**, **Settings**, **Sign out** (the last is a `<form action={signOut}>`). Uses the existing shadcn `dialog`/`dropdown` primitives already in `components/ui/`.

**`/account` area** (`app/(account)/`, own route group — opts out of Lenis smooth-scroll and the directory console, inherits root providers, `noindex`):
- **`/account`** — profile card (display name, handle, avatar, bio) with an inline edit form wired to `updateProfile` (`account/actions.ts` — validates against the same length/format bounds as the CHECK constraints, rate-limited via `lib/rate-limit.ts`, `revalidatePath('/account')`).
- **`/account/settings`** — account settings (email display from claims, sign-out, and a **Delete account** affordance — a real self-serve path, §4h).
- **`/account/bookmarks`** — "My bookmarks": server component reads the user's rows via `lib/auth/bookmarks.ts::listBookmarks`, then **resolves each slug against static Velite content** (`getApp(slug)` / `getRecipe(slug)` from `lib/apps.ts` / `lib/recipes.ts`). Renders the existing `tool-card` for apps and a recipe card for recipes.

**Bookmark interaction** (`bookmark-provider.tsx` + `bookmark-toggle.tsx`, client islands — §2a):
```tsx
// bookmark-provider.tsx — mounted once in (marketing)/layout.tsx, wraps server-rendered children.
// On mount: const sets = await getMyBookmarkedSlugs();  → exposes has(kind, slug) + a signedIn flag via context.
// Imports NO supabase-js; one round-trip hydrates the whole page's toggles.

// bookmark-toggle.tsx
"use client";
import { useOptimistic, useTransition } from "react";
import { setBookmark } from "@/lib/auth/actions";
// props: kind, slug. Reads initial state + signedIn from BookmarkProvider context (indeterminate until hydrated).
// useOptimistic flips the icon instantly; <form action> calls setBookmark(kind, slug, nextState);
// on { ok:false } it rolls the optimistic state back. If !signedIn, the button routes to
// /sign-in?next=<current>. Bookmark/Bookmarked states are label-paired (not color-only) for a11y;
// reduced-motion disables the fill animation.
```

**Stale-slug resilience (critical):** bookmarks store slugs, content is git-mutable. `next.config.ts` already 301-redirects duplicate app slugs (e.g. `/apps/bland → /apps/bland-ai`) and apps get archived by `/audit-directory`. The resolver **must degrade gracefully**: a bookmarked slug that no longer resolves via `getApp()` renders a **"no longer listed" tombstone** (with a remove button), never a crash, and the bookmark row is **never auto-deleted** on a transient missing slug (that's data loss on a rename). Phase-2 sync optionally reconciles redirected slugs.

### 4f. File-by-file change list

**New files:**
| Path | Purpose |
|---|---|
| `middleware.ts` | Root session refresh (matcher-scoped) + `/account/*` gate. |
| `lib/supabase/env.ts` | Validated env accessor (throws on missing required var). |
| `lib/supabase/client.ts` | Browser client — future islands only; imported nowhere on `/` or `/apps/*`. |
| `lib/supabase/server.ts` | Async server client (server actions + `(account)` pages only — never a marketing render). |
| `lib/supabase/middleware.ts` | `updateSession` (getClaims + cookie sync + gate). |
| `lib/auth/actions.ts` | `signInWithGoogle`, `signOut`, `setBookmark`, `getSessionSummary`, `getMyBookmarkedSlugs`. |
| `lib/auth/bookmarks.ts` | Server reads for the `/account/bookmarks` page (full rows). |
| `app/auth/callback/route.ts` | PKCE code exchange + preview-host handling. |
| `app/auth/auth-code-error/page.tsx` | OAuth error landing. |
| `app/(account)/layout.tsx` | Authed shell (no Lenis/console; `robots: { index:false }`). |
| `app/(account)/account/page.tsx` | Profile view/edit. |
| `app/(account)/account/actions.ts` | `updateProfile`, `requestAccountDeletion`. |
| `app/(account)/account/settings/page.tsx` | Account settings (`/account/settings`). |
| `app/(account)/account/bookmarks/page.tsx` | "My bookmarks" (`/account/bookmarks`; slug → Velite resolve). |
| `app/(marketing)/sign-in/page.tsx` | Sign-in page (`<form action={signInWithGoogle}>`; `noindex`). |
| `components/auth/account-menu.tsx` | Avatar dropdown (desktop nav) — self-hydrates via `getSessionSummary()`. |
| `components/auth/sign-out-button.tsx` | Sign-out island. |
| `components/auth/bookmark-provider.tsx` | Client context; one `getMyBookmarkedSlugs()` hydrate. |
| `components/auth/bookmark-toggle.tsx` | Optimistic bookmark island (reads provider context). |
| `supabase/migrations/0001_user_layer.sql` | The §4c migration. |
| `supabase/functions/delete-account/index.ts` | Self-serve account deletion Edge Function (§4h). |

**Modified files:**
| Path | Change |
|---|---|
| `components/nav/site-nav.tsx` | Add `<AccountMenu>` in the `md:flex` cluster. **Renders statically; reads no session and takes no session prop** (§2a). |
| `components/command/command-palette-body.tsx` | Add Account/Bookmarks row to `PAGES` + `MenuView`. |
| `app/(marketing)/layout.tsx` | Wrap children in `<BookmarkProvider>` (client island; imports no `supabase-js`). **Does NOT read `cookies()`/session** — the group stays statically prerendered. |
| `components/tools/tool-card.tsx` | Add `<BookmarkToggle kind="app" slug={…}>` slot (no server-resolved `initial` prop — state comes from the provider context). |
| `components/tools/app-detail.tsx` | Add `<BookmarkToggle>` in the detail header (same, context-driven). |
| `package.json` | Add the two deps (§11 sign-off). **No script change needed** — Velite gates stay as-is. |
| `.env.local` + Vercel env | The three Supabase vars (§4b; §11). |
| `CLAUDE.md` §14 + §2 | Document the new env vars + the `@supabase/*` deps. |
| `BACKLOG.md` | File the [user] setup items + the future-CSP [verify] item + JWT-key-type [verify]. |

**Explicitly NOT modified in Phase 1:** `next.config.ts` (CSP untouched — server-only), `data/brand.ts` `nav` (account routes stay out of SEO nav), any `data/apps/*` or `data/recipes/*`, `velite.config.ts`. Critically, **the `(marketing)` layout and every marketing page are left free of `cookies()`** so SSG and the perf budgets hold.

### 4g. Accessibility + performance deltas (CLAUDE.md §9/§10)

**Accessibility:**
- Sign-in/out/bookmark buttons are real `<button>`/`<form>` submits with visible `accent-hot` focus rings (global) and **label-paired** state (Bookmark ↔ Bookmarked — never icon/color alone).
- Account forms: real `<label>`s, `aria-describedby` for validation, sensible `inputmode`.
- The nav account island reserves a fixed-width slot so the mount-time hydration swap causes no layout shift (CLS budget < 0.05).
- Avatar dropdown (shadcn) is keyboard-navigable (Esc closes, arrow keys, focus trap) and screen-reader labeled.
- Skip link remains the first focusable element on the new `(account)` routes.
- Bookmark toggle's optimistic fill respects `[data-motion="reduce"]`.
- Semantic landmarks: `(account)` pages keep one `<header>/<nav>/<main>/<footer>` and a clean `h1→h2` descent.

**Performance:**
- `/`, `/about`, `/apps/*` stay **statically prerendered** — no `cookies()` in their render path (§2a) — and their client chunks are **unchanged**. Verify with `pnpm analyze` that `@supabase/*` appears in **no** chunk except `(account)` routes and the `/auth/*` handler, and that adding `<BookmarkProvider>`/`<AccountMenu>` (plain React + server-action calls) does not pull `supabase-js` into the `/` chunk. `three` remains `/about`-only.
- New `(account)` routes are dynamic (cookie reads) — exempt from the SSG budgets, but keep each ≤140 KB gz (the islands are tiny; server actions carry the weight).
- `middleware.ts` uses `getClaims()` (network-free with asymmetric keys; a single verify call otherwise) and a route-scoped matcher, so static routes pay ~0 middleware cost.
- Verify via `/verify` skill / manual browser pass (Chrome + Firefox, 360/768/1440/1920) — there's no test runner yet (Playwright is a BACKLOG item). Confirm signed-out and signed-in states both render the directory statically and that the bookmark toggles hydrate correctly.

### 4h. Account deletion (GDPR self-serve — shipped in Phase 1, not deferred)

Self-serve deletion is a real Phase-1 path, not a "contact support" punt. Deleting the `auth.users` row is a privileged operation (the publishable key can't delete another user), so it runs in a minimal Edge Function using the secret key:

- **`requestAccountDeletion` server action** (`account/actions.ts`): verifies `getClaims().sub`, requires an explicit typed confirmation, rate-limited via `lib/rate-limit.ts`, then invokes the `delete-account` Edge Function with the caller's JWT.
- **`supabase/functions/delete-account/index.ts`**: re-verifies the caller's JWT server-side, derives the UID from the verified token (never from the request body), and calls `auth.admin.deleteUser(uid)` with `SUPABASE_SECRET_KEY`. Because `profiles` and `bookmarks` both `references auth.users(id) on delete cascade`, the profile row and all bookmarks are removed atomically. The action then signs the user out and redirects to `/`.
- This is the **only** Phase-1 consumer of `SUPABASE_SECRET_KEY` (§4b). If deletion is descoped for the first cut, file it as `BACKLOG.md` **[user]** with the concrete Edge-Function spec above rather than a vague support-flow note — the interim commitment is the Edge Function, already designed.

---

## 5. Roadmap — Phases 2–5

### Phase 2 — Content projection pipeline + live counts + pgvector

**Goal:** derived read model in Supabase; live `apps↔recipes` counts; semantic search. Sequence: content tables + `project_content` RPC + sync workflow + bookmark FK backfill **first** (unlocks joins + counts), then pgvector additively on the same sync.

**Where the sync runs:** a dedicated `.github/workflows/sync-supabase.yml` on **`push:[main]` only** — fires exactly when content becomes canonical, has the full git tree for rename/delete resolution, re-runs `velite build --strict` (projecting the same artifact CI blessed), and keeps `SUPABASE_SERVICE_ROLE_KEY` out of any `pull_request`/fork context. **Vercel build-step sync is rejected** (fires on preview deploys → leaks unmerged content to prod; breaks on caching/retries/rollbacks). Edge Function is rejected as orchestrator (can't clone/run Velite) but kept as the Phase-5 callback receiver.

```yaml
name: Sync Supabase
on: { push: { branches: [main] } }
permissions: { contents: read }
concurrency: { group: sync-supabase, cancel-in-progress: false }
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm velite build --strict
      - run: node scripts/sync-supabase.ts
        env:
          SUPABASE_URL:              ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          SOURCE_COMMIT:             ${{ github.sha }}
```

**Key tables:** `apps` (UUID PK, `slug UNIQUE`, `data jsonb`, `status text`, `content_hash`, `embedding vector(N)`, `deleted_at`), `recipes` (same shape), `recipe_steps` (`app_id` FK on `id`, rename-stable), `app_recipe_counts` view (§3).

**`project_content` RPC — exact ordering, with status normalization (settled):**

One `security definer` RPC `project_content(p_apps, p_recipes, p_commit)` runs the whole projection in **one transaction**, in this order:
1. **Normalize status on write.** For every incoming app/recipe, `status := coalesce(nullif(status,''), 'active')` — the Velite artifact represents an active app as *absent* status ("Absence = active" per `lib/apps-schema.ts`), so the RPC materializes that absence as the literal `'active'` string. This is the single fix that keeps `app_recipe_counts` (§3) and `match_apps` (below) from silently dropping every active app. (Recipes already carry the archived-app → `status:'stale'` demotion from `.velite`; the RPC preserves it verbatim and does not re-derive it.)
2. **Upsert** all incoming rows keyed on `slug`, skipping rows whose `content_hash` is unchanged.
3. **Rename-resolve** using the shared rename hint (`data/redirects.json` / an additive `aliases` field) **before** any delete, so a rename is `UPDATE apps SET slug=…` (FKs on `id` untouched), never delete+add.
4. **Soft-delete** (`deleted_at := now()`) any live slug absent from the incoming set — after rename resolution, so a renamed app is not mistaken for a deleted one.
5. **Rebuild `recipe_steps`**, resolving each `app_id` by joining `apps.slug` in the same txn (the read model never shows a step pointing at a half-deleted app).

A projection regression test asserts that an app with **absent/NULL** incoming status lands as `status='active'`, appears in `app_recipe_counts`, and is returned by `match_apps` — the null-status miscount can never regress silently.

**Other design decisions (settled):**
- **Full declarative sync** (upsert all + soft-delete absent slugs), not incremental diff — idempotent + self-healing; a missed run is corrected by the next.
- **`content_hash`** (sha256 of *canonical* serialization — stable key order, or cosmetic reordering churns every `updated_at` and recomputes embeddings) makes unchanged rows no-ops.
- **Surrogate UUID PK + FKs on `id`** so a slug rename is one `UPDATE`.
- **Slug renames need an explicit hint** (a rename is otherwise indistinguishable from delete+add and orphans FKs). Author a shared `data/redirects.json` (or an additive `aliases: []` app field) read by **both** `next.config.ts` redirects and the sync's rename resolver — resolved **before** the soft-delete pass.
- **Circuit breaker:** abort if incoming app count < 80% of live rows (a broken Velite build must not soft-delete the catalog).
- **Soft-delete only** (`deleted_at`) — never hard-delete (would dangle bookmarks; `on delete restrict` on `recipe_steps.app_id` makes an accidental hard delete fail loudly). Read policies filter `deleted_at is null`.
- **Project from `.velite/*.json`** (carries the archived-app → recipe `status:'stale'` demotion), never raw `data/*.json`.
- **Bookmark upgrade is non-breaking:** `ADD app_id/recipe_id` FK columns, backfill by joining `item_slug = slug`, keep `item_slug` as a denormalized fallback for archived/removed content. Because FKs are on `id`, a later rename needs no bookmark change; a trigger refreshes `item_slug`.

**pgvector:** `create extension vector with schema extensions`; `apps.embedding extensions.vector(N)` (N = model dim); HNSW `using hnsw (embedding vector_cosine_ops)` (read-heavy low-latency); cosine `<=>`; served via a `match_apps(query_embedding, threshold, count)` RPC filtering `coalesce(status,'active') = 'active' and deleted_at is null` (NULL-safe — same normalization contract as §3). Embed only rows whose `content_hash` changed (cheap).

**Open questions:** embedding model + dimension (OpenAI text-embedding-3-small @1536 for quality vs Supabase `gte-small` @384 free/in-edge); who computes query embeddings (edge fn vs server action) + rate limit; hybrid tsvector+vector (RRF) yes/no; `data/redirects.json` vs `aliases` field; hard-purge policy for soft-deleted rows. **The workflow add is a §11 sign-off.**

### Phase 3 — Admin console + routine triggers (locked to ganesh575@gmail.com)

**Goal:** admin-only surface to fire Claude Code routines and view history. **Enforce in three places:** (1) Postgres RLS via `is_admin()` (source of truth, keyed on immutable UID — §4c); (2) `middleware.ts` gating an `/admin` route group server-side (add `/admin` to `PROTECTED`, plus an `is_admin()` check in the page); (3) the routine-trigger endpoint validating a **server-only** token from Supabase Vault. The `/admin` group is `noindex`.

**Key tables:** `admins` (already in Phase 1), `routine_runs (id, routine, fired_by, params jsonb, status, run_url, pr_url, created_at)` with `create policy admin_runs ... using (is_admin())`.

Fire from an admin-only server action → POST GitHub `workflow_dispatch`/`repository_dispatch` (fine-grained PAT in Vault) **or** the Claude Code Remote fire endpoint. Token **never** client-side; every fire logs a `routine_runs` row; routines report status back via a signed callback.

**Open questions:** trigger surface (GitHub dispatch vs CCR fire endpoint); how runs report status back.

### Phase 4 — Comments + contributions (community + moderation)

**Goal:** user comments on apps/recipes and community contributions, with moderation.

**Key tables:** `comments (id, user_id, target_type, target_slug, parent_id, body, status: visible|pending|hidden|flagged)` and `contributions (id, user_id, kind, target_slug, payload jsonb, status: pending|approved|rejected|merged, reviewer_note)` — both with length CHECK constraints mirroring §4c. RLS: read visible-or-own-or-admin; insert-own; owner update; admin moderate (`is_admin()`). Contributions read own-or-admin; admin review. Comment surfaces that render on the static `/apps/*` routes must hydrate client-side (same rule as §2a) so those pages stay prerendered.

**Decisions:** default **post-moderation + an AI moderation pass**; contributions go **PR-first** (open a human-review PR → CI velite → merge → sync back) to keep git the source of truth.

**Open questions:** pre- vs post-moderation confirmation; threading depth; spam/rate strategy; content licensing/attribution.

### Phase 5 — Paid custom recipe generation

**Goal:** user pays → async Claude routine generates a custom recipe → private (DB-only) or published via human-review PR → git → community.

**Monetization model (recommended): Stripe-purchased credits**, not per-recipe card charges — refund-on-decline is an atomic reversing ledger entry (no Stripe refund/chargeback exposure), payment decouples from the long async job, spend is capped.

**Key tables:** `credit_ledger` (append-only; balance = `sum(delta)`; `stripe_event_id UNIQUE` for idempotency) + `credit_balances` view; `recipe_jobs (status: queued|running|verifying|completed|declined|failed, credits_held, result_recipe jsonb [RLS owner-only], decision: private|published, pr_url, trigger_run_id, callback_token_hash)`.

**Flow:** buy credits → fulfill **only on the signature-verified `checkout.session.completed` webhook** (never the client redirect), deduped on `event.id`. Submit job → pre-gate params (substance floor + moderation) **before** debiting → HOLD ledger entry → POST routine trigger (Vault token, server-only) with `{job_id, sanitized_params, callback_url, one_time_token}`. Routine runs (FK-constrains steps to **listed** apps, so users can't inject fake apps) → callback edge fn verifies token + ownership, **re-checks the same substance floor as `/author-recipes`** (≥2 steps, ≥1 independent web-verified reference, real `longSummary`, graph integrity) → PASS: settle + notify (Resend + Realtime); FAIL: decline + reverse the hold. Publish = open a **human-review PR (no auto-merge)** → git → sync.

**Risks:** user params are **untrusted** (prompt-injection) — moderate before charging and before publish, treat as data not instructions, enforce per-user caps + a job-timeout that auto-reverses stuck holds + a global kill-switch.

**Open questions:** credits vs one-off pricing; price-per-recipe vs worst-case token cost + margin; job SLA/timeout; per-user caps; hard-purge/retention for declined jobs.

---

## 6. Open questions / user-supplied inputs

**Blocking Phase 1 (file as BACKLOG [user]):**
1. **Dependency sign-off** — OK to add `@supabase/supabase-js` + `@supabase/ssr` (~59 KB gz, server-side only)? (§11)
2. **Supabase project** — created; hand back `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. **Confirm the JWT signing key type** — asymmetric (network-free `getClaims`) vs legacy symmetric (works, but middleware verifies over the network); migrate to asymmetric before launch (§4b).
3. **Google OAuth** — Web client created; Client ID + Secret pasted into Supabase; origins, Supabase callback URI, and the redirect allow-list (incl. Vercel preview wildcard) all set (§4b).
4. **Env vars in `.env.local` + Vercel** — added (§11 confirms editing `.env*`). The secret key is needed in Phase 1 only for the `delete-account` Edge Function (§4h).
5. After first sign-in, run the one-line `admins` seed for `ganesh575@gmail.com`.

**Blocking later phases:**
6. **Phase 2 workflow** — sign-off to add `.github/workflows/sync-supabase.yml` + GitHub secrets (§11); `data/redirects.json` vs `aliases` field for renames; embedding model + dimension.
7. **Phase 2 CSP** — only if a browser Supabase client is ever introduced: extend `next.config.ts` `connect-src` (§7) — a §11 change.
8. **Phase 3** — routine trigger surface (GitHub dispatch vs Claude Code Remote fire).
9. **Phase 4** — moderation posture; contribution licensing.
10. **Phase 5** — Stripe account + credits-vs-one-off pricing + price points.

---

## 7. Security notes

**Static-integrity / SSG invariant (also a security property — no accidental dynamic-render or auth-state leak):**
- **No marketing route reads `cookies()` in render** (§2a). The shared `(marketing)/layout.tsx`, `/`, `/apps/[slug]`, `/recipes/[slug]`, and `/sign-in` never call `createServerClient` in their render path — auth and bookmark state hydrate client-side via server actions (`getSessionSummary`, `getMyBookmarkedSlugs`). This keeps the pages statically prerendered (perf budget) **and** guarantees a static HTML response never embeds one user's session/bookmark state to be cached and served to another.
- `robots: { index:false }` (or `X-Robots-Tag: noindex` via the `(account)` layout / middleware) on the entire `(account)` group, `/sign-in`, and (Phase 3) `/admin` — authenticated shells and the sign-in page must not be indexed. `app/robots.ts` continues to allow the public directory.

**RLS correctness:**
- Every JWT/security-definer call in a policy is wrapped `(select auth.uid())` / `(select public.is_admin())` — the unwrapped form re-evaluates per row and tanks performance on any scan/sort/limit.
- One policy per operation, all scoped `to authenticated`; every policy-referenced column is indexed (the `bookmarks` UNIQUE leads with `user_id`; `profiles`/`bookmarks` FKs on `auth.users.id`).
- `profiles` has **no DELETE policy** and `bookmarks` no UPDATE policy — least privilege; deletion cascades from `auth.users` (§4h).
- **Write-side caps:** every user-writable text column (`profiles.handle/display_name/bio/avatar_url`, `bookmarks.item_slug/note`) carries a length/format CHECK; the `updateProfile` and `setBookmark` server actions are rate-limited via `lib/rate-limit.ts` (in-memory per-instance — a soft guard; upgrade path to Upstash noted in `BACKLOG.md` for a hard cross-instance limit). Together they bound the new authenticated unbounded-write surface.
- SECURITY DEFINER functions (`handle_new_user`, `is_admin`) set `search_path = ''` and schema-qualify everything, and live in `public` (not an API-exposed custom schema) — otherwise they're a privilege-escalation surface.
- `handle_new_user` **can never block sign-ups**: the profile insert is both `on conflict do nothing` (duplicate-id idempotent) **and** wrapped in `begin … exception when others then null; end;` so *any* other error — a future NOT NULL column, an unexpected constraint, malformed Google metadata — is swallowed rather than aborting the `auth.users` insert transaction (§4c). A missing profile is recreated lazily; a blocked signup is not recoverable. Test the Google path specifically (metadata keys `full_name`/`name`, `avatar_url`/`picture`).

**Admin lock:**
- Keyed on the **immutable Google UID** in a `public.admins` table with **RLS on + zero policies** (only `service_role`/`postgres` touch it) — *not* a JWT email string (email is mutable) and *never* `user_metadata` (client-writable). Enforced in RLS **and** middleware **and** the routine-trigger token — belt and suspenders.
- The `admins` RLS-with-no-policies is intentional; don't "fix" it by adding a policy.

**Bookmark write concurrency:**
- `setBookmark` is a single idempotent statement per direction (`upsert … ignoreDuplicates` / `delete … match`) driven by the desired end state — no read-then-write race, so a rapid double-add can't hit the UNIQUE constraint and crash, and errors are surfaced (`{ ok:false }`) so the optimistic UI rolls back instead of showing a false success (§4d).

**New attack surface vs. today's static site** (today: an SSG site + one contact server action):
- **First per-request infra** (`middleware.ts`) — kept cheap (`getClaims` verify) and matcher-scoped to `/account/*`, `/auth/*`, `/sign-in`; the static directory pays ~0 middleware cost.
- **First auth surface** — server-only clients; `getClaims`/`getUser` for trust decisions, **never `getSession()`**; `redirect(data.url)` never wrapped in a try/catch that swallows `NEXT_REDIRECT`.
- **Secrets** — `SUPABASE_SECRET_KEY` is server-only (Phase-1 use: the `delete-account` Edge Function; later: sync + admin), never `NEXT_PUBLIC_`, never in the client bundle, never in a `pull_request`/fork CI context (Phase 2). Client uses only the publishable key.
- **CSP (Phase 1: unchanged).** All Phase-1 Supabase traffic is server→Supabase (actions, route handler, middleware, Edge Function), not subject to browser CSP, so `connect-src 'self'` stays. **If a browser Supabase client is ever added**, `connect-src` must gain `https://<ref>.supabase.co` (+ `wss://<ref>.supabase.co` for realtime) or auth/data calls fail **silently** — file this as a BACKLOG [verify] item; editing `next.config.ts` is a §11 change.
- **Stale bookmark slugs** (Phase 1) — resolved on the frontend with a graceful tombstone; rows never auto-deleted on a transient missing slug (data-loss guard).
- **Account deletion** (Phase 1) — self-serve via the `delete-account` Edge Function verifying the caller's JWT and deriving the UID from the verified token (never the request body); cascades `profiles` + `bookmarks` (§4h).
- **Phase 5 untrusted params** — moderation before charge and before publish; steps FK-constrained to listed apps; per-user caps + timeout + kill-switch.
- **Stripe (Phase 5)** — fulfill only on signature-verified webhooks, deduped on `event.id`; credit-hold-then-reverse avoids chargeback exposure but needs a timeout to release stuck holds.