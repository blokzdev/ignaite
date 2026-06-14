"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  armDirectoryRestore,
  describeDirectoryReturn,
  useHasDirectoryReturn,
  useSavedDirectoryQuery,
  type DirectoryReturn,
} from "@/lib/tools/directory-session";

// Type-glyph per return kind — signals at a glance WHAT you'd go back to.
const GLYPH = {
  search: Search,
  category: LayoutGrid,
  filter: SlidersHorizontal,
  directory: Home,
} as const;

function ariaFor(kind: DirectoryReturn["kind"], label: string): string {
  switch (kind) {
    case "search":
      return `Back to search results for ${label}`;
    case "category":
      return `Back to ${label}`;
    case "filter":
      return `Back to filtered results: ${label}`;
    default:
      return "Back to the directory";
  }
}

// The detail toolbar's state-aware breadcrumb. A FIXED round back button on the
// left (always visible + tappable, balancing the Copy-link button on the right)
// + a horizontally-scrollable descriptive trail `{glyph} {source} › {app}`. The
// button is a plain <Link> straight to the saved results (filters/search/sort
// intact) — deliberately NOT router.back(): one press always lands on the
// results, no matter how much history piled up in between (reloads, app→app
// hops via Alternatives, #history hash jumps). The browser's own back button
// still walks literal history for anyone who wants that. Scroll position IS
// restored: the click arms a one-shot flag and the grid (ToolsBrowser) jumps
// back to the saved leave-point — count + offset captured at card click-through
// (see directory-session.ts). When a restore will run, `scroll={false}` keeps
// Next from scrolling to top under our jump; with nothing to restore, the
// default top-of-page scroll stands. The trail shows where you came from via a
// type-glyph + label (search term / category / joined filters), or just a home
// glyph for the bare directory, and fades on whichever side has hidden
// content — a scroll cue that, with the button separate, never clips it.
export function BackCrumb({ appName }: Readonly<{ appName: string }>) {
  const raw = useSavedDirectoryQuery();
  const { kind, label, href } = useMemo(() => describeDirectoryReturn(raw), [raw]);
  const hasReturn = useHasDirectoryReturn();
  const Glyph = GLYPH[kind];

  // Dynamic edge fade — fade only the side(s) with hidden content.
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);
  // Re-measure once the smart label resolves post-hydration (and on content change).
  useEffect(() => {
    update();
  }, [update, kind, label, appName]);

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-2">
      <Link
        href={href}
        scroll={!hasReturn}
        onClick={(e) => {
          // Arm only for a plain left-click that navigates THIS tab. Modified
          // clicks (cmd/ctrl/shift/alt — new tab/window) still fire onClick,
          // and arming here would leave the one-shot flag set in the ORIGINAL
          // tab's sessionStorage, mis-restoring its next directory mount.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          armDirectoryRestore();
        }}
        aria-label={ariaFor(kind, label)}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-[color,background-color,transform] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none active:scale-95 motion-reduce:active:scale-100"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
      </Link>

      <div
        ref={ref}
        className={cn(
          "no-scrollbar min-w-0 flex-1 overflow-x-auto",
          canLeft && canRight && "scroll-fade-x",
          !canLeft && canRight && "scroll-fade-r",
          canLeft && !canRight && "scroll-fade-l",
        )}
      >
        <ol className="flex w-max items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
          <li className="flex shrink-0 items-center gap-1.5 text-[var(--color-ink-dim)]">
            <Glyph aria-hidden className="h-3 w-3 shrink-0 opacity-70" />
            {kind !== "directory" && <span className="whitespace-nowrap">{label}</span>}
          </li>
          <li className="flex shrink-0">
            <ChevronRight aria-hidden className="h-3 w-3 text-[var(--color-ink-dim)]" />
          </li>
          <li className="flex shrink-0">
            <span aria-current="page" className="whitespace-nowrap text-[var(--color-ink)]">
              {appName}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
