import Link from "next/link";
import { Archive, ArrowUpRight, BookOpen, Check, Lightbulb, Minus, Target } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { AccuracyNote } from "@/components/tools/accuracy-note";
import { AppDetailShell } from "@/components/detail/app-detail-shell";
import { DetailActionBar } from "@/components/detail/detail-action-bar";
import { DetailToolbar } from "@/components/detail/detail-toolbar";
import { DossierRail } from "@/components/detail/dossier-rail";
import { Masthead } from "@/components/detail/masthead";
import { StatStrip } from "@/components/detail/stat-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedRail } from "@/components/tools/related-rail";
import { ShowMore } from "@/components/tools/show-more";
import { ToolCard } from "@/components/tools/tool-card";
import { alternativeApps, relatedApps } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/seo";
import { buildAppJson, buildAppMarkdown } from "@/lib/tools/app-export";
import { categoryHref } from "@/lib/tools/facet-links";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { PLATFORM_LABEL } from "@/lib/tools/app-labels";
import type { App } from "@/types/app";

interface Props {
  app: App;
}

// A "Worth knowing" / "The edge" signal card. A lone signal spans both columns.
function Signal({
  icon: Icon,
  tone,
  label,
  children,
  full,
}: Readonly<{
  icon: typeof Lightbulb;
  tone: "accent" | "flame";
  label: string;
  children: ReactNode;
  full: boolean;
}>) {
  const isAccent = tone === "accent";
  const box = isAccent
    ? "bg-[var(--color-accent)]/[0.06] ring-[var(--color-accent)]/20"
    : "bg-[var(--color-flame)]/[0.06] ring-[var(--color-flame)]/20";
  const fg = isAccent ? "text-[var(--color-accent)]" : "text-[var(--color-flame)]";
  return (
    <aside
      className={cn(
        "flex items-start gap-3 rounded-2xl p-5 ring-1 ring-inset",
        box,
        full && "sm:col-span-2",
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 h-4 w-4 shrink-0", fg)} />
      <div>
        <p className={cn("font-mono text-[10px] tracking-[0.16em] uppercase", fg)}>{label}</p>
        <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink)]">{children}</p>
      </div>
    </aside>
  );
}

