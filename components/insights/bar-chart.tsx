import Link from "next/link";
import type { StatSlice } from "@/lib/stats";

interface BarChartProps {
  slices: StatSlice[];
  /** Denominator for the share percentage (the active listing total). */
  total: number;
}

// A hand-rolled, pure-RSC horizontal bar chart — zero client JS, zero charting
// dep. Accessible by construction: each row carries the label + exact count +
// share as real text (the bar itself is decorative, aria-hidden), so there's no
// visual-only data needing a separate sr-only table. Slices that map to a
// directory facet link through to the filtered grid, so the chart can't drift
// from the live counts. "Unrecorded" slices render muted (and are labelled, so
// meaning never rides on colour alone).
export function BarChart({ slices, total }: BarChartProps) {
  const max = Math.max(1, ...slices.map((s) => s.count));
  return (
    <ul className="space-y-2.5">
      {slices.map((s) => {
        const pct = total ? Math.round((s.count / total) * 100) : 0;
        const width = Math.max(2, Math.round((s.count / max) * 100));
        const muted = s.key === "unrecorded";
        return (
          <li
            key={s.key}
            className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[10rem_1fr_auto]"
          >
            <div className="min-w-0 truncate text-sm text-[var(--color-ink-soft)]">
              {s.href ? (
                <Link
                  href={s.href}
                  className="rounded underline-offset-4 hover:text-[var(--color-ink)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                >
                  {s.label}
                </Link>
              ) : (
                <span className={muted ? "text-[var(--color-ink-dim)]" : undefined}>{s.label}</span>
              )}
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.05]" aria-hidden>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${width}%`,
                  background: muted ? "var(--color-ink-dim)" : "var(--color-accent)",
                }}
              />
            </div>
            <div className="text-right font-mono text-xs whitespace-nowrap text-[var(--color-ink)]">
              {s.count.toLocaleString()}
              <span className="text-[var(--color-ink-dim)]"> · {pct}%</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
