-- ============================================================
-- Phase 1 user layer: profiles + bookmarks + admin lock
-- Applied to the `ignaite` project as migrations 0001_user_layer + 0002_revoke_definer_execute.
-- This file is the canonical, self-contained DDL (both steps folded in).
-- ============================================================

-- 0. EXTENSIONS (never in an API-exposed schema)
create schema if not exists extensions;
create extension if not exists moddatetime with schema extensions;  -- updated_at helper
create extension if not exists vector      with schema extensions;  -- pgvector, used Phase 2; safe to enable now

-- ============================================================
-- 1. PROFILES (1:1 with auth.users)
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
--     The insert is wrapped in its own exception block: profile creation must NEVER be able to abort account
--     creation. A missing profile is recreated lazily; a signup blocked by any exception here would take down
--     ALL Google sign-ups site-wide.
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
-- 2. BOOKMARKS (apps + recipes; slug is a SOFT-FK in Phase 1)
-- ============================================================
create type public.bookmark_item_type as enum ('app', 'recipe');

create table public.bookmarks (
  id         uuid                       primary key default gen_random_uuid(),
  user_id    uuid                       not null references auth.users(id) on delete cascade,
  item_type  public.bookmark_item_type  not null,
  item_slug  text                       not null,        -- soft-FK: content not in DB yet (Phase 2 adds real FK)
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
-- No UPDATE policy: bookmarks are add/remove only.

-- ============================================================
-- 3. ADMIN LOCK (locked table keyed on immutable UID)
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

-- ============================================================
-- 4. HARDEN SECURITY DEFINER functions (migration 0002)
--    Neither should be callable via /rest/v1/rpc. handle_new_user() only ever runs from its
--    trigger (as the table owner); is_admin() is unused in Phase 1 policies — Phase 3 re-grants
--    EXECUTE to `authenticated` when the admin RLS policies that reference it land.
-- ============================================================
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin()        from public, anon, authenticated;

-- ============================================================
-- SEED (run once, from the SQL editor / service role, after ganesh575@gmail.com's first sign-in):
--   insert into public.admins (user_id, note)
--   select id, 'founder / sole admin' from auth.users where email = 'ganesh575@gmail.com';
-- ============================================================
