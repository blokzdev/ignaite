import Link from "next/link";
import type { ReactNode } from "react";
import type { App } from "@/types/app";
import { cn, formatDate } from "@/lib/utils";
import { StatScroller } from "@/components/detail/stat-scroller";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { facetHref } from "@/lib/tools/facet-links";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";
import {
  DEPLOYMENT_LABEL,
  MODEL_KIND_LABEL,
  PLATFORM_LABEL,
  PRICING_LABEL,
} from "@/lib/tools/app-labels";

const TONE: Record<string, string> = {
  ink: "text-[var(--color-ink)]",
  dim: "text-[var(--color-ink-dim)]",
  success: "text-[var(--color-success)]",
  violet: "text-[var(--color-violet)]",
  warn: "text-[var(--color-warn)]",
};

function Cell({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="flex shrink-0 snap-start flex-col gap-1.5 border-l border-white/[0.06] pr-5 pl-5 first:border-l-0 first:pl-4 last:pr-4">
      <dt className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-dim)]/80 uppercase">
        {label}
      </dt>
      <dd className="font-mono text-[13px] tracking-[0.02em] tabular-nums">{children}</dd>
    </div>
  );
}

const linkCls =
  "inline-flex items-center rounded transition-colors hover:text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none";

// The DEX-style statistics band: an elevated panel of labeled data points under
// the masthead — the directory's "at a glance" line. Most values deep-link into
// the filtered directory (facetHref); MODELS is reference-only (unlinked),
// VERIFIED jumps to the change-history ledger. The cells render server-side and
// pass into <StatScroller> (the lone client island) which adds the dynamic edge
// fades + swipe-for-more chevron; the row scrolls on overflow, fits at lg.
export function StatStrip({ app, accent }: Readonly<{ app: App; accent: string }>) {
  const license = licenseSignal(app);
  const sourceTone = license === "oss" ? "success" : license === "core" ? "violet" : "dim";
  const pricingTone = app.pricing === "free" ? "success" : "ink";

  return (
    // Elevated panel — the stats read as a deliberate spec surface. The cell
    // inset lives on the cells themselves (first:pl-4/last:pr-4); container
    // padding-left on a horizontal flex scroller is unreliable (it once pinned
    // the first cell to the edge). The StatScroller adds dynamic edge fades + a
    // swipe-for-more chevron so scrollability is obvious.
    <section className="relative mt-6 overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.08] ring-inset">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-px"
        style={{ background: `${accent}55` }}
      />
      <StatScroller>
        <Cell label="Category">
          <Link
            href={facetHref("category", app.category)}
            aria-label={`Category: ${CATEGORY_LABEL[app.category]} — browse matching apps`}
            className={cn(linkCls, TONE.ink)}
          >
            {CATEGORY_LABEL[app.category]}
          </Link>
        </Cell>

        <Cell label="Pricing">
          <Link
            href={facetHref("pricing", app.pricing)}
            aria-label={`Pricing: ${PRICING_LABEL[app.pricing]} — browse matching apps`}
            className={cn(linkCls, TONE[pricingTone])}
          >
            {PRICING_LABEL[app.pricing]}
          </Link>
        </Cell>

        <Cell label="Source">
          <Link
            href={facetHref("license", license)}
            aria-label={`Source: ${LICENSE_LABEL[license]} — browse matching apps`}
            className={cn(linkCls, TONE[sourceTone])}
          >
            {LICENSE_LABEL[license]}
          </Link>
        </Cell>

        {app.deployment && (
          <Cell label="Hosting">
            <Link
              href={facetHref("deployment", app.deployment)}
              aria-label={`Hosting: ${DEPLOYMENT_LABEL[app.deployment]} — browse matching apps`}
              className={cn(linkCls, TONE.ink)}
            >
              {DEPLOYMENT_LABEL[app.deployment]}
            </Link>
          </Cell>
        )}

        <Cell label="Platforms">
          <span className="flex items-center gap-x-1.5 whitespace-nowrap text-[var(--color-ink)]">
            {app.platforms.map((p, i) => (
              <span key={p} className="contents">
                {i > 0 && (
                  <span aria-hidden className="text-[var(--color-ink-dim)]/40">
                    ·
                  </span>
                )}
                <Link
                  href={facetHref("platform", p)}
                  aria-label={`Platform: ${PLATFORM_LABEL[p]} — browse matching apps`}
                  className={cn(linkCls, TONE.ink)}
                >
                  {PLATFORM_LABEL[p]}
                </Link>
              </span>
            ))}
          </span>
        </Cell>

        {app.modelSupport && (
          <Cell label="Models">
            <span className="whitespace-nowrap text-[var(--color-ink-dim)]">
              {MODEL_KIND_LABEL[app.modelSupport.kind]}
            </span>
          </Cell>
        )}

        {app.lastVerifiedAt && (
          <Cell label="Verified">
            <Link
              href="#history"
              aria-label={`Verified ${formatDate(app.lastVerifiedAt)} — view change history`}
              className={cn(linkCls, "whitespace-nowrap", TONE.dim)}
            >
              {formatDate(app.lastVerifiedAt)}
            </Link>
          </Cell>
        )}

        {app.status === "archived" && (
          <Cell label="Status">
            <Link
              href={facetHref("status", "archived")}
              aria-label="Status: Archived — browse archived apps"
              className={cn(linkCls, TONE.warn)}
            >
              Archived
            </Link>
          </Cell>
        )}
      </StatScroller>
    </section>
  );
}