export function AppDetail({ app }: Readonly<Props>): ReactElement {
  const isArchived = app.status === "archived";
  // The single "what else to consider" rail is curated-aware: hand-picked
  // `alternatives` (editorial, may cross categories) take over when present,
  // otherwise the derived same-category "Related" list is the fallback.
  const alternatives = alternativeApps(app);
  const railApps = alternatives.length > 0 ? alternatives : relatedApps(app.slug, 10);
  const railTitle =
    alternatives.length > 0 ? `Alternatives to ${app.name} (${alternatives.length})` : undefined;
  // Hex (not the CSS var) so the `${accent}26`-style alpha-suffix gradients
  // stay valid; #08D9D6 is --color-accent's value.
  const accent = app.accentColor ?? "#08D9D6";
  const shareUrl = `${siteUrl}/apps/${app.slug}`;
  // Share/export payloads, generated once at SSG time and handed to the menu
  // placements (masthead ≥sm, action bar <sm) as plain strings.
  const exportMarkdown = buildAppMarkdown(app, shareUrl);
  const exportJson = buildAppJson(app, shareUrl);

  return (
    <AppDetailShell
      accent={accent}
      toolbar={<DetailToolbar appName={app.name} shareUrl={shareUrl} />}
      actionBar={<DetailActionBar app={app} markdown={exportMarkdown} json={exportJson} />}
    >
      <Masthead
        app={app}
        accent={accent}
        shareUrl={shareUrl}
        markdown={exportMarkdown}
        json={exportJson}
      />

      {isArchived && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-[var(--color-warn)]/[0.08] p-4 ring-1 ring-[var(--color-warn)]/25 ring-inset">
          <Archive aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warn)]" />
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
            This listing is <span className="font-medium text-[var(--color-ink)]">archived</span> —
            the app was discontinued or sunset. Its links may no longer resolve; it&apos;s kept as a
            historical record.
          </p>
        </div>
      )}

      <StatStrip app={app} accent={accent} />

      {/* Two zones: the brief (story + signals) and the dossier (reference). */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        {/* The brief */}
        <div className="min-w-0">
          {/* Description leads — the story before the spec sheet. */}
          <ShowMore
            collapsedRem={12}
            className="max-w-[68ch] text-base leading-relaxed text-[var(--color-ink)] sm:text-lg"
          >
            <p>{app.description}</p>
            {app.longDescription && <p className="mt-4">{app.longDescription}</p>}
          </ShowMore>

          {/* Signals — Worth knowing + The edge, side by side on sm+. */}
          {(app.insight || app.edge) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {app.insight && (
                <Signal icon={Lightbulb} tone="accent" label="Worth knowing" full={!app.edge}>
                  {app.insight}
                </Signal>
              )}
              {app.edge && (
                <Signal icon={Target} tone="flame" label="The edge" full={!app.insight}>
                  {app.edge}
                </Signal>
              )}
            </div>
          )}

          {/* Trade-offs — the honest, balanced read. */}
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

          {/* Tags — deep-links into the directory search (the q predicate
              matches tags), not tag landing pages: 793 distinct free-form tags,
              59% singletons — see BACKLOG [future] for curated tag pages. */}
          {app.tags && app.tags.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Tags
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {app.tags.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/?q=${encodeURIComponent(t)}`}
                      aria-label={`Search the directory for ${t}`}
                      className="inline-flex rounded-full bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-dim)]/90 ring-1 ring-transparent transition-colors hover:bg-white/[0.06] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                    >
                      #{t}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Further reading — curated third-party coverage. */}
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
        </div>

        {/* The dossier — sticky reference sidebar (stacks after the brief < lg). */}
        <div className="lg:sticky lg:top-[calc(min(var(--nav-h),var(--nav-row-h))_+_var(--detail-toolbar-h)_+_1rem)] lg:self-start">
          <DossierRail app={app} accent={accent} />
        </div>
      </div>

      {/* Alternatives / Related — full-width below the zones. */}
      {railApps.length > 0 && (
        <RelatedRail
          categoryLabel={CATEGORY_LABEL[app.category]}
          title={railTitle}
          viewAllHref={categoryHref(app.category)}
        >
          {railApps.map((r) => (
            <li key={r.slug} className="flex w-[320px] shrink-0 snap-start sm:w-[380px]">
              <ToolCard app={r} />
            </li>
          ))}
        </RelatedRail>
      )}

      {/* Maintenance note — blurb-only last word (the change history + freshness
          stamp live in the dossier's provenance footer, where #history anchors). */}
      <AccuracyNote appName={app.name} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: app.name,
          description: app.description,
          applicationCategory: CATEGORY_LABEL[app.category],
          operatingSystem: app.platforms.map((p) => PLATFORM_LABEL[p]).join(", "),
          url: `${siteUrl}/apps/${app.slug}`,
          // Entity resolution — the app's own web presence (vendor site, repo,
          // social), pulled from the verified links. Omitted when empty.
          sameAs: (() => {
            const urls = app.links
              .filter((l) => l.kind === "website" || l.kind === "github" || l.kind === "twitter")
              .map((l) => l.url);
            return urls.length > 0 ? urls : undefined;
          })(),
          publisher: app.vendor ? { "@type": "Organization", name: app.vendor } : undefined,
          datePublished: app.addedAt,
          // Latest of the freshness stamp and the newest recorded change.
          dateModified:
            [app.lastVerifiedAt, ...(app.changelog ?? []).map((c) => c.date)]
              .filter((d): d is string => Boolean(d))
              .sort()
              .at(-1) ?? app.lastVerifiedAt,
          // Offers map COST tiers only (openSource is a license signal, not a
          // price): free/freemium have a true $0 entry point; paid/byo-key get
          // NO offers block — omitting beats fabricating a price.
          offers:
            app.pricing === "free"
              ? { "@type": "Offer", price: "0", priceCurrency: "USD" }
              : app.pricing === "freemium"
                ? {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    description: "Free tier; paid plans available",
                  }
                : undefined,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Directory", item: siteUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: CATEGORY_LABEL[app.category],
              item: `${siteUrl}${categoryHref(app.category)}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: app.name,
              item: `${siteUrl}/apps/${app.slug}`,
            },
          ],
        }}
      />
    </AppDetailShell>
  );
}
