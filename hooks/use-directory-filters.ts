"use client";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { APP_CATEGORIES, APP_DEPLOYMENTS, APP_PLATFORMS, APP_PRICING } from "@/types/app";
import type { AppCategory, AppDeployment, AppPlatform, AppPricing } from "@/types/app";
import { LICENSE_LABEL, LICENSE_SIGNALS, type LicenseSignal } from "@/lib/tools/license";
import { clearFilters } from "@/lib/tools/clear-filters";

export type StatusFilter = "active" | "archived" | "all";
export const STATUS_FILTERS: ReadonlyArray<StatusFilter> = ["active", "archived", "all"];

export type SortMode = "featured" | "recent" | "alpha";
export const SORT_MODES: ReadonlyArray<SortMode> = ["featured", "recent", "alpha"];

export const CATEGORY_LABEL: Record<AppCategory, string> = {
  ide: "IDE",
  agent: "Agent",
  assistant: "Assistant",
  orchestration: "Orchestration",
  mcp: "MCP",
  eval: "Eval",
  infra: "Infra",
  memory: "Memory",
  "vector-db": "Vector DB",
  voice: "Voice",
  vision: "Vision",
  "image-gen": "Image",
  video: "Video",
  audio: "Audio",
  "3d": "3D",
  search: "Search",
  "data-ops": "Data Ops",
  observability: "Observability",
  inference: "Inference",
  "fine-tuning": "Fine-tuning",
  "research-platform": "Research",
  "browser-extension": "Browser Ext.",
  automation: "Automation",
};

export const PRICING_LABEL: Record<AppPricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "byo-key": "BYO key",
};

export const DEPLOYMENT_LABEL: Record<AppDeployment, string> = {
  cloud: "Cloud",
  "self-host": "Self-host",
  local: "Local",
  hybrid: "Hybrid",
};

// Compact chip labels for the platform filter (the "where it runs" axis — the
// surfaces an app runs on, distinct from DEPLOYMENT_LABEL's hosting axis). The
// detail page keeps its own fuller PLATFORM_LABEL; these stay short for chips.
export const PLATFORM_LABEL: Record<AppPlatform, string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  cli: "CLI",
  api: "API",
  "browser-extension": "Browser Ext.",
  "vscode-extension": "VS Code",
};

export const STATUS_LABEL: Record<StatusFilter, string> = {
  active: "Active",
  archived: "Archived",
  all: "All",
};

export const SORT_LABEL: Record<SortMode, string> = {
  featured: "Featured",
  recent: "Recent",
  alpha: "A → Z",
};

// Single source of truth for the directory's URL filter params. Imported by
// tools-browser (read + the empty-state pick/clear) and this hook so the parser
// config never drifts between the readers and the writers.
export const directoryFilterParsers = {
  category: parseAsArrayOf(parseAsStringLiteral(APP_CATEGORIES)).withDefault([]),
  pricing: parseAsArrayOf(parseAsStringLiteral(APP_PRICING)).withDefault([]),
  deployment: parseAsArrayOf(parseAsStringLiteral(APP_DEPLOYMENTS)).withDefault([]),
  platform: parseAsArrayOf(parseAsStringLiteral(APP_PLATFORMS)).withDefault([]),
  license: parseAsStringLiteral(LICENSE_SIGNALS),
  status: parseAsStringLiteral(STATUS_FILTERS),
  sort: parseAsStringLiteral(SORT_MODES),
  q: parseAsString,
};
export const directoryFilterOptions = { shallow: true, history: "replace" as const };

export interface ActiveFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

/**
 * Encapsulates the directory's nuqs filter state + every mutation, so the filter
 * bar, the mobile drawer, and the active-filter pills all share one definition.
 * Each caller gets its own subscription; the URL is the single source of truth.
 */
