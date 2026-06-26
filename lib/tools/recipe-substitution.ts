// lib/tools/recipe-substitution.ts
// The SET-COVER SUBSTITUTION ENGINE (Chunk AF) — for a recipe step (an app doing a
// capability), surface REAL listed apps that cover the SAME capability so a user can
// swap for a cheaper / opener / simpler one.
//
// DETERMINISTIC + BUILD-TIME. Never an LLM, never at request time (that's the future
// Recipe Spider). It only ever returns real, ACTIVE apps that GENUINELY carry the
// capability (excludes the step's own app + archived apps) — so it inherits the
// no-fabrication moat. Imports @/.velite → build-only; safe in RSC, never a client
// bundle (mirrors lib/tools/recipe-index.ts).
//
// RANKING is a fixed LEXICOGRAPHIC order (no magic-number weights — auditable +
// trivially explainable in the UI):
//   1. capability FIT   — primary > secondary > unspecified   (the alt's `level`)
//   2. LICENSE          — open source > open core > proprietary
//   3. COST             — free / byo-key > freemium > paid
//   4. PLATFORM count   — fewer surfaces first
//   5. stable tie-break — addedSeq desc, then slug
//
// `level` is unpopulated corpus-wide today (the AF level backfill fills it later),
// so FIT is a neutral "unspecified" for now: the engine ranks on license/cost/
// platform — useful + honest day one — and SHARPENS automatically as levels land.
import { apps as CORPUS } from "@/.velite";
import type { App, AppCapability, AppPricing, CapabilityLevel } from "@/types/app";
import { licenseSignal, type LicenseSignal } from "@/lib/tools/license";

export interface Substitute {
  /** The real, listed, active alternative app. */
  app: App;
  /** The alternative's `level` for THIS capability (unspecified until backfill). */
  fit: CapabilityLevel | "unspecified";
  license: LicenseSignal;
  /** Why it's a cheaper/opener/simpler swap — e.g. ["open source", "free"]. */
  reasons: string[];
}

const isActive = (a: App) => (a.status ?? "active") === "active";

const levelOf = (app: App, capability: AppCapability): CapabilityLevel | "unspecified" =>
  app.capabilities?.find((c) => c.id === capability)?.level ?? "unspecified";

// ── Lexicographic rank keys (lower = ranked higher) ──────────────────────────
const FIT_RANK: Record<CapabilityLevel | "unspecified", number> = {
  primary: 0,
  secondary: 1,
  unspecified: 2,
};
const LICENSE_RANK: Record<LicenseSignal, number> = { oss: 0, core: 1, prop: 2 };
// free + byo-key are both a $0 entry point; freemium has a paywall behind a free
// tier; paid has no free entry.
const COST_RANK: Record<AppPricing, number> = { free: 0, "byo-key": 0, freemium: 1, paid: 2 };

const PRICING_REASON: Partial<Record<AppPricing, string>> = {
  free: "free",
  "byo-key": "bring your own key",
  freemium: "free tier",
};

function reasonsFor(app: App, license: LicenseSignal): string[] {
  const out: string[] = [];
  if (license === "oss") out.push("open source");
  else if (license === "core") out.push("open core");
  const price = PRICING_REASON[app.pricing];
  if (price) out.push(price);
  if (app.platforms.length === 1) out.push("single platform");
  return out;
}

/** Ranked substitutes for a (step app, capability) pair. Pure over `apps` (defaults
 *  to the full corpus) so it's testable; deterministic + build-time. */
export function substitutesForStep(
  appSlug: string,
  capability: AppCapability,
  limit = 3,
  apps: ReadonlyArray<App> = CORPUS,
): Substitute[] {
  const subs: Substitute[] = apps
    .filter(
      (a) =>
        a.slug !== appSlug &&
        isActive(a) &&
        (a.capabilities?.some((c) => c.id === capability) ?? false),
    )
    .map((app) => {
      const license = licenseSignal(app);
      return { app, fit: levelOf(app, capability), license, reasons: reasonsFor(app, license) };
    });

  subs.sort(
    (a, b) =>
      FIT_RANK[a.fit] - FIT_RANK[b.fit] ||
      LICENSE_RANK[a.license] - LICENSE_RANK[b.license] ||
      COST_RANK[a.app.pricing] - COST_RANK[b.app.pricing] ||
      a.app.platforms.length - b.app.platforms.length ||
      b.app.addedSeq - a.app.addedSeq ||
      a.app.slug.localeCompare(b.app.slug),
  );

  return limit > 0 ? subs.slice(0, limit) : subs;
}

/** How many listed alternatives cover this capability (excluding the step's app) —
 *  cheap guard for "render the swap rail?" without materializing the full list. */
export function substituteCount(appSlug: string, capability: AppCapability): number {
  return CORPUS.reduce(
    (n, a) =>
      n +
      (a.slug !== appSlug &&
      isActive(a) &&
      (a.capabilities?.some((c) => c.id === capability) ?? false)
        ? 1
        : 0),
    0,
  );
}
