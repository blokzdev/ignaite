import Link from "next/link";
import { redirect } from "next/navigation";
import { Route } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listMyBookmarks } from "@/lib/auth/bookmarks";
import { getApp } from "@/lib/apps";
import { getRecipe } from "@/lib/recipes";
import { ToolCard } from "@/components/tools/tool-card";
import { BookmarkProvider } from "@/components/auth/bookmark-provider";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in?next=/account/bookmarks");

  const rows = await listMyBookmarks();
  const apps = rows
    .filter((r) => r.item_type === "app")
    .map((r) => ({ slug: r.item_slug, app: getApp(r.item_slug) }));
  const recipes = rows
    .filter((r) => r.item_type === "recipe")
    .map((r) => ({ slug: r.item_slug, recipe: getRecipe(r.item_slug) }));

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-eyebrow text-[var(--color-accent-hot)]">Your account</p>
      <h1 className="text-display mt-2 text-4xl text-[var(--color-ink)]">Bookmarks</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        {rows.length === 0
          ? "Nothing saved yet."
          : `${rows.length} saved item${rows.length === 1 ? "" : "s"}.`}
      </p>

      {rows.length === 0 && (
        <div className="glass mt-8 rounded-2xl p-8 text-center">
          <p className="text-sm text-[var(--color-ink-soft)]">
            Tap the bookmark icon on any app or recipe to save it here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            Browse the directory
          </Link>
        </div>
      )}

      {/* Wrap in the provider so each card's bookmark toggle is live here too
          (this page is outside the marketing layout that normally provides it). */}
      <BookmarkProvider>
        {apps.length > 0 && (
          <section className="mt-10">
            <h2 className="text-eyebrow text-[var(--color-ink-dim)]">Apps ({apps.length})</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map(({ slug, app }) =>
                app ? (
                  <ToolCard key={slug} app={app} />
                ) : (
                  <Tombstone key={slug} slug={slug} kind="app" />
                ),
              )}
            </div>
          </section>
        )}

        {recipes.length > 0 && (
          <section className="mt-10">
            <h2 className="text-eyebrow text-[var(--color-ink-dim)]">Recipes ({recipes.length})</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recipes.map(({ slug, recipe }) =>
                recipe ? (
                  <li key={slug}>
                    <Link
                      href={`/recipes/${slug}`}
                      className="glass flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                    >
                      <Route className="h-4 w-4 shrink-0 text-[var(--color-ink-dim)]" />
                      <span className="truncate text-sm text-[var(--color-ink)]">
                        {recipe.title}
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li key={slug}>
                    <Tombstone slug={slug} kind="recipe" />
                  </li>
                ),
              )}
            </ul>
          </section>
        )}
      </BookmarkProvider>
    </div>
  );
}

// A bookmarked slug that no longer resolves (archived/removed/renamed). We never
// auto-delete the row on a transient miss — it's shown as a tombstone.
function Tombstone({ slug, kind }: Readonly<{ slug: string; kind: "app" | "recipe" }>) {
  return (
    <div className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] ring-inset">
      <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
        {kind} · no longer listed
      </p>
      <p className="mt-1 truncate text-sm text-[var(--color-ink-dim)]">{slug}</p>
    </div>
  );
}
