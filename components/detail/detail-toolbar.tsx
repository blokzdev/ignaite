"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSavedDirectoryHref } from "@/lib/tools/directory-session";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { CopyLinkButton } from "./copy-link-button";

/** Deep-linked key facet rendered in the compact (scrolled) state on desktop. */
export interface ToolbarFacet {
  label: string;
  href: string;
}

interface Props {
  breadcrumb: ReadonlyArray<Crumb>;
  shareUrl: string;
  name: string;
  monogram: string;
  accent: string;
  openHref: string;
  facets: ReadonlyArray<ToolbarFacet>;
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
// header (the shell's top padding equals the nav's rest height). Pinned at
// `top-[var(--nav-h)]` — globals.css collapses --nav-h to 0 when the
// auto-hiding nav slides away, so the bar reclaims the top edge with no gap
// and no scroll listener of its own. Two crossfaded states: at the top it
// shows the breadcrumb + search + copy; once the hero scrolls past
// (#hero-sentinel leaves view) it swaps to a compact app identity + key
// facets (desktop) + Open. Reduced-motion users get the stable breadcrumb
// state with no observer and no swap. The "Directory" crumb is upgraded after
// mount to this tab's last directory query (back to the exact results).
export function DetailToolbar({
  breadcrumb,
  shareUrl,
  name,
  monogram,
  accent,
  openHref,
  facets,
}: Readonly<Props>) {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const directoryHref = useSavedDirectoryHref();

  useEffect(() => {
    if (reduced) return;
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      // Trip roughly when the hero's tail passes under the nav + this bar.
      { rootMargin: "-120px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [reduced]);

  // Send the root crumb back to the tab's saved results URL (plain "/" when
  // none) — the store hook renders "/" on the server and upgrades post-hydration.
  const crumbs =
    directoryHref !== "/"
      ? breadcrumb.map((c) => (c.href === "/" ? { ...c, href: directoryHref } : c))
      : breadcrumb;

  return (
    <div className="ease-out-expo sticky top-[var(--nav-h)] z-30 h-[var(--detail-toolbar-h)] border-b border-white/[0.06] bg-[var(--color-canvas)]/85 backdrop-blur-xl transition-colors duration-300">
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        {/* State A — breadcrumb + search + copy */}
        <div
          inert={compact}
          className={cn(
            "flex w-full items-center justify-between gap-3 transition-opacity duration-300",
            compact ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <Breadcrumb items={crumbs} />
          <div className="flex shrink-0 items-center gap-2">
            <SearchButton />
            <CopyLinkButton url={shareUrl} />
          </div>
        </div>

        {/* State B — compact identity + key facets (desktop) + Open */}
        <div
          inert={!compact}
          className={cn(
            "absolute inset-x-6 inset-y-0 flex items-center justify-between gap-3 transition-opacity duration-300",
            compact ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px] tracking-[0.04em] uppercase ring-1 ring-white/[0.08] ring-inset"
              style={{
                background: `linear-gradient(135deg, ${accent}26, transparent)`,
                color: accent,
              }}
            >
              {monogram}
            </span>
            <span className="truncate text-sm font-medium text-[var(--color-ink)]">{name}</span>
            {/* Key facets, mirrored from the spec card so the essentials stay
                glanceable while it's scrolled away. Desktop only — 360px keeps
                identity + actions. */}
            {facets.length > 0 && (
              <ul className="hidden shrink-0 items-center gap-1.5 lg:flex">
                {facets.map((f) => (
                  <li key={f.href}>
                    <Link
                      href={f.href}
                      className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                    >
                      {f.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SearchButton />
            <CopyLinkButton url={shareUrl} iconOnly />
            <Link
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-7 items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3.5 font-mono text-[11px] tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none sm:inline-flex"
            >
              Open
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
