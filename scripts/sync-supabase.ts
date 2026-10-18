// scripts/sync-supabase.ts — git → Supabase one-directional content projection (Phase 2a).
//
// Git is the SOURCE OF TRUTH. This script reads the Velite-generated artifacts
// (.velite/apps.json + .velite/recipes.json — deliberately NOT data/*: the
// velite.config.ts complete() hook applies reality-reflecting mutations, e.g.
// auto-demoting a recipe to status:"stale" when a step app is archived, that
// exist ONLY in the generated artifact), computes a canonical content hash per
// record, and calls the project_content RPC (supabase/migrations/
// 0003_content_projection.sql) with a service-role client. One atomic
// transaction per run; Supabase is a derived, self-healing mirror — nothing is
// ever written back to the repo.
//
// Run (CI / Node >= 22.18 — native TS type stripping; .nvmrc pins 24):
//   node scripts/sync-supabase.ts
// Local fallback on older Node:
//   pnpm dlx tsx scripts/sync-supabase.ts
//
// Env (never NEXT_PUBLIC_*, never committed — GH Actions secrets in CI):
//   SUPABASE_URL                e.g. https://jildtuofapktmsijgyyb.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   service-role secret (bypasses RLS; server-only)
//
// No app-code imports — plain Node + @supabase/supabase-js (already a dep).

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/**
 * Canonical serialization: recursive sorted object keys, no whitespace
 * (RFC 8785-adjacent). Stable across cosmetic key reordering in the source
 * JSON, so hashes only change when content changes.
 *
 * IMPORTANT: hashes are compared hash-to-hash against apps.content_hash /
 * recipes.content_hash ONLY. Never recompute from the stored jsonb — Postgres
 * jsonb drops key order and whitespace and dedupes keys, so `data::text` will
 * never match this serialization.
 */
function canonicalize(value: Json): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
    .join(",")}}`;
}

function contentHash(record: Json): string {
  return createHash("sha256").update(canonicalize(record)).digest("hex");
}

/** Resolve paths relative to this file so the script works from any cwd. */
async function loadJson<T>(relPath: string): Promise<T> {
  return JSON.parse(await readFile(new URL(relPath, import.meta.url), "utf8")) as T;
}

type VeliteRecord = { slug: string } & { [key: string]: Json };

/**
 * Rename hints let the projection carry a row's uuid (and therefore
 * bookmarks.app_id / recipe_steps.app_id) across a slug change, instead of
 * soft-delete + fresh insert. Source: data/redirects.json, an optional
 * machine-readable array of { type: "app" | "recipe", from, to } — see
 * notes.md (rename-hint decision). Absent file = no hints; MERGE pairs (the
 * target slug already live, e.g. bland → bland-ai) are safely skipped by the
 * RPC's not-exists guard and fall through to soft-delete.
 */
type RenameHint = { type: "app" | "recipe"; from: string; to: string };

async function loadRenameHints(): Promise<RenameHint[]> {
  let raw: unknown;
  try {
    raw = await loadJson<unknown>("../data/redirects.json");
  } catch {
    return []; // no data/redirects.json yet — renames simply aren't hinted
  }
  if (!Array.isArray(raw)) {
    console.error("sync-supabase: data/redirects.json must be a JSON array — ignoring it");
    return [];
  }
  const hints = raw.filter((entry): entry is RenameHint => {
    if (typeof entry !== "object" || entry === null) return false;
    const e = entry as Partial<RenameHint>;
    return (
      (e.type === "app" || e.type === "recipe") &&
      typeof e.from === "string" &&
      typeof e.to === "string" &&
      e.from !== e.to
    );
  });
  // Two hints sharing a `to` would both pass the RPC's merge-guard and collide on
  // the slug UNIQUE constraint, aborting the projection; duplicate `from`s are
  // ambiguous. Both are authoring errors — fail loudly so they get fixed in git.
  for (const key of ["from", "to"] as const) {
    const seen = new Set<string>();
    for (const h of hints) {
      const composite = `${h.type}:${h[key]}`;
      if (seen.has(composite)) {
        console.error(
          `sync-supabase: data/redirects.json has duplicate "${key}" value "${h[key]}" (type ${h.type}) — fix the hint file`,
        );
        process.exit(1);
      }
      seen.add(composite);
    }
  }
  return hints;
}

async function main(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("sync-supabase: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    process.exit(1);
  }

  const apps = await loadJson<VeliteRecord[]>("../.velite/apps.json");
  const recipes = await loadJson<VeliteRecord[]>("../.velite/recipes.json");
  if (!Array.isArray(apps) || apps.length === 0) {
    // An empty artifact means Velite didn't run (or ran against a broken tree) —
    // never project it; the RPC's circuit breaker would refuse it anyway.
    console.error("sync-supabase: .velite/apps.json is missing or empty — run `pnpm velite` first");
    process.exit(1);
  }
  if (!Array.isArray(recipes)) {
    console.error("sync-supabase: .velite/recipes.json is not an array — run `pnpm velite` first");
    process.exit(1);
  }
  if (recipes.length === 0 && apps.length > 0) {
    // The RPC's circuit breaker is apps-only (recipes are too few for a ratio
    // check), so this is the recipes wipe-guard: an all-apps-no-recipes tree is
    // not a state the repo can currently produce — treat it as a truncated
    // artifact, not a real deletion. Escape hatch for the day recipes are
    // genuinely all retired: SYNC_ALLOW_EMPTY_RECIPES=1.
    if (process.env.SYNC_ALLOW_EMPTY_RECIPES !== "1") {
      console.error(
        "sync-supabase: .velite/recipes.json is empty while apps exist — refusing to wipe the recipes mirror (set SYNC_ALLOW_EMPTY_RECIPES=1 to override)",
      );
      process.exit(1);
    }
  }

  const renames = await loadRenameHints();

  const p_apps = apps.map((app) => ({
    slug: app.slug,
    content_hash: contentHash(app),
    data: app,
  }));
  const p_recipes = recipes.map((recipe) => ({
    slug: recipe.slug,
    content_hash: contentHash(recipe),
    data: recipe,
  }));
  // GITHUB_SHA is always present on Actions push events; "local" marks manual runs.
  const p_commit = process.env.GITHUB_SHA ?? "local";

  // Plain supabase-js server client — NEVER @supabase/ssr here (SSR clients push
  // cookie sessions into the Authorization header, silently downgrading the
  // service key to a user JWT and re-enabling RLS against the projection).
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(
    `sync-supabase: projecting ${apps.length} apps, ${recipes.length} recipes, ` +
      `${renames.length} rename hint(s) @ ${p_commit}`,
  );

  const { data, error } = await supabase
    .rpc("project_content", {
      p_apps,
      p_recipes,
      p_commit,
      p_renames: renames,
    })
    // Belt to the workflow's timeout-minutes: a network stall inside this fetch
    // must not hang the job (and block the queued newer-commit run) for hours.
    .abortSignal(AbortSignal.timeout(120_000));
  if (error) {
    // The RPC is a single transaction — on any error (circuit breaker included)
    // the mirror is untouched. Fail the CI job loudly; fix in git and re-push.
    console.error(
      "sync-supabase: project_content failed:",
      error.code ?? "",
      error.message,
      error.details ?? "",
    );
    process.exit(1);
  }
  console.log("sync-supabase: projection ok:", JSON.stringify(data));
}

main().catch((err: unknown) => {
  console.error("sync-supabase: unexpected failure:", err);
  process.exit(1);
});
