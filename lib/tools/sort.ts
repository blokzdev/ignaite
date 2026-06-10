// Single source of truth for the directory's sort model. A sort is one of four
// modes that decompose into a field (date | name) × direction (asc | desc); the
// UI presents two fields with a flip control, while the URL stores the flat mode.
export type SortMode = "newest" | "oldest" | "az" | "za";
export const SORT_MODES: ReadonlyArray<SortMode> = ["newest", "oldest", "az", "za"];

export type SortField = "date" | "name";
export type SortDir = "asc" | "desc";

export const DEFAULT_SORT: SortMode = "newest";

// Trigger / aria label per mode.
export const SORT_LABEL: Record<SortMode, string> = {
  newest: "Newest",
  oldest: "Oldest",
  az: "A → Z",
  za: "Z → A",
};

// Short field label for the two dropdown rows.
export const SORT_FIELD_LABEL: Record<SortField, string> = {
  date: "Date added",
  name: "Name",
};

export const SORT_FIELD: Record<SortMode, SortField> = {
  newest: "date",
  oldest: "date",
  az: "name",
  za: "name",
};

export const SORT_DIR: Record<SortMode, SortDir> = {
  newest: "desc",
  oldest: "asc",
  az: "asc",
  za: "desc",
};

// The mode a field lands on when first selected (date → newest, name → A→Z).
export const FIELD_DEFAULT: Record<SortField, SortMode> = {
  date: "newest",
  name: "az",
};

/** Compose a mode from a field + direction (inverse of SORT_FIELD/SORT_DIR). */
export function modeFor(field: SortField, dir: SortDir): SortMode {
  if (field === "date") return dir === "desc" ? "newest" : "oldest";
  return dir === "asc" ? "az" : "za";
}

/** The mode that flips only the direction of the given mode's field. */
export function flippedMode(mode: SortMode): SortMode {
  return modeFor(SORT_FIELD[mode], SORT_DIR[mode] === "asc" ? "desc" : "asc");
}
