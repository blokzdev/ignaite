"use client";
import { BookmarkToggle } from "@/components/auth/bookmark-toggle";
import { BackCrumb } from "./back-crumb";
import { CopyLinkButton } from "./copy-link-button";

interface Props {
  appName: string;
  shareUrl: string;
  slug: string;
}

// Sticky contextual page-level toolbar, full-bleed and flush under the site
// header. Pinned at `min(var(--nav-h), var(--nav-row-h))`: the content-route
// header's TRUE height is the nav row (3rem) — --nav-h (4/5rem) is the looser
// scroll-padding offset, and pinning there left a see-through slit. The min()
// collapses to 0 when the auto-hiding nav slides away (globals.css zeroes
// --nav-h), so the bar still reclaims the top edge.
//
// State-aware back crumb + an icon-only copy button. No search button — the
// header burger (and ⌘K on desktop) own search; a toolbar search duplicated that
// single trigger. The crumb's first segment reflects where the visitor came from
// (search / category / filter / directory) and returns there via real history;
// its trail scrolls between the fixed round back button and the copy button. See
// <BackCrumb>.
export function DetailToolbar({ appName, shareUrl, slug }: Readonly<Props>) {
  return (
    <div className="sticky top-[calc(min(var(--nav-h),var(--nav-row-h))+var(--safe-top))] z-30 h-[var(--detail-toolbar-h)] border-b border-white/[0.06] bg-[var(--color-canvas)]/85 backdrop-blur-xl">
      <div className="safe-px mx-auto flex h-full max-w-6xl items-center gap-3">
        <BackCrumb appName={appName} />
        <BookmarkToggle kind="app" slug={slug} />
        <CopyLinkButton url={shareUrl} iconOnly />
      </div>
    </div>
  );
}
