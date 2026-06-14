import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { App } from "@/types/app";
import { siteUrl } from "@/lib/seo";
import { LINK_ICON, LINK_LABEL } from "@/lib/tools/app-labels";
import { ActionBarMount } from "./action-bar-mount";
import { ShareSheetLazy } from "./share-sheet-lazy";

// Enhanced pinned bottom bar (mobile only — ≥sm the sticky toolbar + masthead
// carry the actions). Primary "Open" stays reachable while scrolling, alongside
// the two highest-value secondary links (docs / GitHub) and the Share/export
// surface — a bottom sheet here (it clears this fixed bar, unlike a dropdown
// opening upward from its icon). Safe-area aware; only the sheet hydrates.
export function DetailActionBar({
  app,
  markdown,
  json,
}: Readonly<{ app: App; markdown: string; json: string }>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  // Cap secondaries so a 360px row never crowds: docs + GitHub are the keepers;
  // the rest live in the spec card's full link set.
  const secondaries = app.links
    .filter((l) => l !== primary && (l.kind === "docs" || l.kind === "github"))
    .slice(0, 2);
  const shareUrl = `${siteUrl}/apps/${app.slug}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-white/[0.08] bg-[var(--color-canvas)]/90 pt-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(0.75rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-xl sm:hidden">
      <ActionBarMount />
      {primary && (
        <Link
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-4 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-[background-color,transform] hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none active:scale-[0.98] motion-reduce:active:scale-100"
        >
          <span className="truncate">Open {app.name}</span>
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
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
            aria-label={LINK_LABEL[link.kind]}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-[color,background-color,transform] ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none active:scale-95 motion-reduce:active:scale-100"
          >
            <Icon aria-hidden className="h-4 w-4" />
          </Link>
        );
      })}
      <ShareSheetLazy
        name={app.name}
        tagline={app.tagline}
        slug={app.slug}
        shareUrl={shareUrl}
        markdown={markdown}
        json={json}
      />
    </div>
  );
}
