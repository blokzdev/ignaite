"use client";
import Link from "next/link";
import { ArrowUpRight, SearchX } from "lucide-react";
import type { App, AppCategory } from "@/types/app";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySuggestion {
  value: AppCategory;
  label: string;
}

interface Props {
  filtersApplied: boolean;
  onClear: () => void;
  /** Picks a category as a fresh starting point (resets the rest of the query). */
  onPickCategory: (category: AppCategory) => void;
  categories: ReadonlyArray<CategorySuggestion>;
  featured: ReadonlyArray<App>;
  /** Archived apps matching the current query/filters but hidden by the live
   *  (active) default — surfaced as the primary recovery when > 0. */
  archivedCount?: number;
  onShowArchived?: () => void;
}

// Static, non-pulsing scaffold card — purely a spatial hint of where results
// would sit. aria-hidden + no animation so it never reads as "loading".
function GhostCard() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-[var(--color-surface)]/40 p-5 ring-1 ring-white/[0.05] ring-inset">
      <div className="flex gap-2">
        <Skeleton variant="none" className="h-4 w-16 rounded-full" />
        <Skeleton variant="none" className="h-4 w-14 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="none" className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton variant="none" className="h-4 w-2/3" />
          <Skeleton variant="none" className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton variant="none" className="h-3 w-full" />
      <Skeleton variant="none" className="h-3 w-5/6" />
      <Skeleton variant="none" className="mt-auto h-9 w-24 rounded-full" />
    </div>
  );
}

export function DirectoryEmpty({
  filtersApplied,
  onClear,
  onPickCategory,
  categories,
  featured,
  archivedCount = 0,
  onShowArchived,
}: Readonly<Props>) {
  const hasArchived = archivedCount > 0 && Boolean(onShowArchived);
  return (
    <div className="relative isolate overflow-hidden rounded-2xl">
      {/* Ghost-grid backdrop — same layout as the real grid, clipped to the
          recovery card's height and faded toward the bottom so it frames the
          message rather than competing with it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid grid-cols-1 gap-5 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)] opacity-40 select-none sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <GhostCard key={i} />
        ))}
      </div>

      {/* Recovery card — the functional layer that un-sticks the visitor.
          In normal flow so it drives the (bounded) height of the whole block. */}
      <div className="flex min-h-[28rem] items-center justify-center px-4 py-16">
        <div className="glass flex w-full max-w-lg flex-col items-center gap-5 rounded-2xl p-8 text-center">
          <span
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset"
          >
            <SearchX className="h-5 w-5 text-[var(--color-ink-dim)]" />
          </span>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
              {hasArchived ? "No live matches" : "No matches"}
            </p>
            <p className="mx-auto max-w-sm text-sm text-[var(--color-ink-dim)]">
              {hasArchived
                ? `${archivedCount === 1 ? "1 archived app matches" : `${archivedCount} archived apps match`} — hidden from the live directory because ${archivedCount === 1 ? "it's" : "they're"} discontinued.`
                : filtersApplied
                  ? "Nothing fits that combination. Clear your filters or jump to a category below."
                  : "Nothing here yet — start from a category or a featured pick below."}
            </p>
          </div>

          {hasArchived && (
            <button
              type="button"
              onClick={onShowArchived}
              className="inline-flex h-10 items-center rounded-full bg-[var(--color-accent)]/[0.12] px-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.2] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              {archivedCount === 1 ? "Show the archived app" : "Show archived apps"}
            </button>
          )}

          {filtersApplied && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "inline-flex h-10 items-center rounded-full px-4 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
                hasArchived
                  ? "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  : "bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 ring-inset hover:bg-[var(--color-accent)]/[0.2]",
              )}
            >
              Clear filters
            </button>
          )}

          {categories.length > 0 && (
            <div className="flex w-full flex-col items-center gap-2.5 border-t border-white/[0.06] pt-5">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Browse a category
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onPickCategory(c.value)}
                    className="inline-flex h-9 items-center rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {featured.length > 0 && (
            <div className="flex w-full flex-col items-center gap-2.5">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Or try a featured pick
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {featured.map((app) => (
                  <Link
                    key={app.slug}
                    href={`/apps/${app.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.04] px-3 text-[13px] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                  >
                    {app.name}
                    <ArrowUpRight className="h-3 w-3 text-[var(--color-ink-dim)]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
