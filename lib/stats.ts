import { apps } from "@/.velite";
import type { App } from "@/types/app";
import { APP_PLATFORMS, APP_PRICING } from "@/types/app";
import { CATEGORY_CLUSTERS } from "@/lib/tools/category-clusters";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { DEPLOYMENT_LABEL, MODEL_KIND_LABEL, PLATFORM_LABEL } from "@/lib/tools/app-labels";
import { categoryHref, facetHref } from "@/lib/tools/facet-links";

// Server-only, build-time aggregates over the verified corpus — the data layer
// behind /insights. Imports @/.velite, so NEVER pull this into a client
// component. Computed once at module load (the dataset is static per build).
//
// HONESTY DISCIPLINE (the whole point of an AI-managed directory's own charts):
// every distribution over a PARTIALLY-populated field carries an explicit
// `recorded` denominator and an "unrecorded" slice — we never collapse "field
// absent" into a real value (e.g. unset openSource is NOT "proprietary"). The
// numbers here must always reconcile with what the live directory grid shows.

const isActive = (a: App) => (a.status ?? "active") === "active";
const active = apps.filter(isActive);

export interface StatSlice {
  key: string;
  label: string;
  count: number;
  /** Deep-link into the filtered directory, when the slice maps to a facet. */
  href?: string;
}

export interface Distribution {
  slices: StatSlice[];
  /** Denominator the slices sum to (always the active total here). */
  total: number;
  /** When the source field is partial: how many listings actually carry it.
   *  Absent ⇒ the field is 100% populated (no coverage caveat needed). */
  recorded?: number;
}

const PRICING_LABEL_NICE: Record<(typeof APP_PRICING)[number], string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "byo-key": "BYO key",
};

