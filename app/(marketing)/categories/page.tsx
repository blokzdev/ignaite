import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { CATEGORY_CLUSTERS, CATEGORY_DESCRIPTION } from "@/lib/tools/category-meta";
import { activeCountByCategory } from "@/lib/tools/category-stats";
import { categoryHref } from "@/lib/tools/facet-links";

export const metadata: Metadata = buildMetadata({
  title: "Browse by Category",
  description:
    "Every category in the Ignaite AI apps directory — developer tooling, media generation, work copilots, vertical AI, and the frontier, each researched and kept current by Claude Code.",
  path: "/categories",
  ogImage: "/opengraph-image",
});

// The category index hub: all populated categories grouped by the same cluster
// order as the APP_CATEGORIES enum. Pure RSC — keeps the footer's Browse block
// compact (top-N + one link here) while every category page stays one hop from
// every page on the site.
export default function CategoriesPage() {
  const counts = activeCountByCategory();

  return (
    <div className="relative overflow-clip px-6 pt-40 pb-32 sm:pt-44">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={640}
        color="var(--color-accent)"
        opacity={0.06}
      />

      <div className="container-site relative">
        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            Browse by <span className="text-[var(--color-accent)]">category</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            Every corner of the directory, organized the way the field is organized — from the
            tooling AI is built with to the verticals it&apos;s reshaping.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-14">
          {CATEGORY_CLUSTERS.map((cluster) => {
            const populated = cluster.categories.filter((c) => (counts.get(c) ?? 0) > 0);
            if (populated.length === 0) return null;
            return (
              <section key={cluster.label} aria-labelledby={`cluster-${cluster.label}`}>
                <div className="flex items-baseline gap-3">
                  <h2
                    id={`cluster-${cluster.label}`}
                    className="font-mono text-xs tracking-[0.16em] text-[var(--color-ink)] uppercase"
                  >
                    {cluster.label}
                  </h2>
                  <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                    {cluster.blurb}
                  </p>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {populated.map((c) => (
                    <li key={c}>
                      <Link
                        href={categoryHref(c)}
                        className="group flex h-full items-start justify-between gap-3 rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] transition-colors ring-inset hover:bg-white/[0.05] hover:ring-white/[0.12] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                      >
                        <span className="min-w-0">
                          <span className="flex items-baseline gap-2">
                            <span className="text-base font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                              {CATEGORY_LABEL[c]}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] tabular-nums">
                              {counts.get(c)}
                            </span>
                          </span>
                          <span className="mt-1.5 block text-sm leading-relaxed text-[var(--color-ink-dim)]">
                            {CATEGORY_DESCRIPTION[c]}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)] transition-colors group-hover:text-[var(--color-accent)]"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Browse by Category — Ignaite",
          url: `${siteUrl}/categories`,
          description: metadata.description ?? undefined,
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
        }}
      />
    </div>
  );
}
