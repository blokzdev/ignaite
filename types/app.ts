// Schema for the AI apps/tools/services directory at /. Supersedes the old
// `Tool` type. Notable changes vs. that earlier draft:
// - "model" dropped as a category (models are foundations consumed inside
//   listed apps, not browsable apps in their own right).
// - Category enum broadened to ~20 values so a comprehensive third-party
//   directory has somewhere to put every entry.
// - The studio-centric `blokzMark` editorial badge was retired; listings carry
//   neutral, derived signals (category / pricing / license / platforms) instead.
// - New `modelSupport` field describes which models each app uses/supports.
// - New `platforms` field for cross-platform filtering.

export type AppCategory =
  | "ide"
  | "agent"
  | "assistant"
  | "orchestration"
  | "mcp"
  | "eval"
  | "infra"
  | "memory"
  | "vector-db"
  | "voice"
  | "vision"
  | "image-gen"
  | "video"
  | "audio"
  | "3d"
  | "search"
  | "data-ops"
  | "observability"
  | "inference"
  | "fine-tuning"
  | "research-platform"
  | "browser-extension"
  | "automation";

export const APP_CATEGORIES: ReadonlyArray<AppCategory> = [
  "ide",
  "agent",
  "assistant",
  "orchestration",
  "mcp",
  "eval",
  "infra",
  "memory",
  "vector-db",
  "voice",
  "vision",
  "image-gen",
  "video",
  "audio",
  "3d",
  "search",
  "data-ops",
  "observability",
  "inference",
  "fine-tuning",
  "research-platform",
  "browser-extension",
  "automation",
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

// The record SHAPES (App, AppLink, ModelSupport, AppScreenshot) are derived from
// the single source of truth — the zod schema in `lib/apps-schema.ts` — and
// re-exported here so every existing `@/types/app` import keeps working. To
// change a field, edit the schema (not this file); Velite validates every
// `data/apps/*.json` against it at build. The enum unions + value tuples above
// stay here because they're client-safe (zod-free) and reused by the filter UI.
export type { App, AppLink, ModelSupport, AppScreenshot } from "@/lib/apps-schema";
