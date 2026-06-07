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
  APP_CATEGORIES,
  APP_CHANGE_KINDS,
  APP_DEPLOYMENTS,
  APP_LINK_KINDS,
  APP_PLATFORMS,
  APP_PRICING,
  APP_STATUSES,
  MODEL_SUPPORT_KINDS,
  type AppCategory,
  type AppDeployment,
  type AppLinkKind,
  type AppPlatform,
  type AppPricing,
  type AppStatus,
  type ChangeKind,
  type ModelSupportKind,
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

export const changeEntrySchema = z.object({
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
});

export const appSchema = z
  .object({
    slug: z.string().regex(SLUG, "slug must be kebab-case (lowercase, hyphen-separated)"),
    name: z.string().min(1),
    /** One-line pitch. */
    tagline: z.string().min(1).max(100, "tagline must be ≤100 chars"),
    /** 2–4 sentences for the card; richer prose lives in `longDescription`. */
    description: z.string().min(1),
    /** Optional richer prose for the detail page. */
    longDescription: z.string().optional(),
    /** The directory's signature signal: a single, Claude-authored editorial
     *  observation surfaced while researching the listing. Quality bar
     *  (enforced by the authoring routines): ≤140 chars, one sentence, a
     *  *non-obvious, verifiable* fact — how it differs from peers, a licensing
     *  nuance, an architectural quirk — NOT a re-pitch of the tagline. Never
     *  fabricate; if nothing sharp is verifiable, omit it. */
    insight: z.string().max(140, "insight must be ≤140 chars").optional(),
    category: z.enum(literals<AppCategory>(APP_CATEGORIES)),
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
    tags: z.array(z.string()).optional(),
    accentColor: z.string().regex(HEX, "accentColor must be a hex colour, e.g. #08d9d6").optional(),
    /** Featured = bento 2-col span + hero carousel candidate. */
    featured: z.boolean().optional(),
    links: z.array(linkSchema).min(1, "at least one link"),
    screenshots: z.array(screenshotSchema).optional(),
    /** ISO date (YYYY-MM-DD); powers the "recent" sort. */
    addedAt: z.string().regex(ISO_DATE, "addedAt must be an ISO date (YYYY-MM-DD)").optional(),
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
  })
  .refine((a) => a.links.filter((l) => l.primary).length === 1, {
    message: "links must contain exactly one entry with `primary: true`",
    path: ["links"],
  })
  .refine((a) => !a.featured || !!a.accentColor, {
    message: "featured apps must set accentColor (it drives the carousel/hero gradient)",
    path: ["accentColor"],
  });

export type App = z.infer<typeof appSchema>;
export type AppLink = z.infer<typeof linkSchema>;
export type ModelSupport = z.infer<typeof modelSupportSchema>;
export type AppScreenshot = z.infer<typeof screenshotSchema>;
export type ChangeEntry = z.infer<typeof changeEntrySchema>;
