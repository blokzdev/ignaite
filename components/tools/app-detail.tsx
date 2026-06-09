import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ExternalLink,
  Globe,
  MessageCircle,
  Minus,
  Play,
  Smartphone,
  Sparkles,
  Tag,
  Target,
  Terminal,
} from "lucide-react";
import type { ComponentType, ReactElement } from "react";
import { AccuracyNote } from "@/components/tools/accuracy-note";
import { DetailShell } from "@/components/detail/detail-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedRail } from "@/components/tools/related-rail";
import { ShowMore } from "@/components/tools/show-more";
import { ToolCard } from "@/components/tools/tool-card";
import { alternativeApps, relatedApps } from "@/lib/apps";
import { siteUrl } from "@/lib/seo";
import { licenseSignal } from "@/lib/tools/license";
import type {
  App,
  AppDeployment,
  AppLinkKind,
  AppPlatform,
  AppPricing,
  ModelSupportKind,
} from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";

const DEPLOYMENT_LABEL: Record<AppDeployment, string> = {
  cloud: "Cloud",
  "self-host": "Self-host",
  local: "Local",
  hybrid: "Hybrid",
};

// GitHub branded icon: lucide-react 1.x dropped it; ship our own glyph.
function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.55v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.75.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const PRICING_LABEL: Record<AppPricing, string> = {
  free: "FREE",
  freemium: "FREEMIUM",
  paid: "PAID",
  "byo-key": "BYO KEY",
};

const MODEL_KIND_LABEL: Record<ModelSupportKind, string> = {
  "single-model": "Single model (proprietary)",
  "multi-model": "Multi-model",
  "byo-key": "BYO key / model",
  "model-agnostic": "Model-agnostic",
  "self-contained": "Self-contained (on-device)",
};

const PLATFORM_LABEL: Record<AppPlatform, string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  cli: "CLI",
  api: "API",
  "browser-extension": "Browser extension",
  "vscode-extension": "VS Code extension",
};

const PLATFORM_ICON: Record<AppPlatform, ComponentType<{ className?: string }>> = {
  web: Globe,
  ios: Smartphone,
  android: Smartphone,
  macos: Globe,
  windows: Globe,
  linux: Terminal,
  cli: Terminal,
  api: Terminal,
  "browser-extension": Globe,
  "vscode-extension": Terminal,
};

const LINK_ICON: Record<AppLinkKind, ComponentType<{ className?: string }>> = {
  website: ExternalLink,
  docs: BookOpen,
  github: GithubGlyph,
  pricing: Tag,
  demo: Play,
  video: Play,
  twitter: ExternalLink,
  discord: MessageCircle,
};

const LINK_LABEL: Record<AppLinkKind, string> = {
  website: "Website",
  docs: "Docs",
  github: "GitHub",
  pricing: "Pricing",
  demo: "Demo",
  video: "Video",
  twitter: "Twitter",
  discord: "Discord",
};

interface Props {
  app: App;
}

