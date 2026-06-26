import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, ArrowUpRight, BookOpen, Check } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { RecipeFlow } from "@/components/tools/recipe-flow";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getRecipe, listRecipes } from "@/lib/recipes";
import { recipeExecutionOrder } from "@/lib/tools/recipe-graph";
import { getApp } from "@/lib/apps";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// One static page per browsable recipe — a build-time render over the curated
// chain. SSG, 0 B route JS (pure RSC, like /compare). `dynamicParams = false`
// 404s anything not in the browsable set; archived recipes drop out of
// generateStaticParams (listRecipes excludes them), so they 404 here.
export const dynamicParams = false;

export function generateStaticParams() {
  return listRecipes({ includeStale: true }).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return buildMetadata({ title: "Not found", path: `/recipes/${slug}` });
  return buildMetadata({
    title: recipe.title,
    description: recipe.summary,
    path: `/recipes/${recipe.slug}`,
    // No ogImage → the colocated opengraph-image.tsx wins (mirrors /apps/[slug]).
  });
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const isStale = (recipe.status ?? "active") === "stale";
  const steps = recipe.steps.map((step) => ({ step, app: getApp(step.appSlug) }));
  // Deduped apps in the chain (first-appearance order) for the cross-link footer.
  const chainApps = [
    ...new Map(steps.filter((s) => s.app).map((s) => [s.app!.slug, s.app!])).values(),
  ];

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
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            <li>
              <Link
                href="/"
                className="rounded transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Directory
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href="/recipes"
                className="rounded transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Recipes
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              {recipe.title}
            </li>
          </ol>
        </nav>

        {isStale ? (
          <div className="mb-8 flex items-start gap-3 rounded-xl bg-[var(--color-warn)]/[0.08] p-4 ring-1 ring-[var(--color-warn)]/25 ring-inset">
            <AlertTriangle
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warn)]"
            />
            <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
              This recipe is marked{" "}
              <span className="font-medium text-[var(--color-warn)]">stale</span> — one or more apps
              in the chain were archived or changed. The steps may no longer work exactly as
              written.
            </p>
          </div>
        ) : null}

        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase">
            {recipe.audience}
          </p>
          <h1 className="text-display mt-3 text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">{recipe.goal}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.08] pt-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            <span>{recipe.steps.length} steps</span>
            {recipe.lastVerifiedAt ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  Verified <time dateTime={recipe.lastVerifiedAt}>{recipe.lastVerifiedAt}</time>
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* longSummary — the substance body (plain prose; ≥120 chars enforced). */}
        <div className="mt-12 max-w-2xl text-base leading-relaxed text-[var(--color-ink-soft)]">
          <p>{recipe.longSummary}</p>
        </div>

        {recipe.prerequisites && recipe.prerequisites.length > 0 ? (
          <section className="mt-12 max-w-2xl" aria-labelledby="prereq-heading">
            <h2
              id="prereq-heading"
              className="mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
            >
              Prerequisites
            </h2>
            <ul className="space-y-2">
              {recipe.prerequisites.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-[var(--color-ink-soft)]">
                  <Check
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 max-w-2xl" aria-labelledby="steps-heading">
          <h2
            id="steps-heading"
            className="mb-6 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
          >
            The workflow
          </h2>
          <RecipeFlow recipe={recipe} />
        </section>

        {recipe.references && recipe.references.length > 0 ? (
          <section className="mt-12 max-w-2xl" aria-labelledby="ref-heading">
            <h2
              id="ref-heading"
              className="mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
            >
              References
            </h2>
            <ul className="flex flex-col divide-y divide-white/[0.06] overflow-hidden rounded-2xl ring-1 ring-white/[0.06] ring-inset">
              {recipe.references.map((ref) => (
                <li key={ref.url}>
                  <Link
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                  >
                    <BookOpen
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-dim)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                        {ref.title}
                      </span>
                      {ref.source ? (
                        <span className="mt-0.5 block font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                          {ref.source}
                        </span>
                      ) : null}
                    </span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)] group-hover:text-[var(--color-accent)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            All recipes
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
          {chainApps.map((app) => (
            <Link
              key={app.slug}
              href={`/apps/${app.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              {app.name}
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: recipe.title,
          description: recipe.summary,
          // Linearized in deterministic execution (topological) order — the same
          // order the on-page flow renders, so #step-N anchors match. A loop is
          // appended to its step's text (an exit condition), never a duplicated step.
          step: recipeExecutionOrder(recipe).map(({ step }, pos) => ({
            "@type": "HowToStep",
            position: pos + 1,
            name: step.action,
            text: step.loop ? `${step.rationale} Repeat until ${step.loop.until}.` : step.rationale,
            url: `${siteUrl}/recipes/${recipe.slug}#step-${pos + 1}`,
          })),
          tool: [...new Set(recipe.steps.map((s) => s.appSlug))].map((appSlug) => ({
            "@type": "HowToTool",
            name: getApp(appSlug)?.name ?? appSlug,
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
            {
              "@type": "ListItem",
              position: 3,
              name: recipe.title,
              item: `${siteUrl}/recipes/${recipe.slug}`,
            },
          ],
        }}
      />
    </div>
  );
}
