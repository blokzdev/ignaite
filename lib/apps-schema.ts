// SINGLE SOURCE OF TRUTH for a directory listing's shape + validity.
//
// Velite validates every `data/apps/*.json` against `appSchema` at build time
// (`velite build`), and the `App` record type is *derived* from it via
// `z.infer` — there is no hand-maintained `App` interface to drift out of sync.
// The semantic rules below (length caps, kebab slug, ≥1-platform, exactly-one-
// primary-link, hex colour, ISO dates) are the guardrails that `tsc` alone
// can't enforce; a routine that authors a bad entry gets a precise per-file
// error and self-corrects.
//
// `z` is Velite's own re-exported Zod (v3) — using it (rather than a separate
// `zod` install) guarantees the schema instance matches Velite's validator and
// type generator. This module is build-only; `types/app.ts` re-exports the
// inferred types type-only, so Zod/Velite never reach the client bundle.
import { z } from "velite";
import {
  APP_CAPABILITIES,
  APP_CATEGORIES,
  APP_CHANGE_KINDS,
  APP_DEPLOYMENTS,
  APP_LINK_KINDS,
  APP_PLATFORMS,
  APP_PRICING,
  APP_STATUSES,
  CAPABILITY_LEVELS,
  MODEL_SUPPORT_KINDS,
  REFERENCE_KINDS,
  type AppCapability,
  type AppCategory,
  type AppDeployment,
  type AppLinkKind,
  type AppPlatform,
  type AppPricing,
  type AppStatus,
  type CapabilityLevel,
  type ChangeKind,
  type ModelSupportKind,
  type ReferenceKind,
} from "../types/app";

/** z.enum needs a mutable, non-empty literal tuple; our enum constants are
 *  readonly arrays of the right literal type, so spread + assert. */
const literals = <T extends string>(values: ReadonlyArray<T>) => [...values] as [T, ...T[]];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const modelSupportSchema = z.object({
  kind: z.enum(literals<ModelSupportKind>(MODEL_SUPPORT_KINDS)),
  /** Specific models or providers the app supports (e.g. ["Claude", "GPT-5"]). */
  models: z.array(z.string()).optional(),
  /** Short free-form note about how the support works. */
  notes: z.string().optional(),
});

// A single capability entry — one controlled task-axis leaf the app performs.
// v1 authors `id` ONLY; `level` (primary="best for" / secondary="can be used
// for") is DEFERRED until a Recipes/substitution consumer needs it, so the field
// can fill in later with no migration. Same no-fabrication bar as `insight`:
// web-verify the capability against the vendor/docs or omit it.
export const capabilitySchema = z.object({
  /** Which controlled capability leaf — the WHAT (task axis). */
  id: z.enum(literals<AppCapability>(APP_CAPABILITIES)),
  /** DEFERRED — author id-only in v1. Set in the level phase. */
  level: z.enum(literals<CapabilityLevel>(CAPABILITY_LEVELS)).optional(),
  /** Optional ≤80-char qualifier (e.g. "self-hosted only", "EN/ES only"). */
  note: z.string().max(80, "capability note must be ≤80 chars").optional(),
});

export const linkSchema = z.object({
  kind: z.enum(literals<AppLinkKind>(APP_LINK_KINDS)),
  url: z.string().url(),
  label: z.string().optional(),
  primary: z.boolean().optional(),
});

export const screenshotSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export const changeEntrySchema = z
  .object({
    /** ISO date the change was recorded (the audit date). */
    date: z.string().regex(ISO_DATE, "date must be an ISO date (YYYY-MM-DD)"),
    kind: z.enum(literals<ChangeKind>(APP_CHANGE_KINDS)),
    /** One verifiable sentence: what changed (+ why, for a correction). */
    summary: z.string().min(1).max(200, "change summary must be ≤200 chars"),
    /** When the change actually happened upstream (real-world) — set ONLY when the
     *  research can source the date; never guess. */
    asOf: z.string().regex(ISO_DATE, "asOf must be an ISO date (YYYY-MM-DD)").optional(),
    /** Source URL backing the change (evidence the audit verified against). */
    source: z.string().url().optional(),
  })
  // The upstream change can't be discovered before it happened.
  .refine((e) => !e.asOf || e.asOf <= e.date, {
    message: "asOf (real-world change date) can't be after the recorded date",
    path: ["asOf"],
  });

// A third-party reference: independent, non-vendor coverage of the listing
// (review / guide / benchmark / comparison / interview / analysis). The URL must
// be a real, fetched page from a credible source — never fabricated. Distinct
// from the first-party `links` (the vendor's own site/docs/repo).
export const referenceSchema = z.object({
  /** The piece's title / headline. */
  title: z.string().min(1).max(80, "reference title must be ≤80 chars"),
  url: z.string().url(),
  /** The publication or author (e.g. "The Verge", "Latent Space"). */
  source: z.string().max(40, "reference source must be ≤40 chars").optional(),
  kind: z.enum(literals<ReferenceKind>(REFERENCE_KINDS)).optional(),
});

