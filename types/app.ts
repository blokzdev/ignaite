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
  | "gaming"
  // Work — knowledge, ops & go-to-market
  | "assistant"
  | "writing"
  | "productivity"
  | "search"
  | "research-platform"
  | "analytics"
  | "automation"
  | "translation"
  | "meeting"
  | "marketing"
  | "support"
  | "sales"
  | "hr"
  // Verticals
  | "companion"
  | "healthcare"
  | "legal"
  | "finance"
  | "education"
  | "real-estate"
  // Frontier
  | "robotics"
  | "science";

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
  "gaming",
  // Work
  "assistant",
  "writing",
  "productivity",
  "search",
  "research-platform",
  "analytics",
  "automation",
  "translation",
  "meeting",
  "marketing",
  "support",
  "sales",
  "hr",
  // Verticals
  "companion",
  "healthcare",
  "legal",
  "finance",
  "education",
  "real-estate",
  // Frontier
  "robotics",
  "science",
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
export type ChangeKind = "added" | "updated" | "fixed" | "archived" | "relisted" | "restepped";

export const APP_CHANGE_KINDS: ReadonlyArray<ChangeKind> = [
  "added",
  "updated",
  "fixed",
  "archived",
  "relisted",
  "restepped", // recipe audit: a step's app was swapped/changed
];

// Classification for a third-party `reference` (independent, non-vendor coverage
// of a listing): an editorial review, a how-to guide, a benchmark, a head-to-head
// comparison, a founder/maker interview, or a deeper analysis.
export type ReferenceKind =
  | "review"
  | "guide"
  | "benchmark"
  | "comparison"
  | "interview"
  | "analysis";

export const REFERENCE_KINDS: ReadonlyArray<ReferenceKind> = [
  "review",
  "guide",
  "benchmark",
  "comparison",
  "interview",
  "analysis",
];

