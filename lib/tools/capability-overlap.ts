import type { App, AppCapability } from "@/types/app";
import { type CapabilityFamily, groupCapabilitiesByFamily } from "@/lib/tools/capability-families";

// Build-time, server-safe, zod-free, no client. Computes the capability overlap
// between two listings — the shared / A-only / B-only leaf sets, grouped by family
// in canonical order — for the /compare overlap row and the verdict synthesizer.
// Operates on leaf ids only (drops level/note); ordering is delegated to
// groupCapabilitiesByFamily so it can't drift from the detail-page grouping.

function capabilityIds(app: App): AppCapability[] {
  return (app.capabilities ?? []).map((c) => c.id);
}

export type CapabilityOverlapGroup = Readonly<{
  family: CapabilityFamily;
  shared: AppCapability[];
  aOnly: AppCapability[];
  bOnly: AppCapability[];
}>;

export type CapabilityOverlap = Readonly<{
  // Canonical family order; only families either app touches. Each group has at
  // least one of shared/aOnly/bOnly populated.
  groups: ReadonlyArray<CapabilityOverlapGroup>;
  shared: AppCapability[]; // flattened, canonical order
  aOnly: AppCapability[];
  bOnly: AppCapability[];
  jaccard: number; // |shared| / |union|; 0 when both empty. Unused by the verdict.
}>;

export function computeCapabilityOverlap(a: App, b: App): CapabilityOverlap {
  const aSet = new Set(capabilityIds(a));
  const bSet = new Set(capabilityIds(b));
  // Dedupe the union (a shared leaf appears in both) while preserving first-seen
  // order, then let groupCapabilitiesByFamily impose canonical family + leaf order.
  const unionIds = [...new Set([...aSet, ...bSet])];

  const groups: CapabilityOverlapGroup[] = groupCapabilitiesByFamily(unionIds).map(
    ({ family, ids }) => ({
      family,
      shared: ids.filter((id) => aSet.has(id) && bSet.has(id)),
      aOnly: ids.filter((id) => aSet.has(id) && !bSet.has(id)),
      bOnly: ids.filter((id) => bSet.has(id) && !aSet.has(id)),
    }),
  );

  const shared = groups.flatMap((g) => g.shared);
  const aOnly = groups.flatMap((g) => g.aOnly);
  const bOnly = groups.flatMap((g) => g.bOnly);
  const unionSize = unionIds.length;

  return { groups, shared, aOnly, bOnly, jaccard: unionSize === 0 ? 0 : shared.length / unionSize };
}
