import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolGrid } from "@/components/tools/tool-grid";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { CATEGORY_DESCRIPTION } from "@/lib/tools/category-meta";
import { activeCategoryApps } from "@/lib/tools/category-stats";
import { categoryHref, facetHref } from "@/lib/tools/facet-links";
import { APP_CATEGORIES, type AppCategory } from "@/types/app";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 39 fully static category landing pages — the crawlable, indexable browse
// surface per category ("AI agent tools", "vector DB apps", …). Pure RSC by
// design: no filters/sort/infinite scroll here — the page links INTO the
// interactive directory (/?category=…) for that. Near-zero route-specific
// client JS (§10).
export const dynamicParams = false;

export function generateStaticParams() {
  // Emit every enum category with at least one ACTIVE listing — an empty (or
  // all-archived) category gets no landing page rather than a thin shell.
  return APP_CATEGORIES.filter((c) => activeCategoryApps(c).length > 0).map((slug) => ({ slug }));
}

const isCategory = (s: string): s is AppCategory =>
  (APP_CATEGORIES as readonly string[]).includes(s);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategory(slug)) return buildMetadata({ title: "Not found", path: categoryHref(slug) });
  return buildMetadata({
    title: `${CATEGORY_LABEL[slug]} — AI Apps`,
    description: CATEGORY_DESCRIPTION[slug],
    path: categoryHref(slug),
    // Route group pages don't inherit the root og card once they export their
    // own openGraph — point at the generated root OG route explicitly (same
    // pattern as the homepage).
    ogImage: "/opengraph-image",
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();

  const label = CATEGORY_LABEL[slug];
  const apps = activeCategoryApps(slug);
  if (apps.length === 0) notFound();

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
            <li>
              <Link
                href="/categories"
                className="rounded transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Categories
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              {label}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            {label} <span className="text-[var(--color-accent)]">AI apps</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            {CATEGORY_DESCRIPTION[slug]}
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            {apps.length} {apps.length === 1 ? "app" : "apps"} · researched &amp; kept current by
            Claude Code
          </p>
          <Link
            href={facetHref("category", slug)}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            Filter &amp; search these {apps.length} apps
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12">
          <ToolGrid items={apps} />
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${label} AI Apps — Ignaite`,
          url: `${siteUrl}${categoryHref(slug)}`,
          description: CATEGORY_DESCRIPTION[slug],
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
          numberOfItems: apps.length,
          // Per-category hasPart is the right altitude for crawl coverage: 5–40
          // entries here (the homepage's 459-entry blob moved to these pages).
          hasPart: apps.map((a) => ({
            "@type": "SoftwareApplication",
            name: a.name,
            url: `${siteUrl}/apps/${a.slug}`,
          })),
        }}
      />
    </div>
  );
}
