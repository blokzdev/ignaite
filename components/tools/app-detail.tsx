import Link from "next/link";
import { ArrowUpRight, BookOpen, Check, Lightbulb, Minus, Target } from "lucide-react";
import type { ReactElement } from "react";
import { AccuracyNote } from "@/components/tools/accuracy-note";
import { AppDetailShell } from "@/components/detail/app-detail-shell";
import { DetailActionBar } from "@/components/detail/detail-action-bar";
import { DetailToolbar } from "@/components/detail/detail-toolbar";
import { SpecCard } from "@/components/detail/spec-card";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedRail } from "@/components/tools/related-rail";
import { ShowMore } from "@/components/tools/show-more";
import { ToolCard } from "@/components/tools/tool-card";
import { alternativeApps, relatedApps } from "@/lib/apps";
import { siteUrl } from "@/lib/seo";
import { buildAppJson, buildAppMarkdown } from "@/lib/tools/app-export";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { facetHref } from "@/lib/tools/facet-links";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";
import { PLATFORM_LABEL, PRICING_LABEL } from "@/lib/tools/app-labels";
import type { App } from "@/types/app";

interface Props {
  app: App;
}

export function AppDetail({ app }: Readonly<Props>): ReactElement {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const isArchived = app.status === "archived";
  // The single "what else to consider" rail is curated-aware: hand-picked
  // `alternatives` (editorial, may cross categories) take over when present,
  // otherwise the derived same-category "Related" list is the fallback.
  const alternatives = alternativeApps(app);
  const railApps = alternatives.length > 0 ? alternatives : relatedApps(app.slug, 10);
  const railTitle = alternatives.length > 0 ? `Alternatives to ${app.name}` : undefined;
  // Hex (not the CSS var) so the `${accent}26`-style alpha-suffix gradients below
  // and in the toolbar/spec-card stay valid; #08D9D6 is --color-accent's value.
  const accent = app.accentColor ?? "#08D9D6";
  const shareUrl = `${siteUrl}/apps/${app.slug}`;
  const license = licenseSignal(app);
  // Share/export payloads, generated once at SSG time and handed to both menu
  // placements (spec card ≥sm, action bar <sm) as plain strings.
  const exportMarkdown = buildAppMarkdown(app, shareUrl);
  const exportJson = buildAppJson(app, shareUrl);
  // Key facets mirrored into the toolbar's compact (scrolled) state on desktop.
  const toolbarFacets = [
    { label: CATEGORY_LABEL[app.category], href: facetHref("category", app.category) },
    { label: PRICING_LABEL[app.pricing], href: facetHref("pricing", app.pricing) },
    { label: LICENSE_LABEL[license], href: facetHref("license", license) },
  ];

  return (
    <AppDetailShell
      accent={accent}
      dimmed={isArchived}
      toolbar={
        <DetailToolbar
          breadcrumb={[{ label: "Directory", href: "/" }, { label: app.name }]}
          shareUrl={shareUrl}
          name={app.name}
          monogram={monogram}
          accent={accent}
          openHref={primary?.url ?? "/"}
          facets={toolbarFacets}
        />
      }
      actionBar={<DetailActionBar app={app} markdown={exportMarkdown} json={exportJson} />}
    >
      {/* Hero (full width) */}
      <header className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-base tracking-[0.08em] uppercase ring-1 ring-white/[0.08] ring-inset sm:h-20 sm:w-20"
          style={{
            background: `linear-gradient(135deg, ${accent}26, transparent)`,
            color: accent,
          }}
        >
          {monogram}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
            {CATEGORY_LABEL[app.category]}
            {app.vendor ? ` · ${app.vendor}` : ""}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-display text-[var(--color-ink)]">{app.name}</span>
          </h1>
          <p className="mt-3 text-base text-[var(--color-ink-dim)] sm:text-lg">{app.tagline}</p>
        </div>
      </header>

      {/* Sentinel: when this passes under the sticky toolbar, the toolbar swaps
          to its compact app-identity state. */}
      <div id="hero-sentinel" aria-hidden className="h-px w-full" />

      {/* Two-column: reading column + sticky spec sidebar (stacks on < lg, with
          the spec card surfaced above the prose). */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="order-2 min-w-0 lg:order-1 [&>:first-child]:mt-0">
          {/* Worth knowing — one verifiable, non-obvious FACT about the listing
              the description doesn't carry. Distinct from "The edge". */}
          {app.insight && (
            <aside className="mt-2 flex items-start gap-3 rounded-2xl bg-[var(--color-accent)]/[0.06] p-5 ring-1 ring-[var(--color-accent)]/20 ring-inset">
              <Lightbulb
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
              />
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent)] uppercase">
                  Worth knowing
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink)]">
                  {app.insight}
                </p>
              </div>
            </aside>
          )}

          {/* Edge — the comparative signal: why pick this over its category peers. */}
          {app.edge && (
            <aside className="mt-4 flex items-start gap-3 rounded-2xl bg-[var(--color-flame)]/[0.06] p-5 ring-1 ring-[var(--color-flame)]/20 ring-inset">
              <Target aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-flame)]" />
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-flame)] uppercase">
                  The edge
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink)]">
                  {app.edge}
                </p>
              </div>
            </aside>
          )}

          {/* Description — clamped with a Show more/less reveal when it runs long
              (the full text stays in the DOM for SEO + screen readers). */}
          <ShowMore className="mt-8 max-w-[68ch] text-base leading-relaxed text-[var(--color-ink)] sm:text-lg">
            <p>{app.description}</p>
            {app.longDescription && <p className="mt-4">{app.longDescription}</p>}
          </ShowMore>

          {/* Pros & Cons — the honest, balanced read. */}
          {((app.pros && app.pros.length > 0) || (app.cons && app.cons.length > 0)) && (
            <section className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Pros &amp; cons
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {app.pros && app.pros.length > 0 && (
                  <div className="rounded-2xl bg-[var(--color-success)]/[0.06] p-5 ring-1 ring-[var(--color-success)]/15 ring-inset">
                    <ul className="flex flex-col gap-2.5">
                      {app.pros.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]"
                        >
                          <Check
                            aria-hidden
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-success)]"
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {app.cons && app.cons.length > 0 && (
                  <div className="rounded-2xl bg-[var(--color-warn)]/[0.06] p-5 ring-1 ring-[var(--color-warn)]/15 ring-inset">
                    <ul className="flex flex-col gap-2.5">
                      {app.cons.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]"
                        >
                          <Minus
                            aria-hidden
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-warn)]"
                          />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Best for — use-case / audience descriptors. */}
          {app.bestFor && app.bestFor.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Best for
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {app.bestFor.map((b) => (
                  <li
                    key={b}
                    className="rounded-full bg-[var(--color-accent)]/[0.08] px-3 py-1 text-sm text-[var(--color-ink)] ring-1 ring-[var(--color-accent)]/20 ring-inset"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Tags
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {app.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-dim)]/90"
                  >
                    #{t}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Further reading — curated third-party coverage (independent of the
              vendor): reviews, guides, benchmarks, comparisons. */}
          {app.references && app.references.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Further reading
              </p>
              <ul className="mt-3 flex flex-col divide-y divide-white/[0.06] overflow-hidden rounded-2xl ring-1 ring-white/[0.06] ring-inset">
                {app.references.map((ref) => (
                  <li key={ref.url}>
                    <Link
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                    >
                      <BookOpen
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-dim)]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                          {ref.title}
                        </span>
                        {(ref.source || ref.kind) && (
                          <span className="mt-0.5 block font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                            {[ref.source, ref.kind].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)] group-hover:text-[var(--color-accent)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isArchived && (
            <p className="mt-10 max-w-xl text-sm text-[var(--color-ink-dim)]">
              This entry is archived — the primary link may no longer resolve. Kept here as a
              historical record.
            </p>
          )}
        </div>

        {/* Spec card — sticky on desktop, surfaced first on mobile/tablet. */}
        <div className="order-1 lg:sticky lg:top-[calc(min(var(--nav-h),var(--nav-row-h))_+_var(--detail-toolbar-h)_+_1rem)] lg:order-2 lg:self-start">
          <SpecCard
            app={app}
            accent={accent}
            shareUrl={shareUrl}
            markdown={exportMarkdown}
            json={exportJson}
          />
        </div>
      </div>

      {/* Alternatives / Related — full-width below the grid. Curated-aware:
          hand-picked `alternatives` ("Alternatives to <name>", may cross
          categories) when present, else the derived same-category "Related". */}
      {railApps.length > 0 && (
        <RelatedRail categoryLabel={CATEGORY_LABEL[app.category]} title={railTitle}>
          {railApps.map((r) => (
            <li key={r.slug} className="flex w-[320px] shrink-0 snap-start sm:w-[380px]">
              <ToolCard app={r} />
            </li>
          ))}
        </RelatedRail>
      )}

      {/* Maintenance ledger — disclaimer + change-history timeline + last
          verified + correction CTA (one cohesive provenance card). */}
      <AccuracyNote
        appName={app.name}
        addedAt={app.addedAt}
        lastVerifiedAt={app.lastVerifiedAt}
        changelog={app.changelog}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: app.name,
          description: app.description,
          applicationCategory: CATEGORY_LABEL[app.category],
          operatingSystem: app.platforms.map((p) => PLATFORM_LABEL[p]).join(", "),
          url: `${siteUrl}/apps/${app.slug}`,
          publisher: app.vendor ? { "@type": "Organization", name: app.vendor } : undefined,
          datePublished: app.addedAt,
          // Latest of the freshness stamp and the newest recorded change.
          dateModified:
            [app.lastVerifiedAt, ...(app.changelog ?? []).map((c) => c.date)]
              .filter((d): d is string => Boolean(d))
              .sort()
              .at(-1) ?? app.lastVerifiedAt,
          offers:
            app.pricing === "free" || app.openSource
              ? {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                }
              : undefined,
        }}
      />
    </AppDetailShell>
  );
}
