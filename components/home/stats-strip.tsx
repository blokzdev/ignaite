import { portfolioStats } from "@/lib/projects";

// Compact, honest credibility strip for /about. Server component (SSG-safe),
// no motion — numbers are derived from data/projects.ts, not hardcoded.
export function StatsStrip() {
  const { shipped, chains, sinceYear } = portfolioStats();
  if (shipped === 0) return null;

  const cells: ReadonlyArray<{ value: string; label: string }> = [
    { value: `${shipped}`, label: "Apps shipped" },
    { value: `${chains}`, label: "Chains explored" },
    { value: `${sinceYear}`, label: "Building since" },
  ];

  return (
    <section aria-label="Studio by the numbers" className="relative px-6 py-12 sm:py-16">
      <div className="container-site">
        <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl ring-inset">
          {cells.map((c) => (
            <li
              key={c.label}
              className="flex flex-col items-center gap-1.5 bg-[var(--color-canvas)]/85 px-3 py-7 text-center sm:py-8"
            >
              <span className="text-display text-4xl text-[var(--color-ink)] sm:text-5xl">
                {c.value}
              </span>
              <span className="text-eyebrow text-[var(--color-ink-soft)]">{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
