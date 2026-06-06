// Height-matched placeholder for the directory console (search row + category
// strip), shown while the dynamically-imported console hydrates. Pure markup —
// no apps data, no filter logic — so site-nav can render it as the Suspense
// fallback without dragging the console's chunk into the shared nav bundle.
// Keep its row heights in sync with directory-console.tsx to avoid layout shift.
export function DirectoryConsoleSkeleton() {
  return (
    <div aria-hidden className="container-site px-6">
      <div className="flex items-center gap-2 pb-3">
        <div className="h-9 flex-1 rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset" />
        <div className="hidden h-9 w-24 rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset sm:block" />
        <div className="h-9 w-24 rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset" />
      </div>
      <div className="flex items-center gap-1.5 overflow-hidden pb-3">
        {[64, 52, 80, 48, 72, 56, 68].map((w, i) => (
          <div
            key={i}
            style={{ width: w }}
            className="h-9 shrink-0 rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset"
          />
        ))}
      </div>
    </div>
  );
}
