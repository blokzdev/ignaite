"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Reads: power the client-hydrated nav + bookmark state (§2a) ──────────────
// Both are cheap no-ops when signed out or unconfigured, so the client islands
// can call them unconditionally after mount without touching cookies() in any
// marketing render path.

export type SessionSummary = {
  signedIn: true;
  displayName: string | null;
  avatarUrl: string | null;
  handle: string | null;
} | null;

export async function getSessionSummary(): Promise<SessionSummary> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, handle")
    .eq("id", userId)
    .single();
  return {
    signedIn: true,
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    handle: profile?.handle ?? null,
  };
}

export interface BookmarkState {
  signedIn: boolean;
  app: string[];
  recipe: string[];
}

// One round trip hydrates the whole bookmark UI: whether to prompt sign-in vs
// toggle, plus the initial filled set. Cheap + safe when signed out or unconfigured.
export async function getBookmarkState(): Promise<BookmarkState> {
  if (!isSupabaseConfigured) return { signedIn: false, app: [], recipe: [] };
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { signedIn: false, app: [], recipe: [] };
  const state: BookmarkState = { signedIn: true, app: [], recipe: [] };
  const { data: rows } = await supabase.from("bookmarks").select("item_type, item_slug");
  for (const r of rows ?? []) state[r.item_type].push(r.item_slug);
  return state;
}

// ── Writes ───────────────────────────────────────────────────────────────────

// Form action: `<form action={signInWithGoogle}>` with a hidden `next` input.
export async function signInWithGoogle(formData: FormData) {
  if (!isSupabaseConfigured) redirect("/sign-in?error=unconfigured");
  let next = (formData.get("next") as string | null) ?? "/account";
  if (!next.startsWith("/")) next = "/account";

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect("/sign-in?error=oauth");
  // Sets the PKCE code_verifier cookie, then 302s to Google. Never wrap redirect()
  // in try/catch — it throws NEXT_REDIRECT, which must propagate.
  if (data.url) redirect(data.url);
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

/**
 * Idempotent, non-toggling, error-surfacing bookmark write. The caller passes the
 * DESIRED end state, so two concurrent "add" calls both converge instead of racing
 * a read-then-write into a UNIQUE-violation crash. Returns {ok} so the island's
 * useOptimistic can roll back. No revalidatePath — per-user state was never baked
 * into the static page, so the island updates itself + the shared context (§2a).
 */
export async function setBookmark(
  kind: "app" | "recipe",
  slug: string,
  desired: boolean,
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured) return { ok: false };
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { ok: false };

  if (!checkRateLimit(`bm:${userId}`, { limit: 30, windowMs: 60_000 }).ok) return { ok: false };

  const row = { user_id: userId, item_type: kind, item_slug: slug };
  const { error } = desired
    ? await supabase
        .from("bookmarks")
        .upsert(row, { onConflict: "user_id,item_type,item_slug", ignoreDuplicates: true })
    : await supabase.from("bookmarks").delete().match(row);

  return { ok: !error };
}
