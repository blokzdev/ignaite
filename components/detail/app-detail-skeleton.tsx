import { Skeleton } from "@/components/ui/skeleton";
import { ToolCardSkeleton } from "@/components/tools/tool-card-skeleton";

// Navigation placeholder for /apps/[slug] — reproduces the DetailShell wrapper
// and the AppDetail body's structure so the route transition shows an instant,
// layout-faithful skeleton. Server component (used by the route's loading.tsx).
export function AppDetailSkeleton() {
  return (
    <div className="relative overflow-clip px-6 pt-32 pb-28 sm:pt-40 sm:pb-24">
      <span role="status" aria-live="polite" className="sr-only">
        Loading app…
      </span>

      <div className="relative mx-auto max-w-4xl">
        {/* Breadcrumb + copy-link row */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton variant="pulse" className="h-4 w-40" />
          <Skeleton variant="pulse" className="h-8 w-8 rounded-full" />
        </div>

        {/* Hero — monogram + category/title/tagline */}
        <header className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Skeleton variant="shimmer" className="h-16 w-16 shrink-0 rounded-2xl sm:h-20 sm:w-20" />
          <div className="flex min-w-0 flex-col gap-3">
            <Skeleton variant="pulse" className="h-3.5 w-32" />
            <Skeleton variant="shimmer" className="h-10 w-64 sm:w-80" />
            <Skeleton variant="shimmer" className="h-5 w-72 sm:w-96" />
          </div>
        </header>

        {/* Chip row */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {[16, 24, 20, 16, 20].map((w, i) => (
            <Skeleton
              key={i}
              variant="pulse"
              className="h-5 rounded-full"
              style={{ width: w * 4 }}
            />
          ))}
        </div>

        {/* Insight aside */}
        <Skeleton variant="shimmer" className="mt-10 h-20 w-full rounded-2xl" />

        {/* Description lines */}
        <div className="mt-12 flex flex-col gap-3">
          <Skeleton variant="shimmer" className="h-4 w-full" />
          <Skeleton variant="shimmer" className="h-4 w-11/12" />
          <Skeleton variant="shimmer" className="h-4 w-10/12" />
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
        </div>

        {/* A content section block (model / platforms) */}
        <Skeleton variant="shimmer" className="mt-12 h-32 w-full rounded-2xl" />

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {[14, 18, 12, 16, 20, 14].map((w, i) => (
            <Skeleton
              key={i}
              variant="pulse"
              className="h-6 rounded-full"
              style={{ width: w * 4 }}
            />
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Skeleton variant="shimmer" className="h-11 w-36 rounded-full" />
          <Skeleton variant="shimmer" className="h-11 w-28 rounded-full" />
        </div>

        {/* Related rail */}
        <div className="mt-20">
          <Skeleton variant="pulse" className="mb-5 h-3.5 w-48" />
          <ul className="no-scrollbar flex gap-5 overflow-x-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex w-[320px] shrink-0 sm:w-[380px]">
                <ToolCardSkeleton />
              </li>
            ))}
          </ul>
        </div>

        {/* Accuracy note */}
        <Skeleton variant="shimmer" className="mt-20 h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}
