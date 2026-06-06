// Public types for sponsored slots. The shape + validity live in the zod
// source-of-truth `lib/sponsored-schema.ts`; these are type-only re-exports so
// Zod/Velite never reach the client bundle. The `SponsoredSlot` alias is kept
// (consumers import it by that name) — it equals the inferred `Sponsored`.
export type { Sponsored as SponsoredSlot, SponsoredLink } from "@/lib/sponsored-schema";
