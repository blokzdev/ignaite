"use client";
import { useMemo, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Home, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import {
  describeDirectoryReturn,
  useInAppNav,
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

// The detail toolbar's state-aware breadcrumb: `← {glyph} {source} › {app}`. The
// first segment reflects where the visitor came from via a small type-glyph +
// label (search term / category / joined filters), or just the home glyph for
// the bare directory. The back group is a real <Link> to those results (no-JS /
// new-tab safe, filters intact), but when the visitor arrived in-app it
// intercepts the click and calls router.back() so Next restores the cached
// results EXACTLY. The trail is horizontally scrollable so a long filter set +
// app name stay fully viewable; the back affordance is the first thing visible.
export function BackCrumb({ appName }: Readonly<{ appName: string }>) {
  const router = useRouter();
  const raw = useSavedDirectoryQuery();
  const inApp = useInAppNav();
  const { kind, label, href } = useMemo(() => describeDirectoryReturn(raw), [raw]);
  const Glyph = GLYPH[kind];

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Plain click only (let modifier/middle clicks open the href normally).
    if (inApp && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
      <ol className="flex w-max items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
        <li className="flex shrink-0 items-center gap-1.5">
          <Link
            href={href}
            onClick={onClick}
            aria-label={ariaFor(kind, label)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5 shrink-0" />
            <Glyph aria-hidden className="h-3 w-3 shrink-0 opacity-70" />
            {kind !== "directory" && <span className="whitespace-nowrap">{label}</span>}
          </Link>
          <ChevronRight aria-hidden className="h-3 w-3 shrink-0 text-[var(--color-ink-dim)]" />
        </li>
        <li className="flex shrink-0">
          <span aria-current="page" className="whitespace-nowrap text-[var(--color-ink)]">
            {appName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
