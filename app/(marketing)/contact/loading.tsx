import { Skeleton } from "@/components/ui/skeleton";

// Per-route navigation skeleton — same rationale as about/loading.tsx: the old
// group-level app/(marketing)/loading.tsx was removed because a loading
// boundary on the `/` segment trips vercel/next.js#86151 (soft navigation to
// `/?…` stuck on the fallback forever). Don't re-add one at the group root.
export default function Loading() {
  return (
    <div className="relative px-6 pt-40 pb-32 sm:pt-44">
      <span role="status" aria-live="polite" className="sr-only">
        Loading…
      </span>
      <div className="container-site relative">
        {/* Masthead */}
        <div className="mb-12 flex max-w-3xl flex-col gap-4">
          <Skeleton variant="pulse" className="h-3.5 w-40" />
          <Skeleton variant="shimmer" className="h-12 w-80 sm:w-[28rem]" />
          <Skeleton variant="shimmer" className="h-4 w-64" />
        </div>
        {/* Content slabs */}
        <div className="flex flex-col gap-5">
          <Skeleton variant="shimmer" className="h-40 w-full rounded-2xl" />
          <Skeleton variant="shimmer" className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
