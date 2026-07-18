import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Full-row bookmark reads for the /account/bookmarks page (the nav/toggle islands
// use the slim getMyBookmarkedSlugs() action instead). Server-only: never bundled
// into a client chunk.

export interface BookmarkRow {
  id: string;
  item_type: "app" | "recipe";
  item_slug: string;
  note: string | null;
  created_at: string;
}

export async function listMyBookmarks(): Promise<BookmarkRow[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return [];
  const { data: rows } = await supabase
    .from("bookmarks")
    .select("id, item_type, item_slug, note, created_at")
    .order("created_at", { ascending: false });
  return (rows ?? []) as BookmarkRow[];
}
