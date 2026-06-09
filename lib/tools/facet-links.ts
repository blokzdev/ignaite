// Builds a directory deep-link for a single facet value, so the spec card's
// metadata chips can pivot into the filtered directory. The query keys + value
// encodings match `directoryFilterParsers` in hooks/use-directory-filters.ts:
// `category|pricing|platform|deployment` are array parsers (a single bare token
// parses into a one-element array — `?category=agent` → ["agent"]); `license`
// and `status` are scalar string-literal parsers. Kept server-safe + in one
// place so the URLs can't drift from the parsers that read them.
export type FacetKey = "category" | "pricing" | "platform" | "deployment" | "license" | "status";

export function facetHref(key: FacetKey, value: string): string {
  return `/?${key}=${encodeURIComponent(value)}`;
}
