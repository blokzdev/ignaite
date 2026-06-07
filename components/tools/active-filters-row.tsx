"use client";
import { useDirectoryFilters } from "@/hooks/use-directory-filters";
import { ActiveFilterPills } from "./active-filter-pills";

// The applied-filter pills + "clear all", shown in the grid flow above the
// results (scrolls with content). The search box, facets, sort, and count now
// live in the pinned header console; only this at-a-glance "what's applied" row
// stays with the grid. Renders nothing until something is filtered.
export function ActiveFiltersRow() {
  const { hasFilter, activeFilters, clearAll } = useDirectoryFilters();
  if (!hasFilter) return null;
  return (
    <div className="mb-8">
      <ActiveFilterPills filters={activeFilters} onClearAll={clearAll} />
    </div>
  );
}
