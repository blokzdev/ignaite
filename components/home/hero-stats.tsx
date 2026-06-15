import { cn } from "@/lib/utils";
import { Counter } from "./counter";
import { StatTicker } from "./stat-ticker";

const LABEL_CLASS = "font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-soft)] uppercase";
const VALUE_CLASS = "text-display text-3xl tabular-nums sm:text-4xl";

// Compact 3-counter slab for the homepage hero. Server component (SSG-safe);
// numbers come from the live directory, passed in from page.tsx. The two numeric
// cells animate 0→value via the <Counter> island; the third cell cycles a set of
// live metrics (number + label together) via the <StatTicker> island.
export function HeroStats({
  total,
  categories,
  metrics,
}: Readonly<{
  total: number;
  categories: number;
  metrics: ReadonlyArray<{ value: number; label: string }>;
}>) {
  return (
    <ul
      aria-label="Directory by the numbers"
      className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl ring-inset"
    >
      <li className="flex flex-col items-center gap-1 bg-[var(--color-canvas)]/85 px-2 py-5 text-center sm:py-6">
        <Counter value={total} className={cn(VALUE_CLASS, "text-[var(--color-ink)]")} />
        <span className={LABEL_CLASS}>Apps</span>
      </li>
      <li className="flex flex-col items-center gap-1 bg-[var(--color-canvas)]/85 px-2 py-5 text-center sm:py-6">
        <Counter value={categories} className={cn(VALUE_CLASS, "text-[var(--color-ink)]")} />
        <span className={LABEL_CLASS}>Categories</span>
      </li>
      <li className="flex flex-col items-center gap-1 bg-[var(--color-canvas)]/85 px-2 py-5 text-center sm:py-6">
        <StatTicker
          stats={metrics}
          valueClassName={cn(VALUE_CLASS, "text-[var(--color-accent)]")}
          labelClassName={LABEL_CLASS}
        />
      </li>
    </ul>
  );
}
