import type { App, AppCapability, CapabilityLevel } from "@/types/app";
import type { CapabilityFamily } from "@/lib/tools/capability-families";
import { CAPABILITY_LABEL } from "@/lib/tools/capability-labels";
import {
  type CapabilityOverlapGroup,
  computeCapabilityOverlap,
} from "@/lib/tools/capability-overlap";
import {
  DEPLOYMENT_LABEL,
  MODEL_KIND_LABEL,
  PLATFORM_LABEL,
  PRICING_LABEL,
} from "@/lib/tools/app-labels";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";

// ── COMPARISON VERDICT ────────────────────────────────────────────────────────
// A deterministic, build-time projection over two verified `App` records that
// answers "when to pick which" on /compare. It INFORMS, never recommends a winner.
//
// GUARDRAILS (from the AC-2 design red-team — these are spec, not style):
//  1. Enrichment-parity gate. Comparative capability framing ("Pick X if you need
//     …") only fires when BOTH apps are enriched to comparable depth (counts differ
//     by <2 and neither is empty). Otherwise leans are suppressed — a one-sided
//     capability is far more often an enrichment gap than a real differentiator.
//  2. Never phrase a capability ABSENCE as a claim. Leans read additively ("Pick X
//     if you need Y"), never "Y, which Z lacks". And we never assert "they cover the
//     same capabilities" unless the leaf sets are GENUINELY identical (capabilityClaim).
//  3. No-signal enum axes are suppressed: the model axis is dropped when either side
//     is model-agnostic (no LLM ⇒ the axis is meaningless), and any optional enum
//     (deployment, model) is compared only when BOTH sides have a real value —
//     unset ≠ a difference.
//  4. No claim exceeds its source field: enum LABELS render VERBATIM as {label,a,b}
//     triples. No editorializing phrase tables ("self-host", "polished", "better").
//  5. Free-text fence: this module reads ONLY enum fields + capabilities[].id +
//     name. It NEVER reads edge/pros/cons/tagline/description/insight/vendor/note
//     (those render verbatim elsewhere on the page). Do not reintroduce them.
//  6. Deterministic + total: same (a,b) → byte-identical output; `shape` is a total
//     chain ending in "twins". No Date.now/Math.random/locale sort.
//  7. AF-3b — `level` (primary/secondary) is a CONTROLLED enum field, so it joins
//     the fence (#5) as readable. It SHARPENS, never loosens: lean leaves order
//     primary-first + carry their level for chip styling, and the new FOCUS signal
//     reads only shared leaves' levels. Focus is NOT parity-gated (#1) — it compares
//     a leaf BOTH apps recorded AND leveled, so it is never an enrichment-gap artefact.

export type VerdictLeanGroup = Readonly<{
  family: CapabilityFamily;
  ids: ReadonlyArray<AppCapability>;
  labels: ReadonlyArray<string>; // pre-resolved CAPABILITY_LABEL, parallel to ids
  levels: ReadonlyArray<CapabilityLevel | undefined>; // the app's OWN level, parallel to ids
}>;

export type VerdictLean = Readonly<{
  uniqueCount: number;
  groups: ReadonlyArray<VerdictLeanGroup>;
}>;

// A shared capability whose FOCUS differs between the two apps — primary for the
// app this list belongs to, secondary for the other. The level-derived signal the
// set-difference leans can't see ("both do X, but it's a headline job for only one").
export type VerdictFocusLeaf = Readonly<{ id: AppCapability; label: string }>;

export type VerdictAxisKey = "pricing" | "license" | "deployment" | "platforms" | "model";

export type VerdictAxis = Readonly<{ key: VerdictAxisKey; label: string; a: string; b: string }>;

export type VerdictShape = "lean-both" | "lean-a" | "lean-b" | "focus" | "axes-only" | "twins";

// What we can honestly say about the two capability LEAF SETS:
//  "same"   — identical non-empty sets (safe to say "cover the same capabilities").
//  "differ" — the sets differ (whether or not leans were parity-suppressed).
//  "none"   — neither app has any capability recorded (say nothing about capabilities).
export type CapabilityClaim = "same" | "differ" | "none";

