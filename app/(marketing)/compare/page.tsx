import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { categoryHref } from "@/lib/tools/facet-links";
import {
  type ComparisonPair,
  comparisonCount,
  comparisonHref,
  crossCategoryPairs,
  sameCategoryGroups,
} from "@/lib/tools/comparisons";

// The /compare hub — a bounded, crawlable index into the comparison surface.
// It does NOT list all ~3k pairs (that would be a heavy, low-signal page); it
// shows a capped set per category and pivots into the category landing pages for
// the long tail. Pure RSC, no client JS.
const PER_CATEGORY = 10;
const CROSS_CAP = 24;

export const metadata: Metadata = buildMetadata({
  title: "Compare AI apps",
  description:
    "Side-by-side comparisons of AI apps — pricing, platforms, license, and model support, drawn from Ignaite's continuously-verified directory.",
  path: "/compare",
  ogImage: "/opengraph-image",
});

function PairLink({ pair }: { pair: ComparisonPair }) {
  return (
    <li>
      <Link
        href={comparisonHref(pair.a.slug, pair.b.slug)}
        className="group flex items-center gap-1.5 rounded text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <span>
          {pair.a.name} <span className="text-[var(--color-ink-dim)]">vs</span> {pair.b.name}
        </span>
        <ArrowRight
          aria-hidden
          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>
    </li>
  );
}

// Prioritize pairs where either app is featured, then alphabetically — so the
// capped per-category sample leads with the strongest head-to-heads.
const prioritize = (pairs: ReadonlyArray<ComparisonPair>) =>
  [...pairs].sort((x, y) => {
    const xf = Number(!!x.a.featured || !!x.b.featured);
    const yf = Number(!!y.a.featured || !!y.b.featured);
    return yf - xf || x.slug.localeCompare(y.slug);
  });

export default function CompareHubPage() {
  const groups = sameCategoryGroups();
  const cross = crossCategoryPairs();
  const total = comparisonCount();

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
              Compare
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            Compare <span className="text-[var(--color-accent)]">AI apps</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            Curated head-to-heads, side by side — pricing, platforms, license, deployment, and model
            support, all from Ignaite&apos;s continuously-verified listings. No reviews, no opinions
            for sale: just the facts we audit.
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            {total.toLocaleString()} comparisons · researched &amp; kept current by Claude Code
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {groups.map((group) => {
            const shown = prioritize(group.pairs).slice(0, PER_CATEGORY);
            const more = group.pairs.length - shown.length;
            return (
              <section key={group.category} aria-labelledby={`cat-${group.category}`}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2
                    id={`cat-${group.category}`}
                    className="text-display text-xl tracking-[-0.02em] text-[var(--color-ink)]"
                  >
                    {group.label}
                  </h2>
                  <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                    {group.pairs.length}
                  </span>
                </div>
                <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((p) => (
                    <PairLink key={p.slug} pair={p} />
                  ))}
                </ul>
                {more > 0 ? (
                  <Link
                    href={categoryHref(group.category)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                  >
                    +{more} more {group.label} apps to compare
                    <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </section>
            );
          })}

          {cross.length ? (
            <section aria-labelledby="cross-cat">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2
                  id="cross-cat"
                  className="text-display text-xl tracking-[-0.02em] text-[var(--color-ink)]"
                >
                  Cross-category
                </h2>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                  {cross.length}
                </span>
              </div>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {prioritize(cross)
                  .slice(0, CROSS_CAP)
                  .map((p) => (
                    <PairLink key={p.slug} pair={p} />
                  ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Compare AI apps — Ignaite",
          url: `${siteUrl}/compare`,
          description:
            "Curated side-by-side comparisons of AI apps from Ignaite's AI-managed directory.",
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
        }}
      />
    </div>
  );
}
