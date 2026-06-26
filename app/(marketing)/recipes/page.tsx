import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { listRecipes } from "@/lib/recipes";
import { recipeCount } from "@/lib/tools/recipe-index";
import { getApp } from "@/lib/apps";
import type { Recipe } from "@/types/recipe";

// The /recipes hub — every browsable recipe as a card. Pure RSC, 0 B route JS
// (like /compare and /insights). A Recipe is a curated, verified, LINEAR chain of
// listed apps that accomplishes one real job; the data layer (Chunk AD) keeps it
// honest (FK integrity + archived-app auto-demote to "stale"). Unlike /compare's
// ~3k pairs this is a small bounded set, so we list all of them, newest-first.

export const metadata: Metadata = buildMetadata({
  title: "Recipes",
  description:
    "Curated, step-by-step workflows over Ignaite's directory of AI apps — ordered chains of listed apps, each grounded in independent sources and kept current by Claude Code.",
  path: "/recipes",
  ogImage: "/opengraph-image",
});

function RecipeCard({ recipe }: { recipe: Recipe }) {
  // The app chain, deduped in first-appearance order, for the card footer.
  const chainNames = [...new Set(recipe.steps.map((s) => s.appSlug))].map(
    (slug) => getApp(slug)?.name ?? slug,
  );
  const isStale = (recipe.status ?? "active") === "stale";

  return (
    <li>
      <Link
        href={`/recipes/${recipe.slug}`}
        className="group flex h-full flex-col gap-3 rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.04] hover:ring-white/[0.12] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-display text-lg tracking-[-0.02em] text-[var(--color-ink)]">
            {recipe.title}
          </h2>
          {isStale ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[var(--color-warn)]/[0.12] px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-[var(--color-warn)] uppercase ring-1 ring-[var(--color-warn)]/25 ring-inset">
              <AlertTriangle aria-hidden className="h-3 w-3" />
              Stale
            </span>
          ) : null}
        </div>

        <p className="text-sm font-medium text-[var(--color-accent)]">{recipe.goal}</p>
        <p className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
          {recipe.audience}
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{recipe.summary}</p>

        <div className="mt-auto border-t border-white/[0.08] pt-3">
          <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            {recipe.steps.length} steps
          </p>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
            {chainNames.map((name, idx) => (
              <span key={`${name}-${idx}`} className="flex items-center gap-1.5">
                {idx > 0 ? (
                  <ArrowRight aria-hidden className="h-3 w-3 text-[var(--color-ink-dim)]" />
                ) : null}
                <span className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-soft)]">
                  {name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function RecipesHubPage() {
  const recipes = listRecipes(); // newest-first; excludes archived
  const count = recipeCount();

  return (
    <div className="relative overflow-clip px-6 pt-40 pb-32 sm:pt-44">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={640}
        color="var(--color-accent)"
        opacity={0.06}
      />

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            <li>
              <Link
                href="/"
                className="rounded transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Directory
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              Recipes
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            AI <span className="text-[var(--color-accent)]">recipes</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            Step-by-step workflows that chain listed apps into a complete job — from raw input to
            finished output. Each step is a real app with a proven role, grounded in independent
            sources. No wishful integrations.
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            {count.toLocaleString()} recipe{count === 1 ? "" : "s"} · researched &amp; kept current
            by Claude Code
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {recipes.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </ul>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Recipes — Ignaite",
          url: `${siteUrl}/recipes`,
          description:
            "Curated, step-by-step workflows over Ignaite's AI-managed directory of AI apps.",
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
          hasPart: recipes.map((r) => ({
            "@type": "HowTo",
            name: r.title,
            url: `${siteUrl}/recipes/${r.slug}`,
            description: r.summary,
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Directory", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Recipes", item: `${siteUrl}/recipes` },
          ],
        }}
      />
    </div>
  );
}
