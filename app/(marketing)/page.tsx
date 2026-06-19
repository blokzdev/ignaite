import type { Metadata } from "next";
import { Suspense } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { HeroStats } from "@/components/home/hero-stats";
import { JsonLd } from "@/components/seo/json-ld";
import { FeaturedCarouselSkeleton } from "@/components/tools/featured-carousel-skeleton";
import { ToolGrid } from "@/components/tools/tool-grid";
import { ToolsBrowser } from "@/components/tools/tools-browser";
import { brand } from "@/data/brand";
import { apps as allApps } from "@/.velite";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { BATCH_SIZE, recentApps } from "@/lib/tools/filter-apps";

export const metadata: Metadata = buildMetadata({
  title: "AI Apps Directory",
  description:
    "An AI-managed directory of the AI apps worth knowing — 400+ tools across 40+ categories, kept current by Claude Code and searchable by category, pricing, license, deployment, and platform.",
  path: "/",
  // `/` lives in the (marketing) route group, so it doesn't pick up the root
  // app/opengraph-image.tsx by inheritance once it exports its own openGraph.
  // Point at the generated OG route explicitly (metadataBase makes it absolute).
  ogImage: "/opengraph-image",
});

export default function HomePage() {
  // Headline counts reflect the LIVE directory (active apps) — matching the grid,
  // the category strip "All", and the console readout. Archived entries are kept
  // as historical record but aren't part of the browsable count.
  const live = allApps.filter((a) => (a.status ?? "active") === "active");
  const total = live.length;
  const categories = new Set(live.map((a) => a.category)).size;

  // Secondary signals the hero ticker cycles through — each a live count off the
  // same `live` set (so they track the directory, never hardcoded).
  const openSource = live.filter((a) => a.openSource).length;
  const freeToTry = live.filter((a) => a.pricing === "free" || a.pricing === "freemium").length;
  const selfHost = live.filter(
    (a) => a.deployment === "self-host" || a.deployment === "local" || a.deployment === "hybrid",
  ).length;

  // Top padding clears the pinned directory console (nav + search + category
  // strip) fixed-positioned in the shared header. The masthead is a plain block
  // (not a <header> — site-nav owns the one <header> landmark) and scrolls away
  // under the console.
  return (
    <div className="relative overflow-clip px-6 pt-40 pb-32 sm:pt-44">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={720}
        color="var(--color-accent)"
        opacity={0.07}
      />
      {/* A second, warmer orb low on the page breaks the long grid's flatness and
          threads the secondary brand colour through the scroll. Decorative +
          pointer-events-none (GlowOrb); the overflow-clip parent prevents CLS. */}
      <GlowOrb
        className="top-[58%] -left-40"
        size={640}
        color="var(--color-flame)"
        opacity={0.05}
      />

      <div className="container-site relative">
        <div className="mb-10 max-w-3xl">
          <h1 className="font-mono text-[clamp(1.2rem,7vw,3rem)] font-medium tracking-[0.02em] whitespace-nowrap text-[var(--color-ink)] uppercase [word-spacing:-0.1em]">
            AI Apps Directory
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            <span className="text-display text-[var(--color-ink-soft)]">The signal,</span>{" "}
            <span className="text-display text-[var(--color-accent)]">not the hype.</span>
          </p>
          <HeroStats
            total={total}
            categories={categories}
            metrics={[
              { value: openSource, label: "Open source" },
              { value: freeToTry, label: "Free to try" },
              { value: selfHost, label: "Self-host" },
            ]}
          />
        </div>

        {/* Fallback IS the first static HTML (ToolsBrowser bails to client via
            nuqs/useSearchParams). Reserve the carousel + filters-row space so
            hydration adds the real chrome without reflowing the grid — the grid
            stays content-first (real cards) for LCP/SEO. It renders exactly the
            hydrated grid's FIRST BATCH (active, newest-first — same comparator)
            rather than all ~460 listings: that kept / at ~6.6 MB of HTML for
            content no visitor ever saw. Crawl coverage of the full directory
            lives on /category/[slug] + /categories + the sitemap.
            NOTE: this Suspense is the route's ONLY loading boundary by design —
            a loading.tsx on this segment trips vercel/next.js#86151 (soft nav
            to /?category=… stuck on the fallback forever when the query was set
            shallowly by nuqs). /apps/[slug] dropped its loading.tsx for the
            same reason. See about/loading.tsx + BACKLOG.md [debt]. */}
        <Suspense
          fallback={
            <>
              <FeaturedCarouselSkeleton />
              <div aria-hidden className="mb-6 h-8" />
              <ToolGrid items={recentApps(allApps, BATCH_SIZE)} />
            </>
          }
        >
          <ToolsBrowser apps={allApps} />
        </Suspense>
      </div>

      {/* Slim CollectionPage — the old 459-entry hasPart blob (~40 KB of HTML
          on every load) moved to the per-category CollectionPages, where 5–40
          entries is the right altitude; the sitemap carries full coverage. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${brand.name} — AI Apps Directory`,
          url: siteUrl,
          description: metadata.description ?? undefined,
          numberOfItems: total,
        }}
      />
    </div>
  );
}
