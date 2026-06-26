import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { BarChart } from "@/components/insights/bar-chart";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { directoryStats } from "@/lib/stats";

// /insights — a build-time data-viz layer over Ignaite's own corpus. Pure RSC,
// hand-rolled SSG charts (no charting dep, 0 B route JS). Regenerated every
// build, so it's never stale; every chart is grounded in the verified directory
// data and deep-links back into the grid. Distributions over partially-populated
// fields carry an explicit coverage caveat — we never imply 100% or fabricate a
// value for an unset field.

export const metadata: Metadata = buildMetadata({
  title: "Directory insights",
  description:
    "Live data on the AI-app landscape, drawn from Ignaite's continuously-verified directory: pricing mix, category coverage, platform reach, license and model-support breakdowns. Regenerated every build.",
  path: "/insights",
  ogImage: "/opengraph-image",
});

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset">
      <div className="text-display text-3xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
        {label}
      </div>
    </div>
  );
}

function ChartSection({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] ring-inset"
    >
      <h2
        id={id}
        className="text-display text-xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-2xl"
      >
        {title}
      </h2>
      {note ? (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">{note}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const coverageNote = (recorded: number, total: number, field: string): string =>
  `${field} recorded for ${recorded.toLocaleString()} of ${total.toLocaleString()} listings (${Math.round(
    (recorded / total) * 100,
  )}%) — the rest are shown as unrecorded, never assumed.`;

// Capabilities are multi-valued, so there's no "unrecorded" slice to show; the
// honest figure is how many listings carry any capability at all.
const capabilityCoverageNote = (enriched: number, total: number): string =>
  `Capabilities recorded for ${enriched.toLocaleString()} of ${total.toLocaleString()} listings (${Math.round(
    (enriched / total) * 100,
  )}%) — the rest carry none yet, never assumed.`;

export default function InsightsPage() {
  const s = directoryStats();

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
              Insights
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            Directory <span className="text-[var(--color-accent)]">insights</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            A live read on the AI-app landscape — pricing, categories, platforms, licensing, and
            model support — computed straight from Ignaite&apos;s continuously-verified listings.
            Regenerated on every build, so it&apos;s never stale; every number links back to the
            grid it came from.
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            Data as of <time dateTime={s.generatedAt}>{s.generatedAt}</time> ·{" "}
            {s.totalActive.toLocaleString()} active listings
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile value={s.totalActive.toLocaleString()} label="Active listings" />
          <StatTile value={String(s.categories.clusters.length)} label="Clusters" />
          <StatTile value={`${s.freshness.pctWithin30}%`} label="Verified ≤30 days" />
          <StatTile
            value={s.freshness.medianAgeDays === null ? "—" : `${s.freshness.medianAgeDays}d`}
            label="Median verified age"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <ChartSection id="pricing" title="Pricing mix">
            <BarChart slices={s.pricing.slices} total={s.pricing.total} />
          </ChartSection>

          <ChartSection
            id="platforms"
            title="Platform reach"
            note="Most listings run on more than one platform, so these sum above the listing total — each bar is the share of listings available on that platform."
          >
            <BarChart slices={s.platforms} total={s.totalActive} />
          </ChartSection>

          <ChartSection
            id="license"
            title="Open-source footprint"
            note={coverageNote(s.license.recorded ?? 0, s.license.total, "Open-source status")}
          >
            <BarChart slices={s.license.slices} total={s.license.total} />
          </ChartSection>

          <ChartSection
            id="deployment"
            title="Deployment model"
            note={coverageNote(s.deployment.recorded ?? 0, s.deployment.total, "Deployment")}
          >
            <BarChart slices={s.deployment.slices} total={s.deployment.total} />
          </ChartSection>

          <ChartSection
            id="model-support"
            title="Model support"
            note={coverageNote(s.modelSupport.recorded ?? 0, s.modelSupport.total, "Model support")}
          >
            <BarChart slices={s.modelSupport.slices} total={s.modelSupport.total} />
          </ChartSection>
        </div>

        <section aria-labelledby="categories" className="mt-12">
          <h2
            id="categories"
            className="text-display text-2xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-3xl"
          >
            Category coverage
          </h2>
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-[var(--color-ink-dim)]">
            By each listing&apos;s canonical primary category, so the cluster totals reconcile
            exactly to the {s.categories.total.toLocaleString()} active listings (secondary
            memberships would double-count).
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {s.categories.clusters.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] ring-inset"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-display text-lg tracking-[-0.02em] text-[var(--color-ink)]">
                    {c.label}
                  </h3>
                  <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                    {c.total.toLocaleString()}
                  </span>
                </div>
                <BarChart slices={c.categories} total={s.categories.total} />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="capabilities" className="mt-12">
          <h2
            id="capabilities"
            className="text-display text-2xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-3xl"
          >
            Capability coverage
          </h2>
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-[var(--color-ink-dim)]">
            By task capability, grouped into {s.capabilities.families.length} families. A listing
            carries up to 6 capabilities, so these bars sum above the listing total — each is the
            share of listings with at least one capability in that family.{" "}
            {capabilityCoverageNote(s.capabilities.enriched, s.capabilities.total)}
          </p>
          <div className="mt-6">
            <BarChart slices={s.capabilities.families} total={s.capabilities.total} />
          </div>
        </section>

        <p className="mt-12 max-w-[68ch] text-sm leading-relaxed text-[var(--color-ink-dim)]">
          Every figure here is recomputed from the live directory on each deploy and researched
          &amp; kept current by Claude Code — no hand-maintained numbers, no estimates.{" "}
          <Link
            href="/about"
            className="rounded text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            How we keep it current →
          </Link>
        </p>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Ignaite AI-app directory insights",
          description:
            "Aggregate statistics on the AI-app landscape — pricing, category, platform, license, and model-support distributions — derived from Ignaite's continuously-verified directory.",
          url: `${siteUrl}/insights`,
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: "Ignaite", url: siteUrl },
          dateModified: s.generatedAt,
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
          keywords: [
            "AI apps",
            "AI tools",
            "pricing distribution",
            "open source AI",
            "AI directory statistics",
          ],
        }}
      />
    </div>
  );
}
