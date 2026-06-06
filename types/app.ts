// Schema for the AI apps/tools/services directory at /. Supersedes the old
// `Tool` type. Notable changes vs. that earlier draft:
// - "model" dropped as a category (models are foundations consumed inside
//   listed apps, not browsable apps in their own right).
// - Category enum broadened to ~20 values so a comprehensive third-party
//   directory has somewhere to put every entry.
// - 4-stance scheme collapsed into an optional `blokzMark` badge — most
//   listings carry no badge; marked listings get an editorial stamp.
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

// Optional editorial badge. Most listings carry no mark.
//   "deployed"     — Blokz uses this in production daily.
//   "vetted"       — Blokz has tried it and recommends it.
//   "contributing" — Blokz contributes to or maintains this project.
export type BlokzMark = "deployed" | "vetted" | "contributing";

export const BLOKZ_MARKS: ReadonlyArray<BlokzMark> = ["deployed", "vetted", "contributing"];

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

export interface ModelSupport {
  kind: ModelSupportKind;
  /** Specific models or providers the app supports (e.g., ["Claude", "GPT-5"]). */
  models?: ReadonlyArray<string>;
  /** Short free-form note about how the support works. */
  notes?: string;
}

export type AppLinkKind =
  | "website"
  | "docs"
  | "github"
  | "pricing"
  | "demo"
  | "video"
  | "twitter"
  | "discord";

export interface AppLink {
  kind: AppLinkKind;
  url: string;
  label?: string;
  primary?: boolean;
}

export interface AppScreenshot {
  src: string;
  alt: string;
}

export interface App {
  slug: string;
  name: string;
  /** ≤ 100 chars; one-line pitch. */
  tagline: string;
  /** 2–4 sentences for the card; richer prose lives in longDescription. */
  description: string;
  /** Optional richer prose for the detail page (chunk C). */
  longDescription?: string;
  category: AppCategory;
  /** Cost model only — license/openness is the separate `openSource` flag. */
  pricing: AppPricing;
  /** True when the app's source is open. Decoupled from `pricing` so an app can
   * be both open-source AND have a paid hosted tier (e.g. Zed, ComfyUI). */
  openSource?: boolean;
  /** How it's hosted / run — see AppDeployment. Set where it's a real axis
   * (services / self-hostable infra / desktop); unset for libraries/SDKs. */
  deployment?: AppDeployment;
  /** Optional editorial badge — see BlokzMark. */
  blokzMark?: BlokzMark;
  vendor?: string;
  /** Required. At least one platform so visitors know where the app runs. */
  platforms: ReadonlyArray<AppPlatform>;
  modelSupport?: ModelSupport;
  tags?: ReadonlyArray<string>;
  accentColor?: string;
  /** Featured = bento 2-col span + hero carousel candidate. */
  featured?: boolean;
  links: ReadonlyArray<AppLink>;
  screenshots?: ReadonlyArray<AppScreenshot>;
  /** ISO date; powers "recent" sort. */
  addedAt?: string;
  /** Lifecycle status. Absence = "active". Archived hides from default browse. */
  status?: AppStatus;
  /** ISO date of the most recent freshness audit. Refreshed whenever the entry
   * is re-verified. Cycle entries oldest-first in future audit chunks. */
  lastVerifiedAt?: string;
  /** Gates an MDX long-form page at content/apps/<slug>.mdx in chunk C. */
  hasLongForm?: boolean;
}