export const appSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug must be kebab-case (lowercase, hyphen-separated)"),
    name: z.string().min(1),
    /** One-line pitch — *describe* what the app is/does; don't *sell* it. No
     *  stats, superlatives, or comparative claims (those belong in `edge`/`pros`,
     *  and any headline stat in `description`). e.g. "AI video localization and
     *  dubbing with voice cloning." — not "…into 130+ languages…". See the
     *  cross-field redundancy rule on `edge`/`pros` below. */
    tagline: z.string().min(1).max(100, "tagline must be ≤100 chars"),
    /** 2–4 sentences for the card; richer prose lives in `longDescription`. */
    description: z.string().min(1),
    /** Optional richer prose for the detail page. */
    longDescription: z.string().optional(),
    /** "Worth knowing" — the directory's signature signal: ONE verifiable,
     *  non-obvious FACT the description doesn't carry, surfaced while researching
     *  the listing. Quality bar (enforced by the authoring routines): ≤140 chars,
     *  one sentence, a fact such as an acquisition/funding event, origin/lineage,
     *  a licensing nuance, a pivot/rename, a rare/unusual capability, or a notable
     *  "first"/standing. NEVER comparative (that's `edge`) and NEVER a restatement
     *  of what it does (that's `description`/`tagline`). Never fabricate; omit if
     *  no sharp fact verifies (coverage is intentionally partial, not universal). */
    insight: z.string().max(140, "insight must be ≤140 chars").optional(),
    category: z.enum(literals<AppCategory>(APP_CATEGORIES)),
    /** Optional additional categories this listing GENUINELY belongs to (a real
     *  second home, not a tangential mention). Drives full cross-category
     *  membership — the app appears on each category's page, filter, count, and
     *  sitemap entry — while `category` stays the single canonical home (card
     *  chip, related rail, JSON-LD, sort). Cap 2; must not include or duplicate
     *  the primary `category` (enforced by the refine below). */
    secondaryCategories: z
      .array(z.enum(literals<AppCategory>(APP_CATEGORIES)))
      .max(2, "at most 2 secondary categories")
      .optional(),
    /** Cost model only — license/openness is the separate `openSource` flag. */
    pricing: z.enum(literals<AppPricing>(APP_PRICING)),
    /** True when the app's source is open. Decoupled from `pricing` so an app
     *  can be both open-source AND have a paid hosted tier (e.g. Zed, ComfyUI). */
    openSource: z.boolean().optional(),
    /** How it's hosted / run — set where it's a real axis (services /
     *  self-hostable infra / desktop); unset for libraries/SDKs. */
    deployment: z.enum(literals<AppDeployment>(APP_DEPLOYMENTS)).optional(),
    vendor: z.string().optional(),
    /** At least one platform so visitors know where the app runs. */
    platforms: z
      .array(z.enum(literals<AppPlatform>(APP_PLATFORMS)))
      .min(1, "at least one platform"),
    modelSupport: modelSupportSchema.optional(),
    /** The TASK axis — controlled capability leaves (WHAT the app does), finer
     *  than `category` and able to cross it. Additive + optional; cap 6 to bound
     *  audit load. Web-verify-or-omit (same rule as `insight`). Distinct from
     *  `bestFor`, which is now persona/audience ONLY (WHO it's for). Duplicate
     *  ids within a listing are rejected in velite.config.ts's complete() hook. */
    capabilities: z.array(capabilitySchema).max(6, "at most 6 capabilities").optional(),
    tags: z.array(z.string()).optional(),
    accentColor: z.string().regex(HEX, "accentColor must be a hex colour, e.g. #08d9d6").optional(),
    /** Featured = bento 2-col span + hero carousel candidate. The current-cycle
     *  flag, rotated by the biweekly `/rotate-featured` routine. */
    featured: z.boolean().optional(),
    /** ISO date (YYYY-MM-DD) the app was last placed in the featured set by
     *  `/rotate-featured`. Persists after it rotates out, so the routine can
     *  avoid re-featuring it too soon and the rotation stays auditable.
     *  Independent of `featured` (which is only the current-cycle flag). */
    featuredAt: z
      .string()
      .regex(ISO_DATE, "featuredAt must be an ISO date (YYYY-MM-DD)")
      .optional(),
    links: z.array(linkSchema).min(1, "at least one link"),
    screenshots: z.array(screenshotSchema).optional(),
    /** ISO date (YYYY-MM-DD) the listing was added — the visitor-facing signal. */
    addedAt: z.string().regex(ISO_DATE, "addedAt must be an ISO date (YYYY-MM-DD)").optional(),
    /** The directory's accession number — the order this listing entered the
     *  directory (1 = first ever listed). REQUIRED and unique. Assigned by the
     *  authoring routines as highest-existing + 1 (counting seqs claimed by
     *  open discovery PRs); never reused and never renumbered — archived
     *  listings keep theirs. This is what the Newest/Oldest sort actually
     *  orders by: `addedAt` is day-granular and bulk adds share a day, so the
     *  seq is the total, stable chronology. Cross-file uniqueness + agreement
     *  with `addedAt` are enforced in velite.config.ts's `complete()` hook. */
    addedSeq: z.number().int().positive("addedSeq must be a positive integer"),
    /** Lifecycle status. Absence = "active". Archived hides from default browse. */
    status: z.enum(literals<AppStatus>(APP_STATUSES)).optional(),
    /** ISO date of the most recent freshness audit. */
    lastVerifiedAt: z
      .string()
      .regex(ISO_DATE, "lastVerifiedAt must be an ISO date (YYYY-MM-DD)")
      .optional(),
    /** Gates an MDX long-form page at content/apps/<slug>.mdx. */
    hasLongForm: z.boolean().optional(),
    /** Append-only audit trail: one entry per *substantive* change a maintenance
     *  routine makes (added/updated/fixed/archived/relisted) — surfaced as the
     *  detail page's "Change history". Newest-first is a render concern, not a
     *  storage one. A no-change re-verification only bumps `lastVerifiedAt` (the
     *  heartbeat) and records nothing here. Same no-fabrication rule as the rest:
     *  `asOf`/`source` only when sourced. */
    changelog: z.array(changeEntrySchema).optional(),
    // ── Enrichment: the "honest brief" (all optional; omit > fabricate) ──────
    /** The comparative one-liner: what this app does *better than its category
     *  peers* — the "why pick this one". Distinct from `insight` (a non-obvious
     *  fact); `edge` is explicitly comparative. One sentence, ≤160 chars (it
     *  renders in a detail-page callout that wraps — looser than card-shown
     *  `insight`); omit if there's no clear, verifiable differentiator.
     *  CROSS-FIELD REDUNDANCY RULE: a distinctive stat/phrase gets ONE home —
     *  `description` may state it once, plus at most ONE of {`edge`, `pros`}.
     *  Never echo the same point across tagline + edge + pros (it stacks up in
     *  the detail page's masthead → edge callout → pros box and reads repetitive).
     *  If a stat is the genuine differentiator it lives here in `edge`. */
    edge: z.string().max(160, "edge must be ≤160 chars").optional(),
    /** Verified, grounded strengths — short phrases, not marketing. Max 5. Must
     *  NOT restate the headline phrase already carried by `edge`/`tagline`; if
     *  `edge` owns the differentiating stat, `pros` carry *other* strengths (see
     *  the cross-field redundancy rule on `edge`). */
    pros: z
      .array(z.string().min(1).max(60, "each pro must be ≤60 chars"))
      .max(5, "at most 5 pros")
      .optional(),
    /** Honest limitations / tradeoffs — factual gaps, never competitor-bashing.
     *  The trust signal most directories omit. Max 5. */
    cons: z
      .array(z.string().min(1).max(60, "each con must be ≤60 chars"))
      .max(5, "at most 5 cons")
      .optional(),
    /** Who/what it's best for — use-case or audience descriptors. Max 4. */
    bestFor: z
      .array(z.string().min(1).max(40, "each bestFor must be ≤40 chars"))
      .max(4, "at most 4 bestFor")
      .optional(),
    /** Curated head-to-head comparison set: app slugs a visitor should actually
     *  evaluate instead (editorial, may cross categories — unlike the derived
     *  same-category Related rail). Validated in velite's `complete()` hook:
     *  each slug must exist and not be self. Max 4. */
    alternatives: z
      .array(z.string().regex(SLUG, "alternative must be an app slug"))
      .max(4, "at most 4 alternatives")
      .optional(),
    /** Third-party authoritative coverage (independent of the vendor) — real,
     *  verified URLs only; never fabricate. Max 4. */
    references: z.array(referenceSchema).max(4, "at most 4 references").optional(),
  })
  .refine((a) => a.links.filter((l) => l.primary).length === 1, {
    message: "links must contain exactly one entry with `primary: true`",
    path: ["links"],
  })
  .refine((a) => !a.featured || !!a.accentColor, {
    message: "featured apps must set accentColor (it drives the carousel/hero gradient)",
    path: ["accentColor"],
  })
  .refine(
    (a) => {
      const sec = a.secondaryCategories ?? [];
      return new Set(sec).size === sec.length && !sec.includes(a.category);
    },
    {
      message: "secondaryCategories must be unique and must not include the primary category",
      path: ["secondaryCategories"],
    },
  );

export type App = z.infer<typeof appSchema>;
export type AppLink = z.infer<typeof linkSchema>;
export type ModelSupport = z.infer<typeof modelSupportSchema>;
export type AppCapabilityEntry = z.infer<typeof capabilitySchema>;
export type AppScreenshot = z.infer<typeof screenshotSchema>;
export type ChangeEntry = z.infer<typeof changeEntrySchema>;
export type Reference = z.infer<typeof referenceSchema>;
