import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { App } from "@/types/app";
import { ShareMenuLazy } from "@/components/detail/share-menu-lazy";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { facetHref } from "@/lib/tools/facet-links";
import { LINK_ICON, LINK_LABEL } from "@/lib/tools/app-labels";

// The page's identity + action zone (DEX masthead). Replaces the old hero and
// the spec card's identity/CTA header: monogram + linkified category eyebrow +
// serif name + tagline, with a right-aligned (lg) / below (sm–lg) action
// cluster. The cluster is hidden below sm — the fixed action bar owns the sole
// Open there (one-Open-per-state). Server component; the only client child is
// the lazy Share menu.
export function Masthead({
  app,
  accent,
  shareUrl,
  markdown,
  json,
}: Readonly<{ app: App; accent: string; shareUrl: string; markdown: string; json: string }>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const monogram = app.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  // Mirror the action bar's "keeper" set: docs + GitHub get a spot in the
  // masthead cluster; the full link list lives in the dossier rail.
  const keepers = app.links
    .filter((l) => l !== primary && (l.kind === "docs" || l.kind === "github"))
    .slice(0, 2);

  return (
    <header className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="flex items-start gap-4 sm:gap-5">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-base tracking-[0.08em] uppercase ring-1 ring-white/[0.08] ring-inset sm:h-20 sm:w-20"
          style={{ background: `linear-gradient(135deg, ${accent}26, transparent)`, color: accent }}
        >
          {monogram}
        </div>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-1.5 font-mono text-[11px] tracking-[0.16em] uppercase">
            <Link
              href={facetHref("category", app.category)}
              className="rounded text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              {CATEGORY_LABEL[app.category]}
            </Link>
            {app.vendor && (
              <>
                <span aria-hidden className="text-[var(--color-ink-dim)]/50">
                  ·
                </span>
                <span className="text-[var(--color-ink-dim)]">{app.vendor}</span>
              </>
            )}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-display text-[var(--color-ink)]">{app.name}</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-[var(--color-ink-dim)] sm:text-lg">
            {app.tagline}
          </p>
        </div>
      </div>

      {/* Action cluster — sm+ only (the fixed bar owns Open below sm). */}
      {primary && (
        <div className="hidden shrink-0 flex-wrap items-center gap-2 sm:flex">
          <Link
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 max-w-[16rem] items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
          >
            <span className="truncate">Open {app.name}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          {keepers.map((link) => {
            const Icon = LINK_ICON[link.kind];
            return (
              <Link
                key={`${link.kind}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={LINK_LABEL[link.kind]}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
          <ShareMenuLazy
            variant="bar"
            side="bottom"
            name={app.name}
            tagline={app.tagline}
            slug={app.slug}
            shareUrl={shareUrl}
            markdown={markdown}
            json={json}
            className="h-11 w-11"
          />
        </div>
      )}
    </header>
  );
}
