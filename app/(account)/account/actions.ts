"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { checkRateLimit } from "@/lib/rate-limit";

const HANDLE_RE = /^[a-z0-9_]{3,30}$/;

export async function updateProfile(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured) redirect("/account?error=unconfigured");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/sign-in?next=/account");
  if (!checkRateLimit(`profile:${userId}`, { limit: 10, windowMs: 60_000 }).ok) {
    redirect("/account?error=rate");
  }

  const displayName = ((formData.get("display_name") as string) ?? "").trim().slice(0, 80) || null;
  const bio = ((formData.get("bio") as string) ?? "").trim().slice(0, 500) || null;
  const handleRaw = ((formData.get("handle") as string) ?? "").trim().toLowerCase();
  const handle = handleRaw || null;

  // Client + DB both enforce the format; validate here for a clean redirect path.
  if (handle && !HANDLE_RE.test(handle)) redirect("/account?error=handle");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, bio, handle })
    .eq("id", userId);

  // 23505 = unique_violation → the handle is taken.
  if (error) redirect(`/account?error=${error.code === "23505" ? "handle_taken" : "save"}`);
  redirect("/account?saved=1");
}

export async function requestAccountDeletion(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured) redirect("/account/settings?error=unconfigured");
  const confirm = ((formData.get("confirm") as string) ?? "").trim().toUpperCase();
  if (confirm !== "DELETE") redirect("/account/settings?error=confirm");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/sign-in");
  if (!checkRateLimit(`del:${userId}`, { limit: 3, windowMs: 300_000 }).ok) {
    redirect("/account/settings?error=rate");
  }

  // Privileged deletion runs in the delete-account Edge Function (it derives the
  // uid from the verified JWT and cascades profile + bookmarks). functions.invoke
  // forwards the caller's session as the Authorization bearer.
  const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
  if (error) redirect("/account/settings?error=delete");

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
