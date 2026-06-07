import { Skeleton } from "@/components/ui/skeleton";

// Suspense fallback for ContactForm (its useSearchParams forces a boundary).
// Mirrors the field rhythm so the left column is reserved instead of blank
// until the form hydrates in.
export function ContactFormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      {/* name, email, project-type select */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton variant="pulse" className="h-3 w-24" />
          <Skeleton variant="shimmer" className="h-12 w-full rounded-2xl" />
        </div>
      ))}

      {/* message textarea */}
      <div className="flex flex-col gap-2">
        <Skeleton variant="pulse" className="h-3 w-40" />
        <Skeleton variant="shimmer" className="h-40 w-full rounded-2xl" />
      </div>

      {/* submit */}
      <div className="pt-2">
        <Skeleton variant="shimmer" className="h-11 w-32 rounded-full" />
      </div>
    </div>
  );
}