// ── CAPABILITIES ───────────────────────────────────────────────────────────
// The TASK axis: WHAT a listing DOES, at a finer grain than `category` and able
// to cross it (a tool's capabilities may span its category). A controlled, finite
// leaf space (155 leaves / 14 families) — the keystone for comparisons, recipes,
// substitutions, and a future agent/function-calling surface. Distinct from
// `category` (the broad bucket) and from `bestFor` (re-scoped to persona/audience
// — WHO it's for). The TUPLE is the single source of truth; `AppCapability` is
// DERIVED from it (so the two can't drift), and `CAPABILITY_LABEL`
// (lib/tools/capability-labels.ts) is a `Record<AppCapability, string>` so a new
// leaf here is a compile error until it's labelled. Ordered by family.
export const APP_CAPABILITIES = [
  // coding
  "code-generation",
  "agentic-coding",
  "code-review",
  "ide-integration",
  "terminal-cli-agent",
  "code-execution",
  "code-documentation",
  "test-generation",
  // agents & automation
  "agent-framework",
  "agent-orchestration",
  "tool-calling",
  "mcp-server",
  "mcp-gateway",
  "workflow-automation",
  "browser-automation",
  "web-scraping",
  "voice-agent",
  // model serving, training & compute
  "model-inference",
  "llm-gateway",
  "multi-model-access",
  "model-fine-tuning",
  "gpu-compute",
  // eval, observability & AI safety
  "eval-suite",
  "llm-observability",
  "prompt-management",
  "red-teaming",
  "guardrails",
  "ai-security-scanning",
  "content-moderation",
  // retrieval, RAG & memory
  "vector-search",
  "embeddings",
  "rag-pipeline",
  "document-qa",
  "unified-search",
  "agent-memory",
  "knowledge-graph",
  "cited-answers",
  "recommendation",
  // data pipeline, extraction & app building
  "document-extraction",
  "data-labeling",
  "etl-pipeline",
  "app-deployment",
  "app-builder",
  "text-to-sql",
  "spreadsheet-automation",
  // speech & voice
  "speech-to-text",
  "text-to-speech",
  "voice-cloning",
  "speaker-diarization",
  "dubbing",
  "speech-translation",
  "dictation",
  "subtitle-generation",
  // audio & music
  "music-generation",
  "stem-separation",
  "audio-cleanup",
  "audio-mastering",
  "audio-editing",
  "sound-effects",
  // image generation & vision
  "text-to-image",
  "image-editing",
  "image-upscaling",
  "background-removal",
  "logo-generation",
  "avatar-generation",
  "object-detection",
  "image-classification",
  "video-understanding",
  "defect-detection",
  // video, 3D & design
  "text-to-video",
  "image-to-video",
  "video-editing",
  "lip-sync",
  "text-to-3d",
  "image-to-3d",
  "ui-design",
  "graphic-design",
  "presentation-generation",
  // writing, research & knowledge
  "long-form-writing",
  "text-editing",
  "summarization",
  "web-research-agent",
  "literature-review",
  "literature-search",
  "schema-extraction",
  "note-taking",
  "translation",
  "report-generation",
  "text-classification",
  // productivity, meetings & comms
  "meeting-notes",
  "calendar-scheduling",
  "email-assistant",
  "task-management",
  "localization",
  "data-analysis",
  // sales, marketing, support & HR
  "lead-enrichment",
  "outbound-prospecting",
  "crm-automation",
  "conversation-intelligence",
  "ticket-deflection",
  "knowledge-base-authoring",
  "ad-creative-generation",
  "seo-optimization",
  "resume-screening",
  "candidate-sourcing",
  "interview-assistance",
  // vertical — healthcare
  "clinical-documentation",
  "medical-coding",
  "clinical-decision-support",
  "medical-imaging",
  "symptom-triage",
  "healthcare-ops",
  // vertical — legal
  "contract-drafting",
  "contract-review",
  "contract-lifecycle",
  "legal-research",
  "case-management",
  "demand-letters",
  "regulatory-compliance",
  // vertical — finance
  "bookkeeping",
  "financial-close",
  "expense-management",
  "tax-preparation",
  "financial-modeling",
  "financial-research",
  "financial-data-extraction",
  "fraud-detection",
  // vertical — education
  "ai-tutoring",
  "flashcard-generation",
  "lesson-planning",
  "homework-solving",
  "language-practice",
  "study-material-conversion",
  // vertical — companion
  "companion-chat",
  "ambient-life-capture",
  "roleplay-characters",
  // vertical — real estate
  "property-valuation",
  "property-data-api",
  "virtual-staging",
  // frontier — robotics & embodied
  "robot-foundation-model",
  "vision-language-action",
  "dexterous-manipulation",
  "bipedal-locomotion",
  "imitation-learning",
  "sim-to-real",
  "world-model",
  "physics-simulation",
  "autonomous-navigation",
  // frontier — bio & molecular
  "protein-design",
  "protein-structure-prediction",
  "antibody-design",
  "molecular-design",
  "drug-target-discovery",
  // frontier — autonomous science
  "materials-discovery",
  "autonomous-research",
] as const;

// Derived from the tuple — the controlled task-axis vocabulary.
export type AppCapability = (typeof APP_CAPABILITIES)[number];

// The DEFERRED level (v1 authors id-only; this exists now so the field fills in
// later with no migration). "primary" = a core "best for" use the app is built
// around; "secondary" = a real but supporting "can also be used for" capability.
// Powers best-for-task ranking in recipes + the substitution engine (primary >
// secondary when matching a step).
export type CapabilityLevel = "primary" | "secondary";

export const CAPABILITY_LEVELS: ReadonlyArray<CapabilityLevel> = ["primary", "secondary"];

// The record SHAPES (App, AppLink, ModelSupport, AppScreenshot, ChangeEntry) are
// derived from the single source of truth — the zod schema in `lib/apps-schema.ts`
// — and re-exported here so every existing `@/types/app` import keeps working. To
// change a field, edit the schema (not this file); Velite validates every
// `data/apps/*.json` against it at build. The enum unions + value tuples above
// stay here because they're client-safe (zod-free) and reused by the filter UI.
export type {
  App,
  AppLink,
  AppCapabilityEntry,
  ModelSupport,
  AppScreenshot,
  ChangeEntry,
  Reference,
} from "@/lib/apps-schema";