export function AppDetail({ app }: Readonly<Props>): ReactElement {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const secondaries = app.links.filter((l) => l !== primary);
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const isArchived = app.status === "archived";
  const license = licenseSignal(app);
  // The single "what else to consider" rail is curated-aware: hand-picked
  // `alternatives` (editorial, may cross categories) take over when present,
  // otherwise the derived same-category "Related" list is the fallback.
  const alternatives = alternativeApps(app);
  const railApps = alternatives.length > 0 ? alternatives : relatedApps(app.slug, 10);
  const railTitle = alternatives.length > 0 ? `Alternatives to ${app.name}` : undefined;
  const accent = app.accentColor ?? "var(--color-accent)";

  return (
    <DetailShell
      accent={accent}
      dimmed={isArchived}
      breadcrumb={[{ label: "Directory", href: "/" }, { label: app.name }]}
      shareUrl={`${siteUrl}/apps/${app.slug}`}
      sticky={{ href: primary?.url ?? "/", label: `Open ${app.name}` }}
    >
      {/* Hero */}
      <header className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-base tracking-[0.08em] uppercase ring-1 ring-white/[0.08] ring-inset sm:h-20 sm:w-20"
          style={{
            background: `linear-gradient(135deg, ${app.accentColor ?? "#08D9D6"}26, transparent)`,
            color: app.accentColor ?? "var(--color-accent)",
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

      {/* Chip row */}
      <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset">
          {PRICING_LABEL[app.pricing]}
        </span>
        {license === "oss" && (
          <span className="rounded-full bg-[var(--color-success)]/[0.12] px-2 py-0.5 text-[var(--color-success)] ring-1 ring-[var(--color-success)]/30 ring-inset">
            Open source
          </span>
        )}
        {license === "core" && (
          <span className="rounded-full bg-[var(--color-violet)]/[0.14] px-2 py-0.5 text-[var(--color-violet)] ring-1 ring-[var(--color-violet)]/30 ring-inset">
            Open core
          </span>
        )}
        {app.deployment && (
          <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset">
            {DEPLOYMENT_LABEL[app.deployment]}
          </span>
        )}
        {app.platforms.map((p) => (
          <span
            key={p}
            className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset"
          >
            {PLATFORM_LABEL[p]}
          </span>
        ))}
        {isArchived && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.10] ring-inset">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-[var(--color-ink-dim)]"
            />
            Archived
          </span>
        )}
      </div>

      {/* AI insight — the directory's signature signal, authored by Claude Code
          while researching the listing. */}
      {app.insight && (
        <aside className="mt-10 flex items-start gap-3 rounded-2xl bg-[var(--color-accent)]/[0.06] p-5 ring-1 ring-[var(--color-accent)]/20 ring-inset">
          <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent)] uppercase">
              AI insight
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink)]">
              {app.insight}
            </p>
          </div>
        </aside>
      )}

      {/* Edge — the comparative signal: why pick this over its category peers.
          Paired with AI insight but tinted ember to read as a distinct signal. */}
      {app.edge && (
        <aside className="mt-4 flex items-start gap-3 rounded-2xl bg-[var(--color-flame)]/[0.06] p-5 ring-1 ring-[var(--color-flame)]/20 ring-inset">
          <Target aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-flame)]" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-flame)] uppercase">
              The edge
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink)]">{app.edge}</p>
          </div>
        </aside>
      )}

      {/* Description — clamped with a Show more/less reveal when it runs long
          (the full text stays in the DOM for SEO + screen readers). */}
      <ShowMore className="mt-12 text-base leading-relaxed text-[var(--color-ink)] sm:text-lg">
        <p>{app.description}</p>
        {app.longDescription && <p className="mt-4">{app.longDescription}</p>}
      </ShowMore>

      {/* Pros & Cons — the honest, balanced read. Either column may be present
          on its own; the grid collapses to one column when so. */}
      {((app.pros && app.pros.length > 0) || (app.cons && app.cons.length > 0)) && (
        <section className="mt-12">
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

      {/* Model support */}
      {app.modelSupport && (
        <section className="mt-12 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/[0.06] ring-inset">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
            Model support
          </p>
          <h2 className="mt-2 text-xl font-medium text-[var(--color-ink)]">
            {MODEL_KIND_LABEL[app.modelSupport.kind]}
          </h2>
          {app.modelSupport.models && app.modelSupport.models.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {app.modelSupport.models.map((m) => (
                <li
                  key={m}
                  className="rounded-full bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
          {app.modelSupport.notes && (
            <p className="mt-3 text-sm text-[var(--color-ink-dim)]">{app.modelSupport.notes}</p>
          )}
        </section>
      )}

      {/* Platforms detail */}
      <section className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Where it runs
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {app.platforms.map((p) => {
            const Icon = PLATFORM_ICON[p];
            return (
              <li
                key={p}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset"
              >
                <Icon className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
                {PLATFORM_LABEL[p]}
              </li>
            );
          })}
        </ul>
      </section>

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

      {/* CTAs */}
      <section className="mt-12 flex flex-wrap items-center gap-3">
        {primary && (
          <Link
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)]"
          >
            Open {app.name}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
        {secondaries.map((link) => {
          const Icon = LINK_ICON[link.kind];
          return (
            <Link
              key={`${link.kind}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.04] px-5 font-mono text-xs tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08]"
            >
              <Icon className="h-3.5 w-3.5" />
              {LINK_LABEL[link.kind]}
            </Link>
          );
        })}
      </section>

      {isArchived && (
        <p className="mt-4 max-w-xl text-sm text-[var(--color-ink-dim)]">
          This entry is archived — the primary URL above may no longer resolve. Kept here as a
          historical record.
        </p>
      )}

      {/* Alternatives / Related — one curated-aware rail: hand-picked
          `alternatives` ("Alternatives to <name>", may cross categories) when
          present, else the derived same-category "Related in <category>". The
          ToolCard slots render server-side and pass into the client rail as
          children, keeping ToolCard off this route's client bundle (§6). */}
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
    </DetailShell>
  );
}
