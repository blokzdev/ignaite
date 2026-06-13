"use client";
import { APP_DEPLOYMENTS, APP_PLATFORMS, APP_PRICING } from "@/types/app";
import { cn } from "@/lib/utils";
import { POPULATED_CATEGORIES } from "@/lib/tools/populated-categories";
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
import { CategoryClusterPicker } from "./category-cluster-picker";
import { FilterChip } from "./filter-chip";

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
      {!hidden("category") &&
        // Stacked (the mobile sheet) gets the clustered picker + type-ahead —
        // 39 flat chips were an unscannable wall. The inline variant keeps the
        // single scrolling row (currently caller-less; the console strip is a
        // separate surface).
        (stacked ? (
          <CategoryClusterPicker filters={filters} counts={counts} idPrefix="drawer" />
        ) : (
          <FilterRow label="Category" stacked={stacked}>
            <FilterChip
              label="All"
              active={filter.category.length === 0}
              onClick={filters.resetCategory}
              count={counts?.all.category}
              reset
            />
            {POPULATED_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={CATEGORY_LABEL[c]}
                active={filter.category.includes(c)}
                onClick={() => filters.toggleCategory(c)}
                count={counts?.category[c]}
              />
            ))}
          </FilterRow>
        ))}

      {!hidden("pricing") && (
        <FilterRow label="Pricing" stacked={stacked}>
          <FilterChip
            label="All"
            active={filter.pricing.length === 0}
            onClick={filters.resetPricing}
            count={counts?.all.pricing}
            reset
          />
          {APP_PRICING.map((p) => (
            <FilterChip
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
          <FilterChip
            label="All"
            active={filter.platform.length === 0}
            onClick={filters.resetPlatform}
            count={counts?.all.platform}
            reset
          />
          {APP_PLATFORMS.map((p) => (
            <FilterChip
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
          <FilterChip
            label="All"
            active={filter.deployment.length === 0}
            onClick={filters.resetDeployment}
            count={counts?.all.deployment}
            reset
          />
          {APP_DEPLOYMENTS.map((d) => (
            <FilterChip
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
          <FilterChip
            label="All"
            active={filter.license == null}
            onClick={() => filters.setLicense(null)}
            count={counts?.all.license}
            reset
          />
          {LICENSE_SIGNALS.map((l) => (
            <FilterChip
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
            <FilterChip
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
