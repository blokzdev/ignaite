"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { CopyLinkButton } from "./copy-link-button";

interface Props {
  breadcrumb: ReadonlyArray<Crumb>;
  shareUrl: string;
  name: string;
  monogram: string;
  accent: string;
  openHref: string;
}

// Sticky contextual page-level toolbar. Pinned under the site header at
// `top-[var(--nav-h)]` — because globals.css collapses --nav-h to 0 when the
// auto-hiding nav slides away, the bar reclaims the top edge with no gap and no
// scroll listener of its own. Two crossfaded states: at the top it shows the
// breadcrumb + copy; once the hero scrolls past (#hero-sentinel leaves view) it
// swaps to a compact app identity + Open. Reduced-motion users get the stable
// breadcrumb state with no observer and no swap.
export function DetailToolbar({
  breadcrumb,
  shareUrl,
  name,
  monogram,
  accent,
  openHref,
}: Readonly<Props>) {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);

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

  return (
    <div className="ease-out-expo sticky top-[var(--nav-h)] z-30 -mx-6 h-[var(--detail-toolbar-h)] border-b border-white/[0.06] bg-[var(--color-canvas)]/85 px-6 backdrop-blur-xl transition-colors duration-300">
      <div className="relative flex h-full items-center">
        {/* State A — breadcrumb + copy */}
        <div
          inert={compact}
          className={cn(
            "flex w-full items-center justify-between gap-3 transition-opacity duration-300",
            compact ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <Breadcrumb items={breadcrumb} />
          <CopyLinkButton url={shareUrl} />
        </div>

        {/* State B — compact identity + Open */}
        <div
          inert={!compact}
          className={cn(
            "absolute inset-0 flex items-center justify-between gap-3 transition-opacity duration-300",
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
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
