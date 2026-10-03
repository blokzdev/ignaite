-- ============================================================
-- Phase 2a content projection: git → Supabase read model.
-- Git (data/apps/*.json + data/recipes/*.json → Velite → .velite/) stays the
-- SOURCE OF TRUTH. These tables are a derived, self-healing mirror written
-- ONLY by service_role through the project_content() RPC — one atomic
-- transaction per sync, driven by scripts/sync-supabase.ts from
-- .github/workflows/sync-supabase.yml on push to main. One-directional:
-- nothing is ever written back to git, and no marketing render path reads
-- these tables (the static directory stays Velite-built at build time).
-- Numbered 0003: the remote project already counts 0001_user_layer +
-- 0002_revoke_definer_execute (folded into the canonical 0001 file).
-- ============================================================

-- 0. EXTENSIONS (never in an API-exposed schema)
-- vector was already enabled in `extensions` by 0001; repeated for idempotence.
create extension if not exists vector with schema extensions;

-- ============================================================
-- 1. CONTENT TABLES (projection targets)
-- ============================================================
-- Surrogate uuid PK = the rename-stable identity: bookmarks and recipe_steps
-- FK the id, never the slug, so a slug rename carries relationships intact.
create table public.apps (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  data          jsonb       not null,               -- the full .velite record, verbatim
  status        text        not null default 'active',
  content_hash  text        not null,               -- sha256 of the script-side CANONICAL serialization; compared hash-to-hash ONLY (jsonb re-orders keys — never re-derive from `data`)
  embedding     extensions.vector(384),             -- Phase 2b semantic search (Supabase gte-small, 384-dim); stays NULL until then
  source_commit text,                               -- commit that last CHANGED this row
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,                        -- soft delete: slug left git; RLS hides non-null
  -- write-side sanity (service_role-written, so these guard the pipeline, not users):
  constraint apps_slug_format   check (slug ~ '^[a-z0-9-]{1,80}$'),   -- mirrors bookmarks_slug_format (0001)
  constraint apps_status_domain check (status in ('active', 'archived')),  -- apps never go 'stale' (types/app.ts AppStatus)
  constraint apps_hash_format   check (content_hash ~ '^[0-9a-f]{64}$')
);

create table public.recipes (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  data          jsonb       not null,
  status        text        not null default 'active',
  content_hash  text        not null,
  embedding     extensions.vector(384),
  source_commit text,
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  constraint recipes_slug_format   check (slug ~ '^[a-z0-9-]{1,80}$'),
  constraint recipes_status_domain check (status in ('active', 'stale', 'archived')),  -- 'stale' is recipe-only (types/recipe.ts RecipeStatus)
  constraint recipes_hash_format   check (content_hash ~ '^[0-9a-f]{64}$')
);

-- The apps↔recipes join surface, rebuilt from scratch on every projection.
-- step_index = the position in the recipe's steps[] array (ordered even for
-- DAG recipes; graph fields id/dependsOn/loop stay inside recipes.data).
create table public.recipe_steps (
  id            uuid primary key default gen_random_uuid(),
  recipe_id     uuid not null references public.recipes(id) on delete cascade,
  app_id        uuid not null references public.apps(id)    on delete restrict,  -- safety net: apps are only ever soft-deleted, so restrict never fires in normal operation
  step_index    int  not null,
  capability_id text,                               -- the step's `capability` (bare AppCapability string; apps carry {id,level,note} OBJECTS — different shapes by design)
  unique (recipe_id, step_index),
  constraint recipe_steps_index_nonneg check (step_index >= 0)
  -- NO unique (recipe_id, app_id): the same app validly appears in multiple
  -- steps of one recipe with different capabilities (only the appSlug+capability
  -- PAIR is unique per the recipes schema refine — e.g. figma-ai twice in
  -- design-spec-to-signed-ui-component).
);

-- ============================================================
-- 2. INDEXES (slug is already indexed by its UNIQUE constraint)
-- ============================================================
create index apps_deleted_at_idx        on public.apps (deleted_at);
create index recipes_deleted_at_idx     on public.recipes (deleted_at);
create index recipe_steps_app_id_idx    on public.recipe_steps (app_id);
create index recipe_steps_recipe_id_idx on public.recipe_steps (recipe_id);

-- ============================================================
-- 3. RLS: public read of live rows; ZERO write policies.
--    service_role (the only writer, via the RPC) has bypassrls — naming it in
--    a policy does nothing, so none exists. Grants and RLS are separate
--    layers; both are required for anon/authenticated reads.
-- ============================================================
alter table public.apps         enable row level security;
alter table public.recipes      enable row level security;
alter table public.recipe_steps enable row level security;

grant select on public.apps, public.recipes, public.recipe_steps to anon, authenticated;
-- Belt-and-braces (0001 house style): Supabase default privileges hand new tables
-- INSERT/UPDATE/DELETE to anon/authenticated; RLS-with-zero-write-policies already
-- denies them, but revoke the privilege layer too so a future careless policy or
-- RLS toggle can't silently open writes.
revoke insert, update, delete on public.apps, public.recipes, public.recipe_steps from anon, authenticated;

create policy "apps: public read live" on public.apps for select
  to anon, authenticated using ( deleted_at is null );
create policy "recipes: public read live" on public.recipes for select
  to anon, authenticated using ( deleted_at is null );
-- Steps have no deleted_at of their own — visibility rides on the parent recipe.
create policy "recipe_steps: public read live parents" on public.recipe_steps for select
  to anon, authenticated using (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.deleted_at is null)
  );

-- ============================================================
-- 4. APP↔RECIPE COUNT VIEW
--    Mirrors the build-time semantics of lib/tools/recipe-index.ts
--    recipesUsingApp: count DISTINCT recipes (an app can hold multiple steps
--    of one recipe), excluding deleted AND archived recipes — 'stale' still
--    counts, exactly like isBrowsableRecipe — and only for ACTIVE apps
--    (isActiveApp gates the rail at build time; an archived app shows no
--    count on the site, so it gets no row here either). Apps with zero
--    recipes simply have no row (the site only renders the rail when recipes
--    exist). security_invoker so the base tables' RLS applies to API callers.
-- ============================================================
create view public.app_recipe_counts
with (security_invoker = true) as
select
  a.id   as app_id,
  a.slug as slug,
  count(distinct rs.recipe_id) as recipe_count
from public.apps a
join public.recipe_steps rs on rs.app_id = a.id
join public.recipes r       on r.id = rs.recipe_id
where a.deleted_at is null
  and a.status = 'active'
  and r.deleted_at is null
  and r.status <> 'archived'
group by a.id, a.slug;

grant select on public.app_recipe_counts to anon, authenticated;

-- ============================================================
-- 5. BOOKMARK FK UPGRADE (Phase 1 wrote item_slug as a soft-FK; Phase 2 adds
--    the hard FK while keeping item_slug as the denormalized fallback — the
--    Phase-1 client contract is untouched and still writes item_slug only).
-- ============================================================
alter table public.bookmarks
  add column app_id    uuid references public.apps(id)    on delete set null,   -- set null, not cascade: a hard cleanup must never destroy user bookmarks
  add column recipe_id uuid references public.recipes(id) on delete set null;

-- One-time backfill. A no-op right now (the read model is empty until the
-- first projection runs) — project_content() repeats this re-link on every
-- sync, which is what actually populates it and keeps new bookmarks linked.
update public.bookmarks b set app_id = a.id
  from public.apps a    where b.item_type = 'app'    and b.item_slug = a.slug;
update public.bookmarks b set recipe_id = r.id
  from public.recipes r where b.item_type = 'recipe' and b.item_slug = r.slug;

create index bookmarks_app_id_idx    on public.bookmarks (app_id)    where app_id    is not null;
create index bookmarks_recipe_id_idx on public.bookmarks (recipe_id) where recipe_id is not null;

-- 5a. Keep the denormalized item_slug fresh when a projection renames a slug.
--     SECURITY DEFINER (bypasses bookmarks RLS), search_path='' (schema-qualify all).
--     A user may have bookmarked BOTH slugs (exactly the bland/bland-ai merge
--     scenario) — the colliding old-slug row must be dropped or the projection
--     transaction aborts on unique(user_id, item_type, item_slug). Deliberate
--     data policy: the canonical-slug row survives; before dropping the old-slug
--     row, its `note` is salvaged onto the survivor when the survivor has none
--     (never silently discard up to 280 chars of user text when we can keep it).
create function public.sync_bookmark_slug_on_app_rename()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  -- Salvage: copy the doomed old-slug row's note onto its note-less survivor.
  update public.bookmarks x
     set note = b.note
    from public.bookmarks b
   where x.user_id = b.user_id and x.item_type = 'app' and b.item_type = 'app'
     and x.item_slug = new.slug and x.id <> b.id
     and (b.app_id = new.id or b.item_slug = old.slug)
     and x.note is null and b.note is not null;
  delete from public.bookmarks b
   where b.item_type = 'app'
     and (b.app_id = new.id or b.item_slug = old.slug)
     and exists (
       select 1 from public.bookmarks x
        where x.user_id = b.user_id and x.item_type = 'app'
          and x.item_slug = new.slug and x.id <> b.id
     );
  update public.bookmarks b
     set item_slug = new.slug, app_id = new.id   -- item_slug fallback also self-heals the FK for not-yet-linked rows
   where b.item_type = 'app'
     and (b.app_id = new.id or b.item_slug = old.slug)
     and b.item_slug is distinct from new.slug;
  return new;
end; $$;

create function public.sync_bookmark_slug_on_recipe_rename()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.bookmarks x
     set note = b.note
    from public.bookmarks b
   where x.user_id = b.user_id and x.item_type = 'recipe' and b.item_type = 'recipe'
     and x.item_slug = new.slug and x.id <> b.id
     and (b.recipe_id = new.id or b.item_slug = old.slug)
     and x.note is null and b.note is not null;
  delete from public.bookmarks b
   where b.item_type = 'recipe'
     and (b.recipe_id = new.id or b.item_slug = old.slug)
     and exists (
       select 1 from public.bookmarks x
        where x.user_id = b.user_id and x.item_type = 'recipe'
          and x.item_slug = new.slug and x.id <> b.id
     );
  update public.bookmarks b
     set item_slug = new.slug, recipe_id = new.id
   where b.item_type = 'recipe'
     and (b.recipe_id = new.id or b.item_slug = old.slug)
     and b.item_slug is distinct from new.slug;
  return new;
end; $$;

create trigger apps_rename_sync_bookmarks
  after update of slug on public.apps
  for each row when (old.slug is distinct from new.slug)
  execute procedure public.sync_bookmark_slug_on_app_rename();

create trigger recipes_rename_sync_bookmarks
  after update of slug on public.recipes
  for each row when (old.slug is distinct from new.slug)
  execute procedure public.sync_bookmark_slug_on_recipe_rename();

-- ============================================================
-- 6. THE PROJECTION RPC — the ONLY write path into the read model.
--    Runs the whole projection in ONE transaction (plpgsql via PostgREST rpc()
--    is inherently transactional; any raise exception rolls back everything).
--
--    Payload shapes (built by scripts/sync-supabase.ts):
--      p_apps / p_recipes : jsonb array of { slug, content_hash, data }
--                           where data = the verbatim .velite record
--      p_commit           : the git commit being projected (GITHUB_SHA)
--      p_renames          : jsonb array of { type: 'app'|'recipe', from, to }
--                           (DEFAULTed so the 3-arg call shape also works)
-- ============================================================
create function public.project_content(
  p_apps    jsonb,
  p_recipes jsonb,
  p_commit  text,
  p_renames jsonb default '[]'::jsonb
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_live_apps        bigint;
  v_incoming_apps    bigint;
  v_incoming_recipes bigint;
  v_missing          text;
  v_apps_upserted    bigint;
  v_apps_deleted     bigint;
  v_recipes_upserted bigint;
  v_recipes_deleted  bigint;
  v_steps            bigint;
begin
  -- 0. Single-flight: serialize overlapping projections (two pushes landing
  --    close together). Transaction-scoped — auto-released on commit/rollback.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('project_content'));

  v_incoming_apps    := jsonb_array_length(p_apps);
  v_incoming_recipes := jsonb_array_length(p_recipes);

  -- 1. CIRCUIT BREAKER: a truncated/broken artifact must never mass-soft-delete
  --    the mirror. Threshold: incoming < 80% of current NON-DELETED rows aborts
  --    the whole transaction ("live" = deleted_at is null — archived apps still
  --    count; they are live mirror rows). v_live_apps > 0 exempts the bootstrap
  --    run into the empty table. (1,025 non-deleted rows today ⇒ floor ≈ 820.)
  select count(*) into v_live_apps from public.apps where deleted_at is null;
  if v_live_apps > 0 and v_incoming_apps < v_live_apps * 0.8 then
    raise exception 'project_content: circuit breaker — % incoming apps < 80%% of % live rows; refusing to project (commit %)',
      v_incoming_apps, v_live_apps, p_commit
      using errcode = 'P0001';
  end if;

  -- 2. RENAME-RESOLVE — must run BEFORE the upsert and the soft-delete pass:
  --    the row keeps its uuid, so bookmarks.app_id / recipe_steps.app_id
  --    survive the slug change, and the incoming record then lands on the
  --    renamed row via ON CONFLICT instead of inserting a duplicate. A hint
  --    whose target slug already exists is a MERGE (e.g. bland → bland-ai),
  --    not a rename — skip it and let the old slug fall through to soft-delete.
  --    Known, accepted limitation: the merge-guard's NOT EXISTS sees SOFT-DELETED
  --    rows too, so renaming onto a slug that once existed and was retired is
  --    treated as a merge (soft-delete + fresh insert; FK continuity not carried).
  --    Acceptable because slugs are never reused by policy; the sync script also
  --    rejects duplicate from/to values in the hint file so two hints can never
  --    race the same target and abort the projection on the unique constraint.
  update public.apps a
     set slug = h.to_slug, updated_at = now(), source_commit = p_commit
    from (
      select e ->> 'from' as from_slug, e ->> 'to' as to_slug
        from jsonb_array_elements(p_renames) e
       where e ->> 'type' = 'app'
    ) h
   where a.slug = h.from_slug
     and not exists (select 1 from public.apps x where x.slug = h.to_slug);

  update public.recipes r
     set slug = h.to_slug, updated_at = now(), source_commit = p_commit
    from (
      select e ->> 'from' as from_slug, e ->> 'to' as to_slug
        from jsonb_array_elements(p_renames) e
       where e ->> 'type' = 'recipe'
    ) h
   where r.slug = h.from_slug
     and not exists (select 1 from public.recipes x where x.slug = h.to_slug);

  -- 3. UPSERT by slug. Status is normalized here: the .velite artifact encodes
  --    an active listing as an ABSENT status key (1,017 of 1,025 today; a few
  --    carry an explicit 'active') — coalesce(nullif(…)) handles all cases.
  --    Unchanged content_hash rows are skipped (no updated_at churn, no dead
  --    tuples) UNLESS soft-deleted: a slug that reappears in git must
  --    resurrect even when its content is byte-identical.
  insert into public.apps as a (slug, data, status, content_hash, source_commit, updated_at, deleted_at)
  select e ->> 'slug',
         e -> 'data',
         coalesce(nullif(e -> 'data' ->> 'status', ''), 'active'),
         e ->> 'content_hash',
         p_commit, now(), null
    from jsonb_array_elements(p_apps) e
  on conflict (slug) do update
     set data          = excluded.data,
         status        = excluded.status,
         content_hash  = excluded.content_hash,
         source_commit = excluded.source_commit,
         updated_at    = now(),
         deleted_at    = null
   where a.content_hash is distinct from excluded.content_hash
      or a.deleted_at is not null;
  get diagnostics v_apps_upserted = row_count;

  insert into public.recipes as r (slug, data, status, content_hash, source_commit, updated_at, deleted_at)
  select e ->> 'slug',
         e -> 'data',
         coalesce(nullif(e -> 'data' ->> 'status', ''), 'active'),
         e ->> 'content_hash',
         p_commit, now(), null
    from jsonb_array_elements(p_recipes) e
  on conflict (slug) do update
     set data          = excluded.data,
         status        = excluded.status,
         content_hash  = excluded.content_hash,
         source_commit = excluded.source_commit,
         updated_at    = now(),
         deleted_at    = null
   where r.content_hash is distinct from excluded.content_hash
      or r.deleted_at is not null;
  get diagnostics v_recipes_upserted = row_count;

  -- 4. SOFT-DELETE live slugs absent from the incoming set (rename hints
  --    already re-slugged their rows above, so they are present, not absent).
  update public.apps a
     set deleted_at = now(), updated_at = now(), source_commit = p_commit
   where a.deleted_at is null
     and not exists (
       select 1 from jsonb_array_elements(p_apps) e where e ->> 'slug' = a.slug
     );
  get diagnostics v_apps_deleted = row_count;

  update public.recipes r
     set deleted_at = now(), updated_at = now(), source_commit = p_commit
   where r.deleted_at is null
     and not exists (
       select 1 from jsonb_array_elements(p_recipes) e where e ->> 'slug' = r.slug
     );
  get diagnostics v_recipes_deleted = row_count;

  -- 5. REBUILD recipe_steps. Velite already FK-validates step appSlugs in-repo,
  --    but re-assert here: an inner join that silently DROPS unresolved steps
  --    is worse than a loud abort (git is self-healing — fix data, re-push).
  select string_agg(distinct s.step ->> 'appSlug', ', ') into v_missing
    from jsonb_array_elements(p_recipes) e
    cross join lateral jsonb_array_elements(e -> 'data' -> 'steps') as s(step)
   where not exists (
     select 1 from public.apps a2
      where a2.slug = s.step ->> 'appSlug' and a2.deleted_at is null
   );
  if v_missing is not null then
    raise exception 'project_content: recipe step app slug(s) not in the projected apps set: %', v_missing
      using errcode = 'P0001';
  end if;

  -- Delete-all + reinsert is safe and simplest at this scale (~6 recipes):
  -- MVCC means API readers see the pre-transaction snapshot until commit —
  -- never an empty join table.
  delete from public.recipe_steps;
  insert into public.recipe_steps (recipe_id, app_id, step_index, capability_id)
  select r.id,
         a.id,
         (s.ord - 1)::int,                -- 0-based position in steps[]
         s.step ->> 'capability'          -- bare AppCapability string (may be null)
    from jsonb_array_elements(p_recipes) e
    join public.recipes r on r.slug = e ->> 'slug'
    cross join lateral jsonb_array_elements(e -> 'data' -> 'steps') with ordinality as s(step, ord)
    join public.apps a on a.slug = s.step ->> 'appSlug';
  get diagnostics v_steps = row_count;

  -- 6. SELF-HEALING BOOKMARK LINKS: resolve Phase-1 item_slug soft-FKs to hard
  --    ids on every run (the Phase-1 client still writes item_slug only; rows
  --    created between syncs get linked here on the next one).
  update public.bookmarks b
     set app_id = a.id
    from public.apps a
   where b.item_type = 'app' and b.app_id is null and b.item_slug = a.slug;

  update public.bookmarks b
     set recipe_id = r.id
    from public.recipes r
   where b.item_type = 'recipe' and b.recipe_id is null and b.item_slug = r.slug;

  return jsonb_build_object(
    'commit',  p_commit,
    'apps',    jsonb_build_object('incoming', v_incoming_apps,    'upserted', v_apps_upserted,    'soft_deleted', v_apps_deleted),
    'recipes', jsonb_build_object('incoming', v_incoming_recipes, 'upserted', v_recipes_upserted, 'soft_deleted', v_recipes_deleted),
    'recipe_steps', v_steps
  );
end; $$;

-- ============================================================
-- 7. HARDEN SECURITY DEFINER functions (same posture as 0001 §4).
--    Postgres grants EXECUTE to PUBLIC by default AND Supabase default
--    privileges grant new functions to anon/authenticated/service_role —
--    without these revokes, project_content would be callable by any anon
--    request at POST /rest/v1/rpc/project_content. service_role bypasses RLS
--    but NOT function ACLs, hence the explicit grant.
-- ============================================================
revoke execute on function public.project_content(jsonb, jsonb, text, jsonb) from public, anon, authenticated;
grant  execute on function public.project_content(jsonb, jsonb, text, jsonb) to service_role;

revoke execute on function public.sync_bookmark_slug_on_app_rename()    from public, anon, authenticated;
revoke execute on function public.sync_bookmark_slug_on_recipe_rename() from public, anon, authenticated;
