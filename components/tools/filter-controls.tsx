"use client";
import { APP_CATEGORIES, APP_DEPLOYMENTS, APP_PLATFORMS, APP_PRICING } from "@/types/app";
import { cn } from "@/lib/utils";
import { LICENSE_LABEL, LICENSE_SIGNALS } from "@/lib/tools/license";
import type { FacetCounts } from "@/lib/tools/facet-counts";
import {
  CATEGORY_LABEL,
  DEPLOYMENT_LABEL,
  PLATFORM_LABEL,
  PRICING_LABEL,
  STATUS_FILTERS,
  STATUS_LABEL,
  type DirectoryFilters,
} from "@/hooks/use-directory-filters";

/** Facet rows this component can render — used by `omit` to drop a row that a
 *  sibling surface owns (e.g. the header console's quick-Category strip). */
export type FacetKey = "category" | "pricing" | "platform" | "deployment" | "source" | "status";

interface Props {
  filters: DirectoryFilters;
  /** "inline" = horizontal-scroll rows (desktop bar); "stacked" = wrapping rows (drawer). */
  variant?: "inline" | "stacked";
  /** Facet rows to hide (the owning surface renders them instead). */
  omit?: ReadonlyArray<FacetKey>;
  /** Live faceted counts. When omitted, chips render without counts/dimming. */
  counts?: FacetCounts;
}

export function FilterControls({ filters, variant = "inline", omit, counts }: Readonly<Props>) {
  const { filter } = filters;
  const stacked = variant === "stacked";
  const hidden = (key: FacetKey) => omit?.includes(key) ?? false;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        !stacked && "no-scrollbar scroll-fade-x -mx-2 overflow-x-auto px-2",
      )}
    >
      {!hidden("category") && (
        <FilterRow label="Category" stacked={stacked}>
          <Chip
            label="All"
            active={filter.category.length === 0}
            onClick={filters.resetCategory}
            count={counts?.all.category}
            reset
          />
          {APP_CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={CATEGORY_LABEL[c]}
              active={filter.category.includes(c)}
              onClick={() => filters.toggleCategory(c)}
              count={counts?.category[c]}
            />
          ))}
        </FilterRow>
      )}

      {!hidden("pricing") && (
        <FilterRow label="Pricing" stacked={stacked}>
          <Chip
            label="All"
            active={filter.pricing.length === 0}
            onClick={filters.resetPricing}
            count={counts?.all.pricing}
            reset
          />
          {APP_PRICING.map((p) => (
            <Chip
              key={p}
              label={PRICING_LABEL[p]}
              active={filter.pricing.includes(p)}
              onClick={() => filters.togglePricing(p)}
              count={counts?.pricing[p]}
            />
          ))}
        </FilterRow>
      )}

      {!hidden("platform") && (
        <FilterRow label="Platform" stacked={stacked}>
          <Chip
            label="All"
            active={filter.platform.length === 0}
            onClick={filters.resetPlatform}
            count={counts?.all.platform}
            reset
          />
          {APP_PLATFORMS.map((p) => (
            <Chip
              key={p}
              label={PLATFORM_LABEL[p]}
              active={filter.platform.includes(p)}
              onClick={() => filters.togglePlatform(p)}
              count={counts?.platform[p]}
            />
          ))}
        </FilterRow>
      )}

      {!hidden("deployment") && (
        <FilterRow label="Deployment" stacked={stacked}>
          <Chip
            label="All"
            active={filter.deployment.length === 0}
            onClick={filters.resetDeployment}
            count={counts?.all.deployment}
            reset
          />
          {APP_DEPLOYMENTS.map((d) => (
            <Chip
              key={d}
              label={DEPLOYMENT_LABEL[d]}
              active={filter.deployment.includes(d)}
              onClick={() => filters.toggleDeployment(d)}
              count={counts?.deployment[d]}
            />
          ))}
        </FilterRow>
      )}

      {!hidden("source") && (
        <FilterRow label="Source" stacked={stacked}>
          <Chip
            label="All"
            active={filter.license == null}
            onClick={() => filters.setLicense(null)}
            count={counts?.all.license}
            reset
          />
          {LICENSE_SIGNALS.map((l) => (
            <Chip
              key={l}
              label={LICENSE_LABEL[l]}
              active={filter.license === l}
              onClick={() => filters.setLicense(l)}
              count={counts?.license[l]}
            />
          ))}
        </FilterRow>
      )}

      {!hidden("status") && (
        <FilterRow label="Status" stacked={stacked}>
          {STATUS_FILTERS.map((s) => (
            <Chip
              key={s}
              label={STATUS_LABEL[s]}
              active={(filter.status ?? "active") === s}
              onClick={() => filters.setStatus(s === "active" ? null : s)}
              count={counts?.status[s]}
            />
          ))}
        </FilterRow>
      )}
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
  label: string;
  active: boolean;
  onClick: () => void;
  /** Live faceted count (undefined ⇒ no count shown). */
  count?: number;
  /** The facet's "All" reset chip — never dimmed (clearing is always valid). */
  reset?: boolean;
}

function Chip({ label, active, onClick, count, reset }: ChipProps) {
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
