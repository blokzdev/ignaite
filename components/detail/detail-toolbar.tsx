"use client";
import { Search } from "lucide-react";
import { useSavedDirectoryHref } from "@/lib/tools/directory-session";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { CopyLinkButton } from "./copy-link-button";

interface Props {
  breadcrumb: ReadonlyArray<Crumb>;
  shareUrl: string;
}

// Opens the unified console (the same surface as the nav's ⌘K pill) — the
// toolbar stays reachable when the auto-hiding header has slid away, so this
// is the detail page's always-available search entry.
function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("blokz:open-command"))}
      aria-label="Search the directory (Command/Ctrl + K)"
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
    >
      <Search className="h-3.5 w-3.5" />
    </button>
  );
}

// Sticky contextual page-level toolbar, full-bleed and flush under the site
// header. Pinned at `min(var(--nav-h), var(--nav-row-h))`: the content-route
// header's TRUE height is the nav row (3rem) — --nav-h (4/5rem) is the looser
// scroll-padding offset, and pinning there left a see-through slit. The min()
// collapses to 0 when the auto-hiding nav slides away (globals.css zeroes
// --nav-h), so the bar still reclaims the top edge.
//
// Deliberately STATIC — just the breadcrumb + search + copy, no scroll-driven
// identity/Open swap. The breadcrumb's last crumb already names the current
// app, so a compact identity state was redundant and its crossfade read as
// flicker (especially as the nav re-revealed on scroll-up). The "Directory"
// crumb is upgraded after mount to this tab's last directory query (back to the
// exact results the visitor came from).
export function DetailToolbar({ breadcrumb, shareUrl }: Readonly<Props>) {
  const directoryHref = useSavedDirectoryHref();
  const crumbs =
    directoryHref !== "/"
      ? breadcrumb.map((c) => (c.href === "/" ? { ...c, href: directoryHref } : c))
      : breadcrumb;

  return (
    <div className="sticky top-[min(var(--nav-h),var(--nav-row-h))] z-30 h-[var(--detail-toolbar-h)] border-b border-white/[0.06] bg-[var(--color-canvas)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-6">
        <Breadcrumb items={crumbs} />
        <div className="flex shrink-0 items-center gap-2">
          <SearchButton />
          <CopyLinkButton url={shareUrl} />
        </div>
      </div>
    </div>
  );
}
