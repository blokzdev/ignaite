import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Globe,
  MessageCircle,
  Play,
  Smartphone,
  Sparkles,
  Tag,
  Terminal,
} from "lucide-react";
import type { ComponentType, ReactElement } from "react";
import { DetailShell } from "@/components/detail/detail-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedRail } from "@/components/tools/related-rail";
import { ToolCard } from "@/components/tools/tool-card";
import { relatedApps } from "@/lib/apps";
import { siteUrl } from "@/lib/seo";
import { licenseSignal } from "@/lib/tools/license";
import type {
  App,
  AppCategory,
  AppDeployment,
  AppLinkKind,
  AppPlatform,
  AppPricing,
  ModelSupportKind,
} from "@/types/app";

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

const CATEGORY_LABEL: Record<AppCategory, string> = {
  ide: "IDE / Agent",
  agent: "Agent",
  assistant: "Assistant",
  orchestration: "Orchestration",
  mcp: "MCP",
  eval: "Eval",
  infra: "Infra",
  memory: "Memory",
  "vector-db": "Vector DB",
  voice: "Voice",
  vision: "Vision",
  "image-gen": "Image Gen",
  video: "Video",
  audio: "Audio",
  "3d": "3D",
  search: "Search",
  "data-ops": "Data Ops",
  observability: "Observability",
  inference: "Inference",
  "fine-tuning": "Fine-tuning",
  "research-platform": "Research",
  "browser-extension": "Browser Extension",
  automation: "Automation",
};

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
  const related = relatedApps(app.slug, 10);
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

      {/* Description */}
      <article className="mt-12 text-base leading-relaxed text-[var(--color-ink)] sm:text-lg">
        <p>{app.description}</p>
        {app.longDescription && <p className="mt-4">{app.longDescription}</p>}
      </article>

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

      {/* Related — horizontal rail mirroring the homepage featured carousel. The
          ToolCard slots render server-side and pass into the client rail as
          children, keeping ToolCard off this route's client bundle (§6). */}
      {related.length > 0 && (
        <RelatedRail categoryLabel={CATEGORY_LABEL[app.category]}>
          {related.map((r) => (
            <li key={r.slug} className="flex w-[320px] shrink-0 snap-start sm:w-[380px]">
              <ToolCard app={r} />
            </li>
          ))}
        </RelatedRail>
      )}

      {/* Footer — last verified + submit a correction */}
      <footer className="mt-20 flex flex-col items-start gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
        {app.lastVerifiedAt && (
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
            Last verified · {app.lastVerifiedAt}
          </p>
        )}
        <Link
          href={`/contact?subject=${encodeURIComponent(`Update for ${app.name}`)}`}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75"
        >
          Submit a correction
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </footer>

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
          dateModified: app.lastVerifiedAt,
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
