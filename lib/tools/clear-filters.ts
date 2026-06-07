/**
 * Resets every directory filter param to null in one call. Shared by the
 * console's "Clear all" and the empty-state "Clear filters" CTA so the param
 * list lives in exactly one place and the two callers can't drift apart.
 *
 * The argument is the `setFilter` returned by the directory `useQueryStates`.
 */
interface ClearableFilter {
  category: null;
  pricing: null;
  deployment: null;
  platform: null;
  license: null;
  status: null;
  sort: null;
  q: null;
}

export function clearFilters(setFilter: (values: ClearableFilter) => unknown): void {
  void setFilter({
    category: null,
    pricing: null,
    deployment: null,
    platform: null,
    license: null,
    status: null,
    sort: null,
    q: null,
  });
}
