import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Pinned bottom CTA on mobile so the primary action stays reachable as the page
// scrolls. Hidden ≥sm where the in-page CTA suffices. Safe-area aware.
export function DetailStickyBar({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-white/[0.08] bg-[var(--color-canvas)]/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
      >
        {label}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
