"use client";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Live faceted count (undefined ⇒ no count shown). */
  count?: number;
  /** The facet's "All" reset chip — never dimmed (clearing is always valid). */
  reset?: boolean;
}

// The standard facet chip, shared by FilterControls' rows and the
// CategoryClusterPicker (the console strip keeps its own h-8 CategoryChip with
// data-category scroll wiring).
export function FilterChip({ label, active, onClick, count, reset }: Readonly<FilterChipProps>) {
  // A zero-result option (that isn't already selected) is a dead end — dim it and
  // take it out of the tab order. Active chips and the "All" reset are never
  // disabled, so a selection can always be undone.
  const dead = !reset && !active && count === 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={dead}
      aria-pressed={active}
      aria-label={
        count == null ? label : count === 0 ? `${label}, no matches` : `${label}, ${count} apps`
      }
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
        dead &&
          "pointer-events-none opacity-40 hover:bg-white/[0.04] hover:text-[var(--color-ink-dim)]",
      )}
    >
      {label}
      {count != null && (
        // Inherits the chip's text colour (flips with active/hover) + steps down
        // in size as secondary metadata; full token colour keeps it AA-legible.
        <span className="text-[10px] tracking-normal tabular-nums">{count}</span>
      )}
    </button>
  );
}
