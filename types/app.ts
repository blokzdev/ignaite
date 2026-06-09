// Schema for the AI apps/tools/services directory at /. Supersedes the old
// `Tool` type. Notable changes vs. that earlier draft:
// - "model" dropped as a category (models are foundations consumed inside
//   listed apps, not browsable apps in their own right).
// - Category enum spans ~39 values across Build / Create / Work / Verticals /
//   Frontier clusters so a comprehensive third-party directory — developer
//   tooling through consumer + vertical apps — has somewhere to put every entry.
// - The studio-centric `blokzMark` editorial badge was retired; listings carry
//   neutral, derived signals (category / pricing / license / platforms) instead.
// - New `modelSupport` field describes which models each app uses/supports.
// - New `platforms` field for cross-platform filtering.

// Ordered into reading clusters (Build → Create → Work → Verticals → Frontier);
// this order drives the homepage quick-category chip strip. Human labels live in
// `lib/tools/category-labels.ts` (one source of truth, re-exported from the
// filter hook). Keep this union, the APP_CATEGORIES tuple below, and that label
// map in lockstep — the label map is typed `Record<AppCategory, string>`, so a
// new category here is a compile error until it's labelled there.
export type AppCategory =
  // Build — developer & infra tooling
  | "ide"
  | "agent"
  | "orchestration"
  | "mcp"
  | "eval"
  | "observability"
  | "inference"
  | "fine-tuning"
  | "infra"
  | "vector-db"
  | "memory"
  | "data-ops"
  | "security"
  // Create — media & design
  | "image-gen"
  | "video"
  | "audio"
  | "music"
  | "voice"
  | "vision"
  | "3d"
  | "design"
  // Work — knowledge, ops & go-to-market
  | "assistant"
  | "writing"
  | "productivity"
  | "search"
  | "research-platform"
  | "analytics"
  | "automation"
  | "browser-extension"
  | "translation"
  | "meeting"
  | "marketing"
  | "support"
  // Verticals
  | "companion"
  | "healthcare"
  | "legal"
  | "finance"
  | "education"
  // Frontier
  | "robotics";

export const APP_CATEGORIES: ReadonlyArray<AppCategory> = [
  // Build
  "ide",
  "agent",
  "orchestration",
  "mcp",
  "eval",
  "observability",
  "inference",
  "fine-tuning",
  "infra",
  "vector-db",
  "memory",
  "data-ops",
  "security",
  // Create
  "image-gen",
  "video",
  "audio",
  "music",
  "voice",
  "vision",
  "3d",
  "design",
  // Work
  "assistant",
  "writing",
  "productivity",
  "search",
  "research-platform",
  "analytics",
  "automation",
  "browser-extension",
  "translation",
  "meeting",
  "marketing",
  "support",
  // Verticals
  "companion",
  "healthcare",
  "legal",
  "finance",
  "education",
  // Frontier
  "robotics",
];

export type AppPricing = "free" | "freemium" | "paid" | "byo-key";

export const APP_PRICING: ReadonlyArray<AppPricing> = ["free", "freemium", "paid", "byo-key"];

// How an app is hosted / run — the axis users decide on (cloud vs self-host vs
// runs-locally). Optional; set only where it's a real distinction (services,
// self-hostable infra, desktop apps). Libraries/SDKs/extensions leave it unset.
//   "cloud"     — vendor-hosted SaaS only.
//   "self-host" — you run it on your own infra (no/secondary vendor cloud).
//   "local"     — runs on your machine / device (desktop, on-device).
//   "hybrid"    — offered both as managed cloud AND self-host.
export type AppDeployment = "cloud" | "self-host" | "local" | "hybrid";

export const APP_DEPLOYMENTS: ReadonlyArray<AppDeployment> = [
  "cloud",
  "self-host",
  "local",
  "hybrid",
];

export type AppPlatform =
  | "web"
  | "ios"
  | "android"
  | "macos"
  | "windows"
  | "linux"
  | "cli"
  | "api"
  | "browser-extension"
  | "vscode-extension";

export const APP_PLATFORMS: ReadonlyArray<AppPlatform> = [
  "web",
  "ios",
  "android",
  "macos",
  "windows",
  "linux",
  "cli",
  "api",
  "browser-extension",
  "vscode-extension",
];

// Lifecycle status. Absence on an entry = "active" — most listings carry no
// status. Archived entries stay in the data file as historical record but
// hide from the default browse; visitors can opt-in via the Status filter.
export type AppStatus = "active" | "archived";

export const APP_STATUSES: ReadonlyArray<AppStatus> = ["active", "archived"];

export type ModelSupportKind =
  | "single-model" // App is built around one provider/model.
  | "multi-model" // App supports a handful of providers natively.
  | "byo-key" // User brings any model + API key.
  | "model-agnostic" // No LLM involved (infra, vector db, observability).
  | "self-contained"; // App ships its own weights / runs on-device.

export const MODEL_SUPPORT_KINDS: ReadonlyArray<ModelSupportKind> = [
  "single-model",
  "multi-model",
  "byo-key",
  "model-agnostic",
  "self-contained",
];

export type AppLinkKind =
  | "website"
  | "docs"
  | "github"
  | "pricing"
  | "demo"
  | "video"
  | "twitter"
  | "discord";

export const APP_LINK_KINDS: ReadonlyArray<AppLinkKind> = [
  "website",
  "docs",
  "github",
  "pricing",
  "demo",
  "video",
  "twitter",
  "discord",
];

// A change-history entry's classification. `added` = first listed · `updated` =
// the app itself changed upstream · `fixed` = our data was corrected · `archived`
// = discontinued/sunset · `relisted` = brought back after archival.
export type ChangeKind = "added" | "updated" | "fixed" | "archived" | "relisted";

export const APP_CHANGE_KINDS: ReadonlyArray<ChangeKind> = [
  "added",
  "updated",
  "fixed",
  "archived",
  "relisted",
];

// The record SHAPES (App, AppLink, ModelSupport, AppScreenshot, ChangeEntry) are
// derived from the single source of truth — the zod schema in `lib/apps-schema.ts`
// — and re-exported here so every existing `@/types/app` import keeps working. To
// change a field, edit the schema (not this file); Velite validates every
// `data/apps/*.json` against it at build. The enum unions + value tuples above
// stay here because they're client-safe (zod-free) and reused by the filter UI.
export type { App, AppLink, ModelSupport, AppScreenshot, ChangeEntry } from "@/lib/apps-schema";
