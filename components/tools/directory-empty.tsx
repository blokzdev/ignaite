"use client";
import { SearchX } from "lucide-react";

interface Props {
  filtersApplied: boolean;
  onClear: () => void;
}

export function DirectoryEmpty({ filtersApplied, onClear }: Readonly<Props>) {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset"
      >
        <SearchX className="h-5 w-5 text-[var(--color-ink-dim)]" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          No matches
        </p>
        <p className="mx-auto max-w-sm text-sm text-[var(--color-ink-dim)]">
          {filtersApplied
            ? "Nothing fits that combination. Try widening or clearing your filters."
            : "Nothing here yet — check back as the directory grows."}
        </p>
      </div>
      {filtersApplied && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center rounded-full bg-[var(--color-accent)]/[0.12] px-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.2] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
