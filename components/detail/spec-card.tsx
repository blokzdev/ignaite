import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { App } from "@/types/app";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { LICENSE_LABEL, licenseSignal, type LicenseSignal } from "@/lib/tools/license";
import { facetHref } from "@/lib/tools/facet-links";
import {
  DEPLOYMENT_LABEL,
  LINK_ICON,
  LINK_LABEL,
  MODEL_KIND_LABEL,
  PLATFORM_ICON,
  PLATFORM_LABEL,
  PRICING_LABEL,
} from "@/lib/tools/app-labels";

type ChipTone = "neutral" | LicenseSignal | "archived";

const CHIP_TONE: Record<ChipTone, string> = {
  neutral:
    "bg-white/[0.05] text-[var(--color-ink)] ring-white/[0.08] hover:bg-white/[0.08] hover:text-[var(--color-accent)]",
  oss: "bg-[var(--color-success)]/[0.12] text-[var(--color-success)] ring-[var(--color-success)]/30 hover:bg-[var(--color-success)]/[0.18]",
  core: "bg-[var(--color-violet)]/[0.14] text-[var(--color-violet)] ring-[var(--color-violet)]/30 hover:bg-[var(--color-violet)]/20",
  prop: "bg-white/[0.05] text-[var(--color-ink-dim)] ring-white/[0.08] hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
  archived:
    "bg-white/[0.04] text-[var(--color-ink-dim)] ring-white/[0.10] hover:bg-white/[0.07] hover:text-[var(--color-ink)]",
};

function FacetChip({
  href,
  tone = "neutral",
  icon: Icon,
  children,
}: Readonly<{
  href: string;
  tone?: ChipTone;
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
}>) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] tracking-[0.08em] uppercase ring-1 transition-colors ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        CHIP_TONE[tone],
      )}
    >
      {Icon && <Icon className="h-3 w-3 opacity-80" />}
      {children}
    </Link>
  );
}

function FacetRow({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
        {label}
      </dt>
      <dd className="flex flex-wrap justify-end gap-1.5">{children}</dd>
    </div>
  );
}

// The consolidated "index card": the app's identity (monogram + name + vendor),
// its primary/secondary actions, and every filterable facet as a deep-linked
// chip (each pivots into the directory filtered to that value). Server component
// — all chips are <Link>s, no client JS. Rendered as a sticky sidebar on desktop
// and inline under the hero on smaller screens.
export function SpecCard({ app, accent }: Readonly<{ app: App; accent: string }>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const secondaries = app.links.filter((l) => l !== primary);
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const license = licenseSignal(app);
  const isArchived = app.status === "archived";

  return (
    <aside
      aria-label="App details"
      className="glass overflow-hidden rounded-2xl p-5 ring-1 ring-white/[0.08] ring-inset"
      style={{ background: `linear-gradient(160deg, ${accent}14, transparent 60%)` }}
    >
      {/* Identity */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm tracking-[0.06em] uppercase ring-1 ring-white/[0.08] ring-inset"
          style={{
            background: `linear-gradient(135deg, ${accent}26, transparent)`,
            color: accent,
          }}
        >
          {monogram}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--color-ink)]">{app.name}</p>
          {app.vendor && (
            <p className="truncate font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
              {app.vendor}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {primary && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-4 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
          >
            <span className="truncate">Open {app.name}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          {secondaries.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {secondaries.map((link) => {
                const Icon = LINK_ICON[link.kind];
                return (
                  <li key={`${link.kind}-${link.url}`}>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                    >
                      <Icon className="h-3 w-3" />
                      {LINK_LABEL[link.kind]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <div className="my-5 border-t border-white/[0.06]" />

      {/* Facets — each chip deep-links into the filtered directory */}
      <dl className="flex flex-col gap-3">
        <FacetRow label="Category">
          <FacetChip href={facetHref("category", app.category)}>
            {CATEGORY_LABEL[app.category]}
          </FacetChip>
        </FacetRow>
        <FacetRow label="Pricing">
          <FacetChip href={facetHref("pricing", app.pricing)}>
            {PRICING_LABEL[app.pricing]}
          </FacetChip>
        </FacetRow>
        <FacetRow label="Source">
          <FacetChip href={facetHref("license", license)} tone={license}>
            {LICENSE_LABEL[license]}
          </FacetChip>
        </FacetRow>
        {app.deployment && (
          <FacetRow label="Hosting">
            <FacetChip href={facetHref("deployment", app.deployment)}>
              {DEPLOYMENT_LABEL[app.deployment]}
            </FacetChip>
          </FacetRow>
        )}
        <FacetRow label="Platforms">
          {app.platforms.map((p) => (
            <FacetChip key={p} href={facetHref("platform", p)} icon={PLATFORM_ICON[p]}>
              {PLATFORM_LABEL[p]}
            </FacetChip>
          ))}
        </FacetRow>
        {isArchived && (
          <FacetRow label="Status">
            <FacetChip href={facetHref("status", "archived")} tone="archived">
              Archived
            </FacetChip>
          </FacetRow>
        )}
      </dl>

      {/* Model support — folded in (kind isn't a directory filter, so not linked) */}
      {app.modelSupport && (
        <>
          <div className="my-5 border-t border-white/[0.06]" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
              Model support
            </p>
            <p className="mt-1.5 text-sm text-[var(--color-ink)]">
              {MODEL_KIND_LABEL[app.modelSupport.kind]}
            </p>
            {app.modelSupport.models && app.modelSupport.models.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {app.modelSupport.models.map((m) => (
                  <li
                    key={m}
                    className="rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
            {app.modelSupport.notes && (
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
                {app.modelSupport.notes}
              </p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
