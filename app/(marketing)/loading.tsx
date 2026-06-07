import { Skeleton } from "@/components/ui/skeleton";

// Shared navigation skeleton for the marketing routes (/, /about, /contact).
// Neutral masthead + content slabs so it reads fine on any of them; /apps/[slug]
// overrides this with its own richer skeleton.
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
