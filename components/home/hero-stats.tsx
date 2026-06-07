import { cn } from "@/lib/utils";

// Compact 3-counter slab for the homepage hero. Server component (SSG-safe),
// no motion — numbers come from the live directory, passed in from page.tsx.
// Mirrors the visual of components/home/stats-strip.tsx, tuned smaller.
export function HeroStats({ total, categories }: Readonly<{ total: number; categories: number }>) {
  const cells: ReadonlyArray<{ value: string; label: string; accent?: boolean }> = [
    { value: `${total}`, label: "Apps" },
    { value: `${categories}`, label: "Categories" },
    { value: "AI", label: "Managed", accent: true },
  ];

  return (
    <ul
      aria-label="Directory by the numbers"
      className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl ring-inset"
    >
      {cells.map((c) => (
        <li
          key={c.label}
          className="flex flex-col items-center gap-1 bg-[var(--color-canvas)]/85 px-2 py-5 text-center sm:py-6"
        >
          <span
            className={cn(
              "text-display text-3xl sm:text-4xl",
              c.accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
            )}
          >
            {c.value}
          </span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-soft)] uppercase">
            {c.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
