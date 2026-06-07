import { cn } from "@/lib/utils";
import { Counter } from "./counter";

// Compact 3-counter slab for the homepage hero. Server component (SSG-safe);
// numbers come from the live directory, passed in from page.tsx. The two numeric
// cells animate 0→value via the <Counter> island; the "AI" cell is static.
// Mirrors the visual of components/home/stats-strip.tsx, tuned smaller.
export function HeroStats({ total, categories }: Readonly<{ total: number; categories: number }>) {
  const cells: ReadonlyArray<{ num?: number; text?: string; label: string; accent?: boolean }> = [
    { num: total, label: "Apps" },
    { num: categories, label: "Categories" },
    { text: "AI", label: "Managed", accent: true },
  ];

  return (
    <ul
      aria-label="Directory by the numbers"
      className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl ring-inset"
    >
      {cells.map((c) => {
        const valueClass = cn(
          "text-display text-3xl tabular-nums sm:text-4xl",
          c.accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
        );
        return (
          <li
            key={c.label}
            className="flex flex-col items-center gap-1 bg-[var(--color-canvas)]/85 px-2 py-5 text-center sm:py-6"
          >
            {c.num !== undefined ? (
              <Counter value={c.num} className={valueClass} />
            ) : (
              <span className={valueClass}>{c.text}</span>
            )}
            <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-soft)] uppercase">
              {c.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
