"use client";
import { LayoutGrid, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/hooks/use-view-mode";

const OPTIONS: ReadonlyArray<{ value: ViewMode; label: string; Icon: typeof LayoutGrid }> = [
  { value: "grid", label: "Grid view", Icon: LayoutGrid },
  { value: "list", label: "List view", Icon: Rows3 },
];

// Segmented grid/list switch, sized to sit beside the console's other round
// controls (sort, filters). Mirrors their ring/height; `aria-pressed` per option.
export function ViewToggle({
  view,
  onChange,
  className,
}: Readonly<{ view: ViewMode; onChange: (v: ViewMode) => void; className?: string }>) {
  return (
    <div
      role="group"
      aria-label="View"
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full bg-white/[0.04] p-0.5 ring-1 ring-white/[0.08] ring-inset",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
              active
                ? "bg-white/[0.08] text-[var(--color-ink)]"
                : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
