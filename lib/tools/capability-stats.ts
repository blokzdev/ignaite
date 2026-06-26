import type { App, AppCapability } from "@/types/app";
import {
  CAPABILITY_FAMILIES,
  CAPABILITY_FAMILY,
  type CapabilityFamily,
} from "@/lib/tools/capability-families";
import { CAPABILITY_LABEL } from "@/lib/tools/capability-labels";

// Server-only, build-time capability aggregates over the verified corpus — the
// SINGLE source for the capability counts + the capability→slug reverse index,
// shared by /insights (via lib/stats.ts), /llms.txt, /llms-full.txt, and
// /feed.json so those surfaces can't drift from each other. Active-only; FULL
// membership (an app is counted under EVERY leaf it carries, independent of
// category). Functions take `apps` so they're testable; each filters active
// internally. Pure (no @/.velite import) — never pulled into a client bundle by
// these consumers, which already import @/.velite themselves.

const isActive = (a: App) => (a.status ?? "active") === "active";

export interface CapabilityLeafStat {
  id: AppCapability;
  label: string; // CAPABILITY_LABEL[id]
  family: CapabilityFamily; // CAPABILITY_FAMILY[id]
  count: number; // active listings carrying this leaf
  slugs: string[]; // those listings' slugs, addedSeq desc
}

// leaf → slugs (addedSeq desc), built once and reused by list + index.
function leafStats(apps: ReadonlyArray<App>): CapabilityLeafStat[] {
  const ordered = [...apps].filter(isActive).sort((a, b) => b.addedSeq - a.addedSeq);
  const slugsByLeaf = new Map<AppCapability, string[]>();
  for (const a of ordered) {
    for (const c of a.capabilities ?? []) {
      const arr = slugsByLeaf.get(c.id);
      if (arr) arr.push(a.slug);
      else slugsByLeaf.set(c.id, [a.slug]);
    }
  }
  return [...slugsByLeaf.entries()].map(([id, slugs]) => ({
    id,
    label: CAPABILITY_LABEL[id],
    family: CAPABILITY_FAMILY[id],
    count: slugs.length,
    slugs,
  }));
}

const byCountDescThenId = (a: CapabilityLeafStat, b: CapabilityLeafStat): number =>
  b.count - a.count || a.id.localeCompare(b.id);

/** Flat leaf list, desc by count (ties by id) — drives feed.json's
 *  `_ignaite.capabilities` + the llms-full.txt per-leaf rows. */
export function capabilityList(apps: ReadonlyArray<App>): CapabilityLeafStat[] {
  return leafStats(apps).sort(byCountDescThenId);
}

/** Leaves grouped by family in canonical `CAPABILITY_FAMILIES` order (leaves desc
 *  within each family); empty families dropped. Drives the family-grouped
 *  llms-full.txt section + the llms.txt family summary. */
export function capabilityIndex(
  apps: ReadonlyArray<App>,
): ReadonlyMap<CapabilityFamily, CapabilityLeafStat[]> {
  const byFamily = new Map<CapabilityFamily, CapabilityLeafStat[]>();
  for (const s of leafStats(apps)) {
    const arr = byFamily.get(s.family);
    if (arr) arr.push(s);
    else byFamily.set(s.family, [s]);
  }
  const ordered = new Map<CapabilityFamily, CapabilityLeafStat[]>();
  for (const family of CAPABILITY_FAMILIES) {
    const arr = byFamily.get(family);
    if (arr?.length) ordered.set(family, arr.sort(byCountDescThenId));
  }
  return ordered;
}

/** Per-family assignment totals (sum of leaf counts), desc; 0-count families
 *  dropped. Drives the /insights family bars + the llms.txt family summary.
 *  Multi-valued: an app contributes once per leaf, so these sum ABOVE the
 *  listing total. */
export function capabilityFamilyTotals(
  apps: ReadonlyArray<App>,
): ReadonlyArray<{ family: CapabilityFamily; count: number }> {
  const counts = new Map<CapabilityFamily, number>();
  for (const a of apps) {
    if (!isActive(a)) continue;
    for (const c of a.capabilities ?? []) {
      const family = CAPABILITY_FAMILY[c.id];
      counts.set(family, (counts.get(family) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([family, count]) => ({ family, count }))
    .sort((a, b) => b.count - a.count);
}

/** Coverage honesty figure: how many active listings carry ≥1 capability, of the
 *  active total. Drives the Insights coverage note (never implies 100%). */
export function capabilityCoverage(apps: ReadonlyArray<App>): { enriched: number; total: number } {
  let enriched = 0;
  let total = 0;
  for (const a of apps) {
    if (!isActive(a)) continue;
    total += 1;
    if ((a.capabilities?.length ?? 0) > 0) enriched += 1;
  }
  return { enriched, total };
}
