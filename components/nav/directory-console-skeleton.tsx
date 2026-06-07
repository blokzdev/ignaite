// Height-matched placeholder for the directory console (search row + category
// strip), shown while the dynamically-imported console hydrates. Pure markup —
// no apps data, no filter logic — so site-nav can render it as the Suspense
// fallback without dragging the console's chunk into the shared nav bundle.
// Keep its row heights in sync with directory-console.tsx to avoid layout shift.
export function DirectoryConsoleSkeleton() {
  return (
    <div aria-hidden className="container-site px-6">
      <div className="flex items-center gap-2 pt-2.5 pb-2.5">
        <div className="h-8 flex-1 animate-pulse rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset motion-reduce:animate-none" />
        <div className="hidden h-8 w-24 animate-pulse rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset motion-reduce:animate-none sm:block" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset motion-reduce:animate-none" />
      </div>
      <div className="flex items-center gap-1.5 overflow-hidden pb-2.5">
        {[64, 52, 80, 48, 72, 56, 68].map((w, i) => (
          <div
            key={i}
            style={{ width: w }}
            className="h-8 shrink-0 animate-pulse rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
