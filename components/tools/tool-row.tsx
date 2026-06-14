import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { App } from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { licenseSignal } from "@/lib/tools/license";
import { PRICING_LABEL } from "@/lib/tools/app-labels";
import { cn } from "@/lib/utils";

interface Props {
  app: App;
}

// The condensed list-view row — the dense counterpart to <ToolCard>. Mirrors the
// card's stretched-link pattern (whole row → detail page; the Open CTA lifts to
// z-[2]) but drops description/insight/tags/secondary links for scan density.
export function ToolRow({ app }: Readonly<Props>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const isArchived = app.status === "archived";
  const license = licenseSignal(app);
  const accent = app.accentColor ?? "#08D9D6";

  return (
    <article
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-xl bg-[var(--color-surface)]/60 px-3 py-2.5 ring-1 transition-[background-color,box-shadow] ring-inset sm:gap-4 sm:px-4",
        isArchived
          ? "opacity-60 ring-white/[0.06]"
          : "ring-white/[0.08] hover:bg-[var(--color-surface)]/90 hover:ring-[var(--color-accent)]/20",
      )}
    >
      <Link
        href={`/apps/${app.slug}`}
        aria-label={`View ${app.name} details`}
        className="absolute inset-0 z-[1] rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <span className="sr-only">View {app.name} details</span>
      </Link>

      <div
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] tracking-[0.08em] uppercase"
        style={{
          background: `linear-gradient(135deg, ${accent}1f, transparent)`,
          color: accent,
          boxShadow: `inset 0 0 0 1px ${accent}33`,
        }}
      >
        {monogram}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-medium text-[var(--color-ink)]">{app.name}</h3>
          {app.vendor && (
            <span className="hidden shrink truncate text-xs text-[var(--color-ink-dim)] sm:inline">
              · {app.vendor}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-[var(--color-ink-dim)]">{app.tagline}</p>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase md:flex">
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset">
          {CATEGORY_LABEL[app.category]}
        </span>
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset">
          {PRICING_LABEL[app.pricing]}
        </span>
        {license === "oss" && (
          <span className="rounded-full bg-[var(--color-success)]/[0.12] px-2 py-0.5 text-[var(--color-success)] ring-1 ring-[var(--color-success)]/30 ring-inset">
            OSS
          </span>
        )}
        {license === "core" && (
          <span className="rounded-full bg-[var(--color-violet)]/[0.14] px-2 py-0.5 text-[var(--color-violet)] ring-1 ring-[var(--color-violet)]/30 ring-inset">
            Open core
          </span>
        )}
      </div>

      {primary && (
        <Link
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${app.name}`}
          className="relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.22] hover:text-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none active:scale-95 motion-reduce:active:scale-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
