import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: Readonly<{ items: ReadonlyArray<Crumb> }>) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      {/* nowrap + the last-crumb truncate keeps the trail on one line in tight
          toolbars (long app names ellipsize instead of wrapping the bar). */}
      <ol className="flex min-w-0 flex-nowrap items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex min-w-0 items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate text-[var(--color-ink)]">
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden
                  className="h-3 w-3 shrink-0 text-[var(--color-ink-dim)]"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