export type ComparisonVerdict = Readonly<{
  aName: string;
  bName: string;
  leanA: VerdictLean;
  leanB: VerdictLean;
  shared: ReadonlyArray<{ id: AppCapability; label: string }>;
  // Shared leaves whose FOCUS differs — primary for A & secondary for B (focusA),
  // or the reverse (focusB). Canonical (family) order. Empty when the apps agree on
  // every shared leaf's level (or neither is leveled).
  focusA: ReadonlyArray<VerdictFocusLeaf>;
  focusB: ReadonlyArray<VerdictFocusLeaf>;
  axes: ReadonlyArray<VerdictAxis>;
  shape: VerdictShape;
  capabilityClaim: CapabilityClaim;
  // True when the leaf sets genuinely differ BUT the parity gate suppressed the
  // comparative lean framing — drives the honest "compare the lists above" note.
  parityGated: boolean;
}>;

const AXIS_PRIORITY: ReadonlyArray<VerdictAxisKey> = [
  "pricing",
  "license",
  "deployment",
  "platforms",
  "model",
];

const platformList = (x: App): string => x.platforms.map((p) => PLATFORM_LABEL[p]).join(", ");
const platformsDiffer = (a: App, b: App): boolean => {
  if (a.platforms.length !== b.platforms.length) return true;
  const bSet = new Set(b.platforms);
  return a.platforms.some((p) => !bSet.has(p));
};

// GUARDRAIL #3/#4: emit an axis ONLY when both sides carry a real value and they
// genuinely differ; render the controlled-vocab label verbatim. No prose.
function buildAxes(a: App, b: App): VerdictAxis[] {
  const axes: VerdictAxis[] = [];

  if (a.pricing !== b.pricing) {
    axes.push({
      key: "pricing",
      label: "Pricing",
      a: PRICING_LABEL[a.pricing],
      b: PRICING_LABEL[b.pricing],
    });
  }

  const la = licenseSignal(a);
  const lb = licenseSignal(b);
  if (la !== lb) {
    axes.push({ key: "license", label: "License", a: LICENSE_LABEL[la], b: LICENSE_LABEL[lb] });
  }

  // Optional fields: unset is unknown, not a difference — require BOTH set.
  if (a.deployment && b.deployment && a.deployment !== b.deployment) {
    axes.push({
      key: "deployment",
      label: "Deployment",
      a: DEPLOYMENT_LABEL[a.deployment],
      b: DEPLOYMENT_LABEL[b.deployment],
    });
  }

  if (platformsDiffer(a, b)) {
    axes.push({ key: "platforms", label: "Platforms", a: platformList(a), b: platformList(b) });
  }

  // GUARDRAIL #3: skip the model axis when either side is model-agnostic (no LLM ⇒
  // the axis carries no decision signal), or when either side lacks modelSupport.
  const ma = a.modelSupport?.kind;
  const mb = b.modelSupport?.kind;
  if (ma && mb && ma !== mb && ma !== "model-agnostic" && mb !== "model-agnostic") {
    axes.push({
      key: "model",
      label: "Model support",
      a: MODEL_KIND_LABEL[ma],
      b: MODEL_KIND_LABEL[mb],
    });
  }

  return axes.sort((x, y) => AXIS_PRIORITY.indexOf(x.key) - AXIS_PRIORITY.indexOf(y.key));
}

/** Oxford-join with a cap: 1→"A", 2→"A and B", 3→"A, B, and C", >cap→"…, and K more". */
export function oxfordJoin(items: ReadonlyArray<string>, cap = 4): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length <= cap) {
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
  }
  return `${items.slice(0, cap).join(", ")}, and ${items.length - cap} more`;
}

// An app's id→level lookup (`undefined` for any leaf not yet leveled).
function levelMap(x: App): Map<AppCapability, CapabilityLevel | undefined> {
  const m = new Map<AppCapability, CapabilityLevel | undefined>();
  for (const c of x.capabilities ?? []) m.set(c.id, c.level);
  return m;
}
// primary leads, then secondary, then unleveled — stable within a level otherwise.
const levelRank = (lv: CapabilityLevel | undefined): number =>
  lv === "primary" ? 0 : lv === "secondary" ? 1 : 2;

