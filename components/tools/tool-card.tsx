import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BookmarkToggle } from "@/components/auth/bookmark-toggle";
import type { App } from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { licenseSignal } from "@/lib/tools/license";
import { LINK_ICON, PRICING_LABEL } from "@/lib/tools/app-labels";
import { cn } from "@/lib/utils";
import { CardProsCons } from "./card-pros-cons";

const NEUTRAL_RING = "ring-white/[0.08]";

interface Props {
  app: App;
}

export function ToolCard({ app }: Readonly<Props>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const secondaries = app.links.filter((l) => l !== primary);
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const isArchived = app.status === "archived";
  const license = licenseSignal(app);
  const accent = app.accentColor ?? "#08D9D6";
  // Cap the tag row so a long tag list can't blow out card height on mobile;
  // surplus is summarised as a +N chip.
  const visibleTags = app.tags?.slice(0, 4) ?? [];
  const extraTags = (app.tags?.length ?? 0) - visibleTags.length;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-[var(--color-surface)]/70 p-5 ring-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ring-inset",
        // Archived: muted overall, no hover-lift (it's a historical record, not
        // a live recommendation). Live cards lift, warm their ring to accent, and
        // cast a soft directional glow on hover (reduced-motion zeroes the move).
        isArchived
          ? "opacity-60 ring-white/[0.06]"
          : "hover:-translate-y-1 hover:bg-[var(--color-surface)]/90 hover:shadow-[0_8px_30px_-12px_var(--color-accent)] hover:ring-[var(--color-accent)]/20 active:scale-[0.99] motion-reduce:active:scale-100",
        !isArchived && NEUTRAL_RING,
      )}
    >
      {/* Stretched-link overlay — clicking anywhere on the card (except the
          interactive CTAs below, which lift to z-[2]) navigates to the detail
          page. Keeps the Open / docs / github CTAs as direct external paths. */}
      <Link
        href={`/apps/${app.slug}`}
        aria-label={`View ${app.name} details`}
        className="absolute inset-0 z-[1] rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <span className="sr-only">View {app.name} details</span>
      </Link>
      {/* Top row: category + pricing + license signal (+ archived).
          Only the "open" license states get a chip — proprietary (~2/3 of
          listings) is the intentional unbadged default to keep cards quiet;
          the Source filter still offers all three. Don't add a "prop" chip. */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
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
        {isArchived && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.10] ring-inset">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-[var(--color-ink-dim)]"
            />
            ARCHIVED
          </span>
        )}
      </div>

      {/* Monogram + name + vendor */}
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          // Accent-tinted inset ring (inline, since the colour is data-driven and
          // can't come from a Tailwind ring class) makes the monogram the card's
          // identity anchor rather than a flat swatch.
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs tracking-[0.08em] uppercase"
          style={{
            background: `linear-gradient(135deg, ${accent}1f, transparent)`,
            color: accent,
            boxShadow: `inset 0 0 0 1px ${accent}33`,
          }}
        >
          {monogram}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium tracking-[-0.01em] text-[var(--color-ink)]">
            {app.name}
          </h3>
          {app.vendor && (
            <p className="truncate text-xs text-[var(--color-ink-dim)]">{app.vendor}</p>
          )}
        </div>
      </div>

      {/* Tagline + description — clamped so cards keep an even height in the
          auto-rows-fr grid and long copy can't overflow on mobile. */}
      <div className="flex flex-col gap-2">
        <p className="line-clamp-2 text-sm text-[var(--color-ink)]">{app.tagline}</p>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-ink-dim)]">
          {app.description}
        </p>
      </div>

      {/* Pros / cons — two single-line flippers replace the old "Worth knowing"
          box. pros/cons are populated on every listing, so the card always has a
          filled, uniform footer signal (the insight lives on the detail page,
          where the ~3% of entries without one read fine). */}
      {((app.pros?.length ?? 0) > 0 || (app.cons?.length ?? 0) > 0) && (
        <CardProsCons pros={app.pros} cons={app.cons} />
      )}

      {/* Tags — first 4, with a +N chip for the rest */}
      {visibleTags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-dim)]/80"
            >
              {tag}
            </li>
          ))}
          {extraTags > 0 && (
            <li className="rounded-full bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-dim)]">
              +{extraTags}
            </li>
          )}
        </ul>
      )}

      {/* Links — lifted above the stretched-link overlay so they capture
          clicks before the card-level navigation fires. */}
      <div className="relative z-[2] mt-auto flex flex-wrap items-center gap-2 pt-2">
        {primary && (
          <Link
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-accent)]/[0.12] px-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.22] hover:text-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none sm:h-9"
          >
            Open
            <ArrowUpRight className="h-3 w-3" />
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
              aria-label={link.label ?? link.kind}
              title={link.label ?? link.kind}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none sm:h-9 sm:w-9"
            >
              <Icon className="h-3.5 w-3.5" />
            </Link>
          );
        })}
        {/* Bookmark — client island, lifted above the stretched-link overlay (z-[2]).
            Pushed to the right so it reads as a distinct save affordance. */}
        <BookmarkToggle kind="app" slug={app.slug} className="ml-auto" />
      </div>
    </article>
  );
}
