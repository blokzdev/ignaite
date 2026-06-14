import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { App } from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { appCategories } from "@/lib/tools/category-membership";
import { PRICING_LABEL } from "@/lib/tools/app-labels";
import { cn } from "@/lib/utils";

interface Props {
  app: App;
}

// The condensed list-view row — the dense counterpart to <ToolCard>. The whole
// row is a stretched link to the detail page (a bare chevron marks the affordance
// — no circular Open button); it carries a 2-line description plus a compact meta
// row (categories incl. secondaries + pricing + a few tags) for at-a-glance scan.
export function ToolRow({ app }: Readonly<Props>) {
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const isArchived = app.status === "archived";
  const accent = app.accentColor ?? "#08D9D6";
  const tags = app.tags?.slice(0, 3) ?? [];

  return (
    <article
      className={cn(
        "group relative flex items-start gap-3 overflow-hidden rounded-xl bg-[var(--color-surface)]/60 px-3 py-3 ring-1 transition-[background-color,box-shadow] ring-inset sm:gap-4 sm:px-4",
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
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] tracking-[0.08em] uppercase"
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

        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-ink-dim)]">
          {app.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase">
          {appCategories(app).map((c) => (
            <span
              key={c}
              className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset"
            >
              {CATEGORY_LABEL[c]}
            </span>
          ))}
          <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset">
            {PRICING_LABEL[app.pricing]}
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/[0.03] px-2 py-0.5 tracking-[0.04em] text-[var(--color-ink-dim)]/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ChevronRight
        aria-hidden
        className="mt-0.5 h-5 w-5 shrink-0 self-center text-[var(--color-ink-dim)] transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
      />
    </article>
  );
}