function pricingMix(): Distribution {
  const counts = new Map<string, number>();
  for (const a of active) counts.set(a.pricing, (counts.get(a.pricing) ?? 0) + 1);
  const slices = APP_PRICING.map((p) => ({
    key: p,
    label: PRICING_LABEL_NICE[p],
    count: counts.get(p) ?? 0,
    href: facetHref("pricing", p),
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
  return { slices, total: active.length };
}

// License is derived from openSource (set on a minority of listings) + pricing.
// We deliberately do NOT use licenseSignal() here: it collapses unset→"prop",
// which would fabricate a proprietary majority. Instead, unset openSource is an
// explicit "Unrecorded" slice — never assumed proprietary.
function licenseMix(): Distribution {
  let oss = 0;
  let core = 0;
  let recorded = 0;
  for (const a of active) {
    if (a.openSource !== true) continue;
    recorded += 1;
    if (a.pricing === "paid" || a.pricing === "freemium") core += 1;
    else oss += 1;
  }
  const unrecorded = active.length - recorded;
  const slices: StatSlice[] = [
    { key: "oss", label: "Open source", count: oss, href: facetHref("license", "oss") },
    { key: "core", label: "Open core", count: core, href: facetHref("license", "core") },
    { key: "unrecorded", label: "Unrecorded", count: unrecorded },
  ].filter((s) => s.count > 0);
  return { slices, total: active.length, recorded };
}

function deploymentMix(): Distribution {
  const counts = new Map<string, number>();
  let recorded = 0;
  for (const a of active) {
    if (!a.deployment) continue;
    recorded += 1;
    counts.set(a.deployment, (counts.get(a.deployment) ?? 0) + 1);
  }
  const slices: StatSlice[] = (Object.keys(DEPLOYMENT_LABEL) as (keyof typeof DEPLOYMENT_LABEL)[])
    .map((d) => ({
      key: d,
      label: DEPLOYMENT_LABEL[d],
      count: counts.get(d) ?? 0,
      href: facetHref("deployment", d),
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
  const unrecorded = active.length - recorded;
  if (unrecorded > 0) slices.push({ key: "unrecorded", label: "Unrecorded", count: unrecorded });
  return { slices, total: active.length, recorded };
}

function modelSupportMix(): Distribution {
  const counts = new Map<string, number>();
  let recorded = 0;
  for (const a of active) {
    if (!a.modelSupport) continue;
    recorded += 1;
    counts.set(a.modelSupport.kind, (counts.get(a.modelSupport.kind) ?? 0) + 1);
  }
  const slices: StatSlice[] = (Object.keys(MODEL_KIND_LABEL) as (keyof typeof MODEL_KIND_LABEL)[])
    .map((k) => ({ key: k, label: MODEL_KIND_LABEL[k], count: counts.get(k) ?? 0 }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
  const unrecorded = active.length - recorded;
  if (unrecorded > 0) slices.push({ key: "unrecorded", label: "Unrecorded", count: unrecorded });
  return { slices, total: active.length, recorded };
}

// Platforms are multi-valued (≥1 each), so these slices count an app once per
// platform it ships on — they intentionally sum ABOVE the listing total. The
// denominator is the active total (each bar = "% of listings that run on X").
function platformCoverage(): StatSlice[] {
  const counts = new Map<string, number>();
  for (const a of active) for (const p of a.platforms) counts.set(p, (counts.get(p) ?? 0) + 1);
  return APP_PLATFORMS.map((p) => ({
    key: p,
    label: PLATFORM_LABEL[p],
    count: counts.get(p) ?? 0,
    href: facetHref("platform", p),
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export interface ClusterCoverage {
  label: string;
  blurb: string;
  total: number;
  categories: StatSlice[];
}

// Category coverage by the canonical PRIMARY category only, so the cluster
// totals reconcile exactly to the active listing count (secondary memberships
// would double-count). Grouped by the 5 reading clusters.
function categoryCoverage(): { clusters: ClusterCoverage[]; total: number } {
  const counts = new Map<string, number>();
  for (const a of active) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  const clusters = CATEGORY_CLUSTERS.map((c) => {
    const categories = c.categories
      .map((cat) => ({
        key: cat,
        label: CATEGORY_LABEL[cat],
        count: counts.get(cat) ?? 0,
        href: categoryHref(cat),
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
    return {
      label: c.label,
      blurb: c.blurb,
      total: categories.reduce((n, s) => n + s.count, 0),
      categories,
    };
  });
  return { clusters, total: active.length };
}

export interface Freshness {
  within30: number;
  within90: number;
  over90: number;
  unverified: number;
  pctWithin30: number;
  medianAgeDays: number | null;
}

function freshness(generatedAt: Date): Freshness {
  const dayMs = 86_400_000;
  const ages: number[] = [];
  let within30 = 0;
  let within90 = 0;
  let over90 = 0;
  let unverified = 0;
  for (const a of active) {
    if (!a.lastVerifiedAt) {
      unverified += 1;
      continue;
    }
    const age = Math.max(
      0,
      Math.floor((generatedAt.getTime() - new Date(a.lastVerifiedAt).getTime()) / dayMs),
    );
    ages.push(age);
    if (age <= 30) within30 += 1;
    else if (age <= 90) within90 += 1;
    else over90 += 1;
  }
  ages.sort((a, b) => a - b);
  const medianAgeDays = ages.length ? (ages[Math.floor((ages.length - 1) / 2)] ?? null) : null;
  const pctWithin30 = active.length ? Math.round((within30 / active.length) * 100) : 0;
  return { within30, within90, over90, unverified, pctWithin30, medianAgeDays };
}

export interface DirectoryStats {
  /** ISO date the build computed these — the "data as of" provenance stamp. */
  generatedAt: string;
  totalActive: number;
  totalArchived: number;
  pricing: Distribution;
  license: Distribution;
  deployment: Distribution;
  modelSupport: Distribution;
  platforms: StatSlice[];
  categories: { clusters: ClusterCoverage[]; total: number };
  freshness: Freshness;
}

// Memoized once per build.
let cached: DirectoryStats | null = null;

export function directoryStats(): DirectoryStats {
  if (cached) return cached;
  const now = new Date();
  cached = {
    generatedAt: now.toISOString().slice(0, 10),
    totalActive: active.length,
    totalArchived: apps.length - active.length,
    pricing: pricingMix(),
    license: licenseMix(),
    deployment: deploymentMix(),
    modelSupport: modelSupportMix(),
    platforms: platformCoverage(),
    categories: categoryCoverage(),
    freshness: freshness(now),
  };
  return cached;
}
