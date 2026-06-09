import appsIndex from "@/.velite/apps-search.json";
import { APP_CATEGORIES, type AppCategory } from "@/types/app";

// Categories that actually have at least one listing, in canonical cluster
// order. Derived from the slim search index (one small JSON — no full-dataset
// import, so it's cheap on every route) and computed once at module load.
//
// Every category-picking surface (the homepage chip strip, the Filters drawer,
// the /contact compare picker) renders THIS rather than the raw APP_CATEGORIES
// enum, so a category added to the enum ahead of its listings — the taxonomy
// rolls out across several PRs — never shows an empty "0" chip. The full enum
// stays reachable via the URL (?category=…) and the ⌘K palette.
const present = new Set<string>(appsIndex.map((a) => a.category));

export const POPULATED_CATEGORIES: ReadonlyArray<AppCategory> = APP_CATEGORIES.filter((c) =>
  present.has(c),
);
