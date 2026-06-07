import { Skeleton } from "@/components/ui/skeleton";
import { ToolCardSkeleton } from "./tool-card-skeleton";

// Height-matched placeholder for FeaturedCarousel — same tray, header, rail, and
// dot rows — so the homepage reserves the spotlight space from first paint and
// hydration swaps the real carousel in without shoving the grid down.
export function FeaturedCarouselSkeleton() {
  return (
    <section aria-hidden className="mb-12">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]/50 p-4 ring-1 ring-white/[0.07] ring-inset sm:p-5">
        {/* Header: segmented toggle + arrows */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton variant="pulse" className="h-9 w-56 rounded-full" />
          <div className="hidden items-center gap-2 sm:flex">
            <Skeleton variant="pulse" className="h-8 w-8 rounded-full" />
            <Skeleton variant="pulse" className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Rail — card-width skeletons mirroring the real snap rail. */}
        <ul className="no-scrollbar -mx-4 -my-3 flex gap-5 overflow-x-hidden px-4 py-3 sm:-mx-5 sm:px-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex w-[320px] shrink-0 sm:w-[380px]">
              <ToolCardSkeleton />
            </li>
          ))}
        </ul>

        {/* Position dots */}
        <div className="mt-3 flex flex-nowrap justify-center gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="pulse" className="h-1.5 w-1.5 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
