import Link from "next/link";
import type { ReactElement } from "react";
import { recipesUsingApp } from "@/lib/recipes";

// The per-app "Used in N recipes" reverse rail (AE). recipesUsingApp() is the
// build-time reverse FK (lib/tools/recipe-index.ts): given an app, the browsable
// recipes that chain it, newest-first. Pure RSC — importing lib/recipes pulls
// @/.velite, which must never reach a client bundle (app-detail.tsx is RSC).
// Renders null when the app appears in no browsable recipe.
export function RecipesRail({ appSlug }: Readonly<{ appSlug: string }>): ReactElement | null {
  const recipes = recipesUsingApp(appSlug);
  if (recipes.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="recipes-rail-heading">
      <h2
        id="recipes-rail-heading"
        className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase"
      >
        Used in {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {recipes.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/recipes/${r.slug}`}
              className="group block rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] transition-colors ring-inset hover:bg-white/[0.04] hover:ring-white/[0.1] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              <p className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                {r.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[12px] text-[var(--color-ink-dim)]">{r.goal}</p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                {r.steps.length} steps
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
