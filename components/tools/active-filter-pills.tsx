"use client";
import { X } from "lucide-react";
import type { ActiveFilter } from "@/hooks/use-directory-filters";

interface Props {
  filters: ReadonlyArray<ActiveFilter>;
  onClearAll: () => void;
}

export function ActiveFilterPills({ filters, onClearAll }: Readonly<Props>) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={f.onRemove}
          aria-label={`Remove filter ${f.label}`}
          className="group inline-flex h-7 items-center gap-1.5 rounded-full bg-white/[0.06] pr-2 pl-3 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          {f.label}
          <X className="h-3 w-3 text-[var(--color-ink-dim)] transition-colors group-hover:text-[var(--color-ink)]" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        Clear all
      </button>
    </div>
  );
}
