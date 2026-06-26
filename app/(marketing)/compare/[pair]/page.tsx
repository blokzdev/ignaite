import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { CapabilityChip } from "@/components/tools/capability-chip";
import { ComparisonVerdict } from "@/components/tools/comparison-verdict";
import { buildMetadata, siteUrl } from "@/lib/seo";
import {
  DEPLOYMENT_LABEL,
  MODEL_KIND_LABEL,
  PLATFORM_LABEL,
  PRICING_LABEL,
} from "@/lib/tools/app-labels";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { categoryHref } from "@/lib/tools/facet-links";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";
import { comparisonHref, comparisonPairs, getComparison } from "@/lib/tools/comparisons";
import { computeCapabilityOverlap } from "@/lib/tools/capability-overlap";
import { groupCapabilitiesByFamily } from "@/lib/tools/capability-families";
import { buildComparisonVerdict } from "@/lib/tools/verdict";
import type { App, AppCapability } from "@/types/app";

interface PageProps {
  params: Promise<{ pair: string }>;
}

// One static page per eligible curated comparison — a build-time projection over
// two live `App` records. SSG, zero client JS: re-verify an app and the
// comparison reflects it on the next build with no per-page upkeep (it inherits
// the audit moat for free). `dynamicParams = false` 404s anything not in the
// curated set; the pair is validated by Set membership (getComparison), NEVER by
// splitting "-vs-" (an app slug can contain "vs").
export const dynamicParams = false;

export function generateStaticParams() {
  return comparisonPairs().map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const cmp = getComparison(pair);
  if (!cmp) return buildMetadata({ title: "Not found", path: `/compare/${pair}` });
  const { a, b } = cmp;
  return buildMetadata({
    title: `${a.name} vs ${b.name}`,
    description: `Compare ${a.name} and ${b.name} side by side — pricing, platforms, license, deployment, and model support, from Ignaite's AI-managed directory of AI apps.`,
    path: comparisonHref(a.slug, b.slug),
    // No per-pair OG yet (Chunk Y) — use the generated root card, like /category.
    ogImage: "/opengraph-image",
  });
}

const latestVerified = (a: App, b: App): string | null => {
  const dates = [a.lastVerifiedAt, b.lastVerifiedAt].filter((d): d is string => !!d);
  return dates.length ? dates.sort().at(-1)! : null;
};

interface Row {
  label: string;
  a: ReactNode;
  b: ReactNode;
  /** Raw comparable values — when they differ, the row is emphasized. */
  differs: boolean;
}

function buildRows(a: App, b: App): Row[] {
  const platformList = (x: App) => x.platforms.map((p) => PLATFORM_LABEL[p]).join(", ");
  const deployment = (x: App) => (x.deployment ? DEPLOYMENT_LABEL[x.deployment] : "—");
  const model = (x: App) => (x.modelSupport ? MODEL_KIND_LABEL[x.modelSupport.kind] : "—");
  const categoryCell = (x: App) => (
    <Link
      href={categoryHref(x.category)}
      className="rounded text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
    >
      {CATEGORY_LABEL[x.category]}
    </Link>
  );
  // Capability overlap powers the last row: each cell lists that app's leaves in
  // canonical family order, leaves shared by BOTH marked (Check + heavier ring).
  const overlap = computeCapabilityOverlap(a, b);
  const sharedSet = new Set<AppCapability>(overlap.shared);
  const capabilitiesCell = (x: App) => {
    const ids = groupCapabilitiesByFamily((x.capabilities ?? []).map((c) => c.id)).flatMap(
      (g) => g.ids,
    );
    if (ids.length === 0) return "—";
    return (
      <ul className="flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <li key={id}>
            <CapabilityChip id={id} shared={sharedSet.has(id)} />
          </li>
        ))}
      </ul>
    );
  };
  const rows: Row[] = [
    {
      label: "Category",
      a: categoryCell(a),
      b: categoryCell(b),
      differs: a.category !== b.category,
    },
    {
      label: "Pricing",
      a: PRICING_LABEL[a.pricing],
      b: PRICING_LABEL[b.pricing],
      differs: a.pricing !== b.pricing,
    },
    {
      label: "License",
      a: LICENSE_LABEL[licenseSignal(a)],
      b: LICENSE_LABEL[licenseSignal(b)],
      differs: licenseSignal(a) !== licenseSignal(b),
    },
    {
      label: "Deployment",
      a: deployment(a),
      b: deployment(b),
      differs: deployment(a) !== deployment(b),
    },
    {
      label: "Platforms",
      a: platformList(a),
      b: platformList(b),
      differs: platformList(a) !== platformList(b),
    },
    { label: "Model support", a: model(a), b: model(b), differs: model(a) !== model(b) },
    {
      label: "Vendor",
      a: a.vendor ?? "—",
      b: b.vendor ?? "—",
      differs: (a.vendor ?? "") !== (b.vendor ?? ""),
    },
  ];
  // Omit the row entirely when neither app has capabilities recorded (no empty
  // "Capabilities · — · —"); when one side is empty, it shows "—".
  const bothEmpty = (a.capabilities?.length ?? 0) === 0 && (b.capabilities?.length ?? 0) === 0;
  if (!bothEmpty) {
    rows.push({
      label: "Capabilities",
      a: capabilitiesCell(a),
      b: capabilitiesCell(b),
      differs: overlap.aOnly.length > 0 || overlap.bOnly.length > 0,
    });
  }
  return rows;
}