export function buildComparisonVerdict(a: App, b: App): ComparisonVerdict {
  const overlap = computeCapabilityOverlap(a, b);
  const countA = (a.capabilities ?? []).length;
  const countB = (b.capabilities ?? []).length;
  const lvlA = levelMap(a);
  const lvlB = levelMap(b);

  // GUARDRAIL #1: enrichment-parity gate.
  const parityOk = countA > 0 && countB > 0 && Math.abs(countA - countB) < 2;

  // GUARDRAIL #7: within a lean, order the app's OWN unique leaves primary-first so
  // the headline sentence + chips lead with what it's built for, and carry the level
  // for chip styling. (Family order is preserved across groups; level orders within.)
  const lean = (
    pick: (g: CapabilityOverlapGroup) => AppCapability[],
    lvl: Map<AppCapability, CapabilityLevel | undefined>,
  ): VerdictLean => {
    const groups: VerdictLeanGroup[] = [];
    for (const g of overlap.groups) {
      const ids = pick(g)
        .slice()
        .sort((x, y) => levelRank(lvl.get(x)) - levelRank(lvl.get(y)));
      if (ids.length)
        groups.push({
          family: g.family,
          ids,
          labels: ids.map((id) => CAPABILITY_LABEL[id]),
          levels: ids.map((id) => lvl.get(id)),
        });
    }
    return { uniqueCount: groups.reduce((n, g) => n + g.ids.length, 0), groups };
  };

  const leanA = parityOk ? lean((g) => g.aOnly, lvlA) : { uniqueCount: 0, groups: [] };
  const leanB = parityOk ? lean((g) => g.bOnly, lvlB) : { uniqueCount: 0, groups: [] };
  const shared = overlap.shared.map((id) => ({ id, label: CAPABILITY_LABEL[id] }));

  // GUARDRAIL #7: the FOCUS signal — shared leaves the two apps weight differently.
  // A leaf primary for one and secondary for the other is a real, recorded divergence
  // in what each is built around; never an enrichment gap (both carry leaf + level),
  // so it is NOT parity-gated. `overlap.shared` is already canonical-ordered.
  const focusA: VerdictFocusLeaf[] = [];
  const focusB: VerdictFocusLeaf[] = [];
  for (const id of overlap.shared) {
    const la = lvlA.get(id);
    const lb = lvlB.get(id);
    if (la === "primary" && lb === "secondary") focusA.push({ id, label: CAPABILITY_LABEL[id] });
    else if (lb === "primary" && la === "secondary")
      focusB.push({ id, label: CAPABILITY_LABEL[id] });
  }
  const hasFocus = focusA.length > 0 || focusB.length > 0;

  const axes = buildAxes(a, b);

  const bothEmpty = countA === 0 && countB === 0;
  const setsIdentical = overlap.aOnly.length === 0 && overlap.bOnly.length === 0;
  const capabilityClaim: CapabilityClaim = bothEmpty ? "none" : setsIdentical ? "same" : "differ";

  // Focus slots in below the unique-cap leans (the strongest signal) but ABOVE the
  // enum axes / twins — so identical-set or parity-gated pairs that still differ in
  // focus get a real verdict instead of "they're the same".
  const shape: VerdictShape =
    leanA.uniqueCount > 0 && leanB.uniqueCount > 0
      ? "lean-both"
      : leanA.uniqueCount > 0
        ? "lean-a"
        : leanB.uniqueCount > 0
          ? "lean-b"
          : hasFocus
            ? "focus"
            : axes.length > 0
              ? "axes-only"
              : "twins";

  return {
    aName: a.name,
    bName: b.name,
    leanA,
    leanB,
    shared,
    focusA,
    focusB,
    axes,
    shape,
    capabilityClaim,
    parityGated: capabilityClaim === "differ" && !parityOk,
  };
}

// ── SPEC (acceptance cases; no test runner is wired in this repo yet) ──────────
// 1. lean-both, parity holds (both ~4 caps, enums tie): shape "lean-both",
//    leanA/leanB each carry the family-grouped A-only / B-only leaves (primary-first
//    within family, each tagged with its level), shared is the common leaves, axes [].
//    Renders "Pick {A} if you need …" additively, primaries as filled chips.
// 2. parity-gated (A 3 caps, B 6 caps → |Δ|=3): parityOk false ⇒ leanA=leanB=∅,
//    capabilityClaim "differ", parityGated true. If a shared leaf's level differs the
//    shape is "focus" (focus is NOT parity-gated); else "axes-only"/"twins". NEVER
//    emits a "Pick X if you need {A-only leaf}" line, NEVER claims "same capabilities".
// 3. model-agnostic side: the model axis is absent from `axes` even if kinds differ.
// 4. AF-3b focus: identical leaf SETS (capabilityClaim "same") but a shared leaf is
//    primary for A & secondary for B ⇒ focusA carries it, shape "focus" (not the old
//    "axes-only/twins → they cover the same capabilities"). Additive, no absence claim.
// 5. AF-3b focus is symmetric + ordered: focusA holds A-primary/B-secondary leaves,
//    focusB the reverse, both in canonical (family) order; a leaf where levels MATCH
//    (both primary or both secondary) appears in NEITHER. Deterministic.
