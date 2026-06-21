// SINGLE SOURCE OF TRUTH for a sponsored slot's shape + validity.
//
// Mirrors `lib/apps-schema.ts`: Velite validates every `data/sponsored/*.json`
// against `sponsoredSchema` at build time, and the `Sponsored` record type is
// *derived* via `z.infer` — no hand-maintained interface to drift. This module
// is build-only; `types/sponsored.ts` re-exports the inferred types type-only,
// so Zod/Velite never reach the client bundle.
//
// `z` is Velite's own re-exported Zod (v3) — same instance the validator and
// type generator use.
import { z } from "velite";
import { APP_CATEGORIES, type AppCategory } from "../types/app";

/** z.enum needs a mutable, non-empty literal tuple; spread + assert. */
const literals = <T extends string>(values: ReadonlyArray<T>) => [...values] as [T, ...T[]];

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Slot links point either off-site (paid placement, absolute http(s)) or to an
 *  internal route (e.g. the Ignaite "/contact?type=sponsorship" CTA), so a plain
 *  `z.string().url()` is too strict — allow a root-relative path too. The card
 *  uses the http(s) test to decide target=_blank + rel="sponsored". */
const slotUrl = z
  .string()
  .min(1)
  .refine((u) => u.startsWith("/") || /^https?:\/\//i.test(u), {
    message: "url must be a root-relative path (/…) or an absolute http(s) URL",
  });

export const sponsoredLinkSchema = z.object({
  url: slotUrl,
  label: z.string().min(1),
});

export const sponsoredTrackingSchema = z.object({
  /** Optional 1×1 pixel fired on render (direct-sold impression counting). */
  impressionPixel: z.string().url().optional(),
  /** Optional redirect/measurement URL for the CTA. */
  clickPixel: z.string().url().optional(),
});

export const sponsoredSchema = z.object({
  id: z.string().min(1),
  /** Discriminant — the interleaved grid uses `sponsored === true` to tell a
   *  slot apart from an App. Keep it a literal `true`. */
  sponsored: z.literal(true),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  promotedBy: z.string().min(1),
  /** Optional — lets a slot align with a category context if ever filtered. */
  category: z.enum(literals<AppCategory>(APP_CATEGORIES)).optional(),
  accentColor: z.string().regex(HEX, "accentColor must be a hex colour, e.g. #08d9d6").optional(),
  link: sponsoredLinkSchema,
  tracking: sponsoredTrackingSchema.optional(),
});

export type Sponsored = z.infer<typeof sponsoredSchema>;
export type SponsoredLink = z.infer<typeof sponsoredLinkSchema>;
