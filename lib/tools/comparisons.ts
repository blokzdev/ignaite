import { apps } from "@/.velite";
import type { App, AppCategory } from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";

// The Comparisons engine — a build-time PROJECTION over the verified corpus, no
// new entity. A comparison page exists only for a curated head-to-head: a pair
// (A, B) where one app lists the other in its editorial `alternatives` set (the
// hand-picked "evaluate this instead" graph), both apps are active. `alternatives`
// is treated as UNDIRECTED (A→B or B→A both yield the pair) and the pair is
// deduped to a single canonical URL.
//
// Why curated-only: the mechanical same-category cross-product is tens of
// thousands of thin pages (doorway-page risk). The ~3k curated edges are the
// editorially-vouched, highest-signal comparisons — the only cohort we index.
// Cross-category curated pairs (an IDE vs a CLI agent) are kept on purpose; they
// are the most useful head-to-heads and a shared-category gate would wrongly drop
// them.
//
// Imports @/.velite, so this module is BUILD-TIME ONLY — never pull it into a
// client component (it would drag the full dataset into the bundle).

const isActive = (a: App) => (a.status ?? "active") === "active";

export interface ComparisonPair {
  /** Canonical pair slug: `${slugA}-vs-${slugB}` with slugA < slugB lexically. */
  readonly slug: string;
  /** The two apps in canonical (lexicographic-slug) order. */
  readonly a: App;
  readonly b: App;
}

/** Canonical pair slug — lexicographic so (A,B) and (B,A) collapse to one URL.
 *  Pair slugs are validated by Set membership, never by splitting on "-vs-"
 *  (a real app slug can contain "vs"), so this encoding only has to be stable. */
export function comparisonSlug(slugA: string, slugB: string): string {
  return slugA < slugB ? `${slugA}-vs-${slugB}` : `${slugB}-vs-${slugA}`;
}

/** The comparison route for two app slugs (order-independent). */
export function comparisonHref(slugA: string, slugB: string): string {
  return `/compare/${comparisonSlug(slugA, slugB)}`;
}

const bySlug = new Map(apps.map((a) => [a.slug, a] as const));

// Build the eligible-pair set once at module load (build time). The complete()
// hook already guarantees every `alternatives` slug exists and isn't a self-ref,
// so the only extra guard here is liveness (an alternative can point at an app
// that was later archived — those pairs drop out automatically).
const PAIRS: ReadonlyMap<string, ComparisonPair> = (() => {
  const pairs = new Map<string, ComparisonPair>();
  for (const app of apps) {
    if (!isActive(app)) continue;
    for (const altSlug of app.alternatives ?? []) {
      const alt = bySlug.get(altSlug);
      if (!alt || !isActive(alt)) continue;
      const [a, b] = app.slug < alt.slug ? [app, alt] : [alt, app];
      const slug = `${a.slug}-vs-${b.slug}`;
      if (!pairs.has(slug)) pairs.set(slug, { slug, a, b });
    }
  }
  return pairs;
})();

/** Every eligible comparison pair (canonical, deduped). Drives generateStaticParams. */
export function comparisonPairs(): ReadonlyArray<ComparisonPair> {
  return [...PAIRS.values()];
}

/** Whether a pair slug maps to a real eligible comparison — the route + OG guard. */
export function isComparisonPair(pairSlug: string): boolean {
  return PAIRS.has(pairSlug);
}

/** Resolve a pair slug to its two apps in canonical order (undefined if not eligible). */
export function getComparison(pairSlug: string): ComparisonPair | undefined {
  return PAIRS.get(pairSlug);
}

/** The eligible comparisons that include a given app — powers the per-app
 *  "Compare with…" rail (Chunk Y) and the hub grouping. */
export function comparisonsForApp(slug: string): ReadonlyArray<ComparisonPair> {
  return [...PAIRS.values()].filter((p) => p.a.slug === slug || p.b.slug === slug);
}

export interface ComparisonGroup {
  readonly category: AppCategory;
  readonly label: string;
  readonly pairs: ReadonlyArray<ComparisonPair>;
}

/** Same-primary-category comparisons, grouped by that category (for the hub).
 *  Only pairs whose BOTH apps share a primary `category` — the cleanest,
 *  most scannable browse axis. Groups sorted by size desc, then label. */
export function sameCategoryGroups(): ReadonlyArray<ComparisonGroup> {
  const byCat = new Map<AppCategory, ComparisonPair[]>();
  for (const p of PAIRS.values()) {
    if (p.a.category !== p.b.category) continue;
    const list = byCat.get(p.a.category) ?? [];
    list.push(p);
    byCat.set(p.a.category, list);
  }
  return [...byCat.entries()]
    .map(([category, pairs]) => ({
      category,
      label: CATEGORY_LABEL[category],
      pairs: [...pairs].sort((x, y) => x.slug.localeCompare(y.slug)),
    }))
    .sort((x, y) => y.pairs.length - x.pairs.length || x.label.localeCompare(y.label));
}

/** Curated cross-category comparisons (different primary categories) — kept on
 *  purpose (IDE vs CLI agent, etc.); surfaced as their own hub section. */
export function crossCategoryPairs(): ReadonlyArray<ComparisonPair> {
  return [...PAIRS.values()]
    .filter((p) => p.a.category !== p.b.category)
    .sort((x, y) => x.slug.localeCompare(y.slug));
}

/** Total eligible comparison count (for hub copy + provenance). */
export function comparisonCount(): number {
  return PAIRS.size;
}