function AppColumn({ app }: { app: App }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-display text-2xl tracking-[-0.02em] text-[var(--color-ink)]">
          {app.name}
        </h2>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
          {CATEGORY_LABEL[app.category]}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{app.tagline}</p>
      <Link
        href={`/apps/${app.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        View {app.name}
        <ArrowRight aria-hidden className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function BriefColumn({ app }: { app: App }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset">
      <h3 className="text-display text-xl tracking-[-0.02em] text-[var(--color-ink)]">
        {app.name}
      </h3>
      {app.edge ? (
        <p className="mt-3 border-l-2 border-[var(--color-accent)] pl-3 text-sm leading-relaxed text-[var(--color-ink-soft)] italic">
          {app.edge}
        </p>
      ) : null}
      {app.pros?.length ? (
        <ul className="mt-4 space-y-1.5">
          {app.pros.map((pro) => (
            <li key={pro} className="flex gap-2 text-sm text-[var(--color-ink-soft)]">
              <Check
                aria-hidden
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-success)]"
              />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {app.cons?.length ? (
        <ul className="mt-3 space-y-1.5">
          {app.cons.map((con) => (
            <li key={con} className="flex gap-2 text-sm text-[var(--color-ink-dim)]">
              <Minus aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function ComparePage({ params }: PageProps) {
  const { pair } = await params;
  const cmp = getComparison(pair);
  if (!cmp) notFound();

  const { a, b } = cmp;
  const rows = buildRows(a, b);
  const sameCat = a.category === b.category;
  const verified = latestVerified(a, b);
  const hasBrief = !!(
    a.edge ||
    a.pros?.length ||
    a.cons?.length ||
    b.edge ||
    b.pros?.length ||
    b.cons?.length
  );

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
                href="/compare"
                className="rounded transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                Compare
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              {a.name} vs {b.name}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-display text-4xl tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl">
            {a.name} <span className="text-[var(--color-accent)]">vs</span> {b.name}
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            A side-by-side comparison of {a.name} and {b.name}
            {sameCat ? `, two ${CATEGORY_LABEL[a.category]} tools` : ""}, drawn from Ignaite&apos;s
            continuously-verified listings.
          </p>
          {verified ? (
            <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
              Compared from listings verified as of <time dateTime={verified}>{verified}</time>
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <AppColumn app={a} />
          <AppColumn app={b} />
        </div>

        <section className="mt-12" aria-labelledby="spec-heading">
          <h2
            id="spec-heading"
            className="text-eyebrow mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
          >
            At a glance
          </h2>
          <div className="overflow-x-auto rounded-2xl ring-1 ring-white/[0.08]">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Feature comparison of {a.name} and {b.name}
              </caption>
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th
                    scope="col"
                    className="p-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
                  >
                    Attribute
                  </th>
                  <th scope="col" className="p-4 text-[var(--color-ink)]">
                    {a.name}
                  </th>
                  <th scope="col" className="p-4 text-[var(--color-ink)]">
                    {b.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.05] last:border-0">
                    <th
                      scope="row"
                      className="p-4 align-top font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
                    >
                      {row.label}
                      {row.differs ? <span className="sr-only"> (differs)</span> : null}
                    </th>
                    <td
                      className={
                        row.differs
                          ? "p-4 align-top text-[var(--color-ink)]"
                          : "p-4 align-top text-[var(--color-ink-soft)]"
                      }
                    >
                      {row.a}
                    </td>
                    <td
                      className={
                        row.differs
                          ? "p-4 align-top text-[var(--color-ink)]"
                          : "p-4 align-top text-[var(--color-ink-soft)]"
                      }
                    >
                      {row.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {hasBrief ? (
          <section className="mt-12" aria-labelledby="brief-heading">
            <h2
              id="brief-heading"
              className="text-eyebrow mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
            >
              The honest brief
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <BriefColumn app={a} />
              <BriefColumn app={b} />
            </div>
          </section>
        ) : null}

        <ComparisonVerdict verdict={buildComparisonVerdict(a, b)} />

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href={`/apps/${a.slug}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            {a.name} details
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/apps/${b.slug}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            {b.name} details
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
          {sameCat ? (
            <Link
              href={categoryHref(a.category)}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              All {CATEGORY_LABEL[a.category]} apps
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${a.name} vs ${b.name} — Ignaite`,
          url: `${siteUrl}${comparisonHref(a.slug, b.slug)}`,
          description: `A side-by-side comparison of ${a.name} and ${b.name} from Ignaite's AI-managed directory.`,
          isPartOf: { "@type": "WebSite", name: "Ignaite", url: siteUrl },
          // Exactly the two apps under comparison — the right altitude for crawl
          // coverage; no Review/FAQPage markup (we carry no review/Q&A data).
          hasPart: [a, b].map((x) => ({
            "@type": "SoftwareApplication",
            name: x.name,
            url: `${siteUrl}/apps/${x.slug}`,
            applicationCategory: CATEGORY_LABEL[x.category],
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Directory", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Compare", item: `${siteUrl}/compare` },
            {
              "@type": "ListItem",
              position: 3,
              name: `${a.name} vs ${b.name}`,
              item: `${siteUrl}${comparisonHref(a.slug, b.slug)}`,
            },
          ],
        }}
      />
    </div>
  );
}