export function useDirectoryFilters() {
  const [filter, setFilter] = useQueryStates(directoryFilterParsers, directoryFilterOptions);

  const toggleCategory = (value: AppCategory) => {
    const next = filter.category.includes(value)
      ? filter.category.filter((v) => v !== value)
      : [...filter.category, value];
    void setFilter({ category: next.length > 0 ? next : null });
  };
  const togglePricing = (value: AppPricing) => {
    const next = filter.pricing.includes(value)
      ? filter.pricing.filter((v) => v !== value)
      : [...filter.pricing, value];
    void setFilter({ pricing: next.length > 0 ? next : null });
  };
  const toggleDeployment = (value: AppDeployment) => {
    const next = filter.deployment.includes(value)
      ? filter.deployment.filter((v) => v !== value)
      : [...filter.deployment, value];
    void setFilter({ deployment: next.length > 0 ? next : null });
  };
  const togglePlatform = (value: AppPlatform) => {
    const next = filter.platform.includes(value)
      ? filter.platform.filter((v) => v !== value)
      : [...filter.platform, value];
    void setFilter({ platform: next.length > 0 ? next : null });
  };
  const resetCategory = () => void setFilter({ category: null });
  const resetPricing = () => void setFilter({ pricing: null });
  const resetDeployment = () => void setFilter({ deployment: null });
  const resetPlatform = () => void setFilter({ platform: null });
  const setLicense = (value: LicenseSignal | null) => void setFilter({ license: value });
  const setStatus = (value: StatusFilter | null) => void setFilter({ status: value });
  const setSort = (value: SortMode) =>
    void setFilter({ sort: value === "featured" ? null : value });
  const setQuery = (value: string | null) =>
    void setFilter({ q: value && value.length > 0 ? value : null });

  const sortMode: SortMode = filter.sort ?? "featured";
  const statusActive = (filter.status ?? "active") !== "active";
  const hasFilter =
    filter.category.length > 0 ||
    filter.pricing.length > 0 ||
    filter.deployment.length > 0 ||
    filter.platform.length > 0 ||
    filter.license != null ||
    statusActive ||
    (filter.q?.length ?? 0) > 0;

  const clearAll = () => {
    const snap = filter;
    clearFilters(setFilter);
    toast("Filters cleared", {
      action: {
        label: "Undo",
        onClick: () =>
          void setFilter({
            category: snap.category.length ? snap.category : null,
            pricing: snap.pricing.length ? snap.pricing : null,
            deployment: snap.deployment.length ? snap.deployment : null,
            platform: snap.platform.length ? snap.platform : null,
            license: snap.license,
            status: snap.status,
            sort: snap.sort,
            q: snap.q,
          }),
      },
    });
  };

  const activeFilters: ActiveFilter[] = [
    ...filter.category.map((c) => ({
      id: `cat:${c}`,
      label: CATEGORY_LABEL[c],
      onRemove: () => toggleCategory(c),
    })),
    ...filter.pricing.map((p) => ({
      id: `price:${p}`,
      label: PRICING_LABEL[p],
      onRemove: () => togglePricing(p),
    })),
    ...filter.deployment.map((d) => ({
      id: `deploy:${d}`,
      label: DEPLOYMENT_LABEL[d],
      onRemove: () => toggleDeployment(d),
    })),
    ...filter.platform.map((p) => ({
      id: `plat:${p}`,
      label: PLATFORM_LABEL[p],
      onRemove: () => togglePlatform(p),
    })),
    ...(filter.license != null
      ? [
          {
            id: "license",
            label: LICENSE_LABEL[filter.license],
            onRemove: () => setLicense(null),
          },
        ]
      : []),
    ...(statusActive
      ? [
          {
            id: "status",
            label: STATUS_LABEL[(filter.status ?? "active") as StatusFilter],
            onRemove: () => setStatus(null),
          },
        ]
      : []),
    ...((filter.q?.length ?? 0) > 0
      ? [{ id: "q", label: `“${filter.q}”`, onRemove: () => void setFilter({ q: null }) }]
      : []),
  ];

  return {
    filter,
    toggleCategory,
    togglePricing,
    toggleDeployment,
    togglePlatform,
    resetCategory,
    resetPricing,
    resetDeployment,
    resetPlatform,
    setLicense,
    setStatus,
    setSort,
    setQuery,
    sortMode,
    hasFilter,
    clearAll,
    activeFilters,
  };
}

export type DirectoryFilters = ReturnType<typeof useDirectoryFilters>;
