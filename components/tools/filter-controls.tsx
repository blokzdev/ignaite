"use client";
import { APP_CATEGORIES, APP_PRICING, BLOKZ_MARKS } from "@/types/app";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABEL,
  MARK_LABEL,
  PRICING_LABEL,
  STATUS_FILTERS,
  STATUS_LABEL,
  type DirectoryFilters,
} from "@/hooks/use-directory-filters";

interface Props {
  filters: DirectoryFilters;
  /** "inline" = horizontal-scroll rows (desktop bar); "stacked" = wrapping rows (drawer). */
  variant?: "inline" | "stacked";
}

export function FilterControls({ filters, variant = "inline" }: Readonly<Props>) {
  const { filter } = filters;
  const stacked = variant === "stacked";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        !stacked && "no-scrollbar scroll-fade-x -mx-2 overflow-x-auto px-2",
      )}
    >
      <FilterRow label="Category" stacked={stacked}>
        <Chip active={filter.category.length === 0} onClick={filters.resetCategory}>
          All
        </Chip>
        {APP_CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={filter.category.includes(c)}
            onClick={() => filters.toggleCategory(c)}
          >
            {CATEGORY_LABEL[c]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="Pricing" stacked={stacked}>
        <Chip active={filter.pricing.length === 0} onClick={filters.resetPricing}>
          All
        </Chip>
        {APP_PRICING.map((p) => (
          <Chip
            key={p}
            active={filter.pricing.includes(p)}
            onClick={() => filters.togglePricing(p)}
          >
            {PRICING_LABEL[p]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="Blokz mark" stacked={stacked}>
        <Chip active={filter.blokzMark.length === 0} onClick={filters.resetMark}>
          All
        </Chip>
        {BLOKZ_MARKS.map((m) => (
          <Chip key={m} active={filter.blokzMark.includes(m)} onClick={() => filters.toggleMark(m)}>
            {MARK_LABEL[m]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="Status" stacked={stacked}>
        {STATUS_FILTERS.map((s) => (
          <Chip
            key={s}
            active={(filter.status ?? "active") === s}
            onClick={() => filters.setStatus(s === "active" ? null : s)}
          >
            {STATUS_LABEL[s]}
          </Chip>
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({
  label,
  stacked,
  children,
}: {
  label: string;
  stacked: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", stacked ? "flex-wrap" : "flex-nowrap")}>
      <span className="mr-2 shrink-0 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}
