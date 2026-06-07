import { Skeleton } from "@/components/ui/skeleton";

// Loading placeholder mirroring ToolCard's layout + spacing so the grid keeps
// its rhythm and swaps to real content without shifting. Server component;
// aria-hidden as a whole (the surrounding loading.tsx owns the sr-only status).
export function ToolCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-[var(--color-surface)]/70 p-5 ring-1 ring-white/[0.08] ring-inset"
    >
      {/* Chips row */}
      <div className="flex items-center gap-2">
        <Skeleton variant="pulse" className="h-5 w-20 rounded-full" />
        <Skeleton variant="pulse" className="h-5 w-16 rounded-full" />
      </div>

      {/* Monogram + name */}
      <div className="flex items-start gap-3">
        <Skeleton variant="shimmer" className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-col gap-1.5 pt-1">
          <Skeleton variant="shimmer" className="h-4 w-32" />
          <Skeleton variant="shimmer" className="h-3 w-20" />
        </div>
      </div>

      {/* Tagline + description lines */}
      <div className="flex flex-col gap-2">
        <Skeleton variant="shimmer" className="h-3.5 w-full" />
        <Skeleton variant="shimmer" className="h-3.5 w-4/5" />
        <Skeleton variant="shimmer" className="mt-1 h-3 w-full" />
        <Skeleton variant="shimmer" className="h-3 w-11/12" />
        <Skeleton variant="shimmer" className="h-3 w-2/3" />
      </div>

      {/* Insight block */}
      <Skeleton variant="shimmer" className="h-12 w-full rounded-xl" />

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5">
        <Skeleton variant="pulse" className="h-5 w-14 rounded-full" />
        <Skeleton variant="pulse" className="h-5 w-16 rounded-full" />
        <Skeleton variant="pulse" className="h-5 w-12 rounded-full" />
      </div>

      {/* CTA row */}
      <div className="mt-auto flex items-center gap-2 pt-2">
        <Skeleton variant="shimmer" className="h-10 w-24 rounded-full sm:h-9" />
        <Skeleton variant="shimmer" className="h-10 w-10 rounded-full sm:h-9 sm:w-9" />
      </div>
    </article>
  );
}
