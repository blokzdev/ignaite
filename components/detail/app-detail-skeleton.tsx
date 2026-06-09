import { Skeleton } from "@/components/ui/skeleton";
import { ToolCardSkeleton } from "@/components/tools/tool-card-skeleton";

// Navigation placeholder for /apps/[slug] — reproduces the AppDetailShell
// wrapper + the AppDetail body's two-column structure so the route transition
// shows an instant, layout-faithful skeleton. Server component (the route's
// loading.tsx content).
export function AppDetailSkeleton() {
  return (
    <div className="relative px-6 pt-32 pb-28 sm:pt-40 sm:pb-24">
      <span role="status" aria-live="polite" className="sr-only">
        Loading app…
      </span>

      <div className="relative mx-auto max-w-6xl">
        {/* Sticky toolbar */}
        <div className="-mx-6 flex h-[var(--detail-toolbar-h)] items-center justify-between gap-3 border-b border-white/[0.06] px-6">
          <Skeleton variant="pulse" className="h-4 w-40" />
          <Skeleton variant="pulse" className="h-8 w-24 rounded-full" />
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

        {/* Two-column: reading column + spec card */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          {/* Spec card (right on desktop, top on mobile) */}
          <div className="order-1 lg:order-2">
            <Skeleton variant="shimmer" className="h-[22rem] w-full rounded-2xl" />
          </div>

          {/* Reading column */}
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <Skeleton variant="shimmer" className="h-20 w-full rounded-2xl" />
            <Skeleton variant="shimmer" className="h-20 w-full rounded-2xl" />
            <div className="flex flex-col gap-3">
              <Skeleton variant="shimmer" className="h-4 w-full" />
              <Skeleton variant="shimmer" className="h-4 w-11/12" />
              <Skeleton variant="shimmer" className="h-4 w-10/12" />
              <Skeleton variant="shimmer" className="h-4 w-3/4" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton variant="shimmer" className="h-28 w-full rounded-2xl" />
              <Skeleton variant="shimmer" className="h-28 w-full rounded-2xl" />
            </div>
          </div>
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

        {/* Maintenance ledger */}
        <div className="mt-20 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset sm:p-6">
          <Skeleton variant="pulse" className="h-3 w-52" />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton variant="shimmer" className="h-3.5 w-full" />
            <Skeleton variant="shimmer" className="h-3.5 w-4/5" />
          </div>
          <div className="mt-5 border-t border-white/[0.06] pt-5">
            <Skeleton variant="pulse" className="h-3 w-32" />
            <div className="mt-4 space-y-5 border-l border-white/[0.08] pl-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton variant="pulse" className="h-3 w-40" />
                  <Skeleton variant="shimmer" className="h-4 w-11/12" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-5">
            <Skeleton variant="pulse" className="h-3 w-40" />
            <Skeleton variant="pulse" className="h-3 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
