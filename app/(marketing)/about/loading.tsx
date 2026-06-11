import { Skeleton } from "@/components/ui/skeleton";

// Per-route navigation skeleton. This used to be a single group-level
// app/(marketing)/loading.tsx shared by /, /about and /contact, but a loading
// boundary on the `/` segment trips an open Next.js bug
// (https://github.com/vercel/next.js/issues/86151): a soft navigation to
// `/?category=…` can get stuck on the fallback forever when the query was only
// ever set shallowly (nuqs replaceState) — see BACKLOG.md [debt]. So the
// directory deliberately has NO route-level loading boundary (its page-level
// <Suspense> fallback covers it), /apps/[slug] dropped its loading.tsx for the
// same reason, and /about + /contact keep theirs per-route (no query-string
// navigation targets here). Don't re-add a loading.tsx at the (marketing)
// group root or on the directory/detail segments.
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
