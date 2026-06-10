import { Skeleton } from "@/components/ui/skeleton";
import { ToolCardSkeleton } from "@/components/tools/tool-card-skeleton";

// Navigation placeholder for /apps/[slug] — mirrors the AppDetail zone layout
// (masthead → stat strip → brief + dossier) so the route transition shows an
// instant, layout-faithful skeleton. Server component (the route's loading.tsx).
export function AppDetailSkeleton() {
  return (
    <div className="relative pt-12 pb-28 sm:pb-24">
      <span role="status" aria-live="polite" className="sr-only">
        Loading app…
      </span>

      {/* Sticky toolbar — full-bleed, flush under the header */}
      <div className="h-[var(--detail-toolbar-h)] border-b border-white/[0.06]">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-6">
          <Skeleton variant="pulse" className="h-4 w-40" />
          <Skeleton variant="pulse" className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Masthead — identity (left) + action cluster (right on lg) */}
        <header className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <Skeleton
              variant="shimmer"
              className="h-16 w-16 shrink-0 rounded-2xl sm:h-20 sm:w-20"
            />
            <div className="flex min-w-0 flex-col gap-3">
              <Skeleton variant="pulse" className="h-3.5 w-36" />
              <Skeleton variant="shimmer" className="h-10 w-56 sm:w-72" />
              <Skeleton variant="shimmer" className="h-5 w-64 sm:w-80" />
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Skeleton variant="shimmer" className="h-11 w-40 rounded-full" />
            <Skeleton variant="pulse" className="h-11 w-11 rounded-full" />
            <Skeleton variant="pulse" className="h-11 w-11 rounded-full" />
          </div>
        </header>

        {/* Stat strip band */}
        <div className="-mx-6 mt-6 border-y border-white/[0.06]">
          <div className="flex gap-8 px-6 py-3.5">
            {[14, 16, 18, 14, 20, 16].map((w, i) => (
              <div key={i} className="flex shrink-0 flex-col gap-1.5">
                <Skeleton variant="pulse" className="h-2 w-12" />
                <Skeleton variant="shimmer" className="h-3.5 rounded" style={{ width: w * 5 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Brief + dossier */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-col gap-3">
              <Skeleton variant="shimmer" className="h-4 w-full" />
              <Skeleton variant="shimmer" className="h-4 w-11/12" />
              <Skeleton variant="shimmer" className="h-4 w-10/12" />
              <Skeleton variant="shimmer" className="h-4 w-3/4" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Skeleton variant="shimmer" className="h-24 w-full rounded-2xl" />
              <Skeleton variant="shimmer" className="h-24 w-full rounded-2xl" />
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Skeleton variant="shimmer" className="h-28 w-full rounded-2xl" />
              <Skeleton variant="shimmer" className="h-28 w-full rounded-2xl" />
            </div>
          </div>
          <Skeleton variant="shimmer" className="h-80 w-full rounded-2xl" />
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
