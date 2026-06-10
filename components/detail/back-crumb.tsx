"use client";
import { useMemo, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import {
  describeDirectoryReturn,
  useInAppNav,
  useSavedDirectoryQuery,
} from "@/lib/tools/directory-session";

// The detail toolbar's state-aware breadcrumb: `← {source} › {app}`. The first
// segment reflects where the visitor came from — a searched term (with an inline
// magnifier), a single filter's value, "Results", or "Directory". The back group
// is a real <Link> to those results (works with no JS / open-in-new-tab and keeps
// the filters), but when the visitor arrived in-app it intercepts the click and
// calls router.back() so Next restores the cached results EXACTLY (scroll +
// loaded batch + filters). The app name is the current page (aria-current).
export function BackCrumb({ appName }: Readonly<{ appName: string }>) {
  const router = useRouter();
  const raw = useSavedDirectoryQuery();
  const inApp = useInAppNav();
  const { kind, label, href } = useMemo(() => describeDirectoryReturn(raw), [raw]);

  const ariaLabel =
    kind === "search"
      ? `Back to search results for ${label}`
      : label === "Directory"
        ? "Back to the directory"
        : `Back to ${label}`;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Plain click only (let modifier/middle clicks open the href normally).
    if (inApp && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
        <li className="flex shrink-0 items-center gap-1.5">
          <Link
            href={href}
            onClick={onClick}
            aria-label={ariaLabel}
            className="inline-flex max-w-[9rem] items-center gap-1.5 rounded-sm text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5 shrink-0" />
            {kind === "search" && <Search aria-hidden className="h-3 w-3 shrink-0 opacity-70" />}
            <span className="truncate">{label}</span>
          </Link>
          <ChevronRight aria-hidden className="h-3 w-3 shrink-0 text-[var(--color-ink-dim)]" />
        </li>
        <li className="flex min-w-0">
          <span aria-current="page" className="truncate text-[var(--color-ink)]">
            {appName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
