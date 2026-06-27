import type { AppCapability, CapabilityLevel } from "@/types/app";

// ── CAPABILITY FAMILIES ──────────────────────────────────────────────────────
// The grouping layer over the 155-leaf `AppCapability` task vocabulary, deferred
// from Chunk AA and added here (Chunk AC) now that capabilities are populated and
// the UI groups by family. 14 families, mirroring the family comment-groups in the
// `APP_CAPABILITIES` tuple (types/app.ts) — verticals consolidated into one
// `vertical` family and the frontier sub-groups into one `frontier` family.
//
// `CAPABILITY_FAMILY` is a `Record<AppCapability, CapabilityFamily>`, so adding a
// leaf to the tuple is a compile error here until it's assigned a family (the same
// completeness guard `CAPABILITY_LABEL` uses). Zod-free + client-safe.

export const CAPABILITY_FAMILIES = [
  "coding",
  "agents",
  "model-infra",
  "eval-safety",
  "retrieval",
  "data-apps",
  "speech",
  "audio",
  "vision",
  "writing",
  "productivity",
  "gtm",
  "vertical",
  "frontier",
] as const;

export type CapabilityFamily = (typeof CAPABILITY_FAMILIES)[number];

// Human labels for each family — used as group headings on the detail page, axis
// labels on the Insights capability chart, and headings in the machine surfaces.
export const CAPABILITY_FAMILY_LABEL: Record<CapabilityFamily, string> = {
  coding: "Coding",
  agents: "Agents & automation",
  "model-infra": "Models & compute",
  "eval-safety": "Eval & safety",
  retrieval: "Retrieval & memory",
  "data-apps": "Data & app building",
  speech: "Speech & voice",
  audio: "Audio & music",
  vision: "Image, vision & video",
  writing: "Writing & research",
  productivity: "Productivity & comms",
  gtm: "Sales, marketing & HR",
  vertical: "Vertical",
  frontier: "Frontier",
};

// Visual tone per family, mapped to the directory's five super-clusters
// (Build · Create · Work · Vertical · Frontier) so capability chips read as
// intentional and on-brand rather than a 14-hue rainbow. Each tone resolves to a
// `--color-…` token in the rendering components (detail chips + Insights chart).
export type CapabilityTone = "accent" | "violet" | "flame" | "success" | "warn";

export const CAPABILITY_FAMILY_TONE: Record<CapabilityFamily, CapabilityTone> = {
  // Build → accent (cyan)
  coding: "accent",
  agents: "accent",
  "model-infra": "accent",
  "eval-safety": "accent",
  retrieval: "accent",
  "data-apps": "accent",
  // Create → violet
  speech: "violet",
  audio: "violet",
  vision: "violet",
  // Work → flame
  writing: "flame",
  productivity: "flame",
  gtm: "flame",
  // Verticals → success (mint)
  vertical: "success",
  // Frontier → warn (amber)
  frontier: "warn",
};

// Every leaf → its family. Ordered exactly like the `APP_CAPABILITIES` tuple so a
// new leaf lines up with its neighbours. Completeness is compile-checked.
export const CAPABILITY_FAMILY: Record<AppCapability, CapabilityFamily> = {
  // coding
  "code-generation": "coding",
  "agentic-coding": "coding",
  "code-review": "coding",
  "ide-integration": "coding",
  "terminal-cli-agent": "coding",
  "code-execution": "coding",
  "code-documentation": "coding",
  "test-generation": "coding",
  // agents & automation
  "agent-framework": "agents",
  "agent-orchestration": "agents",
  "tool-calling": "agents",
  "mcp-server": "agents",
  "mcp-gateway": "agents",
  "workflow-orchestration": "agents",
  "automation-trigger": "agents",
  "browser-automation": "agents",
  "web-scraping": "agents",
  "voice-agent": "agents",
  // model serving, training & compute
  "model-inference": "model-infra",
  "llm-gateway": "model-infra",
  "multi-model-access": "model-infra",
  "model-fine-tuning": "model-infra",
  "gpu-compute": "model-infra",
  // eval, observability & AI safety
  "eval-suite": "eval-safety",
  "llm-observability": "eval-safety",
  "prompt-management": "eval-safety",
  "red-teaming": "eval-safety",
  guardrails: "eval-safety",
  "ai-security-scanning": "eval-safety",
  "content-moderation": "eval-safety",
  // retrieval, RAG & memory
  "vector-search": "retrieval",
  embeddings: "retrieval",
  "rag-pipeline": "retrieval",
  "document-qa": "retrieval",
  "unified-search": "retrieval",
  "agent-memory": "retrieval",
  "knowledge-graph": "retrieval",
  "cited-answers": "retrieval",
  recommendation: "retrieval",
  // data pipeline, extraction & app building
  "ocr-extraction": "data-apps",
  "document-parsing": "data-apps",
  "data-labeling": "data-apps",
  "etl-pipeline": "data-apps",
  "app-deployment": "data-apps",
  "app-builder": "data-apps",
  "text-to-sql": "data-apps",
  "spreadsheet-automation": "data-apps",
  // speech & voice
  "speech-to-text": "speech",
  "text-to-speech": "speech",
  "voice-cloning": "speech",
  "speaker-diarization": "speech",
  dubbing: "speech",
  "speech-translation": "speech",
  dictation: "speech",
  "subtitle-generation": "speech",
  // audio & music
  "music-generation": "audio",
  "stem-separation": "audio",
  "audio-cleanup": "audio",
  "audio-mastering": "audio",
  "audio-editing": "audio",
  "sound-effects": "audio",
  // image generation & vision
  "text-to-image": "vision",
  "image-editing": "vision",
  "image-upscaling": "vision",
  "background-removal": "vision",
  "logo-generation": "vision",
  "avatar-generation": "vision",
  "object-detection": "vision",
  "image-classification": "vision",
  "video-understanding": "vision",
  "defect-detection": "vision",
  // video, 3D & design
  "text-to-video": "vision",
  "image-to-video": "vision",
  "video-editing": "vision",
  "lip-sync": "vision",
  "text-to-3d": "vision",
  "image-to-3d": "vision",
  "ui-design": "vision",
  "graphic-design": "vision",
  "presentation-generation": "vision",
  // writing, research & knowledge
  "long-form-writing": "writing",
  "text-editing": "writing",
  summarization: "writing",
  "web-research-agent": "writing",
  "literature-review": "writing",
  "literature-search": "writing",
  "schema-extraction": "writing",
  "note-taking": "writing",
  translation: "writing",
  "report-generation": "writing",
  "text-classification": "writing",
  // productivity, meetings & comms
  "meeting-notes": "productivity",
  "calendar-scheduling": "productivity",
  "email-assistant": "productivity",
  "task-management": "productivity",
  localization: "productivity",
  "data-analysis": "productivity",
  // sales, marketing, support & HR
  "lead-enrichment": "gtm",
  "outbound-prospecting": "gtm",
  "crm-automation": "gtm",
  "conversation-intelligence": "gtm",
  "ticket-deflection": "gtm",
  "knowledge-base-authoring": "gtm",
  "ad-creative-generation": "gtm",
  "seo-optimization": "gtm",
  "resume-screening": "gtm",
  "candidate-sourcing": "gtm",
  "interview-assistance": "gtm",
  // vertical — healthcare
  "clinical-documentation": "vertical",
  "medical-coding": "vertical",
  "clinical-decision-support": "vertical",
  "medical-imaging": "vertical",
  "symptom-triage": "vertical",
  "healthcare-ops": "vertical",
  // vertical — legal
  "contract-drafting": "vertical",
  "contract-review": "vertical",
  "contract-lifecycle": "vertical",
  "legal-research": "vertical",
  "case-management": "vertical",
  "demand-letters": "vertical",
  "regulatory-compliance": "vertical",
  // vertical — finance
  bookkeeping: "vertical",
  "financial-close": "vertical",
  "expense-management": "vertical",
  "tax-preparation": "vertical",
  "financial-modeling": "vertical",
  "financial-research": "vertical",
  "financial-data-extraction": "vertical",
  "fraud-detection": "vertical",
  // vertical — education
  "ai-tutoring": "vertical",
  "flashcard-generation": "vertical",
  "lesson-planning": "vertical",
  "homework-solving": "vertical",
  "language-practice": "vertical",
  "study-material-conversion": "vertical",
  // vertical — companion
  "companion-chat": "vertical",
  "ambient-life-capture": "vertical",
  "roleplay-characters": "vertical",
  // vertical — real estate
  "property-valuation": "vertical",
  "property-data-api": "vertical",
  "virtual-staging": "vertical",
  // frontier — robotics & embodied
  "robot-foundation-model": "frontier",
  "vision-language-action": "frontier",
  "dexterous-manipulation": "frontier",
  "bipedal-locomotion": "frontier",
  "imitation-learning": "frontier",
  "sim-to-real": "frontier",
  "world-model": "frontier",
  "physics-simulation": "frontier",
  "autonomous-navigation": "frontier",
  // frontier — bio & molecular
  "protein-design": "frontier",
  "protein-structure-prediction": "frontier",
  "antibody-design": "frontier",
  "molecular-design": "frontier",
  "drug-target-discovery": "frontier",
  // frontier — autonomous science
  "materials-discovery": "frontier",
  "autonomous-research": "frontier",
};

const FAMILY_INDEX = new Map<CapabilityFamily, number>(CAPABILITY_FAMILIES.map((f, i) => [f, i]));

/** A listing's capabilities, grouped into families in canonical family order
 *  (and leaf order preserved within each family). Used by the detail page. */
export function groupCapabilitiesByFamily(
  ids: ReadonlyArray<AppCapability>,
): ReadonlyArray<{ family: CapabilityFamily; ids: AppCapability[] }> {
  const buckets = new Map<CapabilityFamily, AppCapability[]>();
  for (const id of ids) {
    const fam = CAPABILITY_FAMILY[id];
    const arr = buckets.get(fam);
    if (arr) arr.push(id);
    else buckets.set(fam, [id]);
  }
  return [...buckets.entries()]
    .sort((a, b) => (FAMILY_INDEX.get(a[0]) ?? 0) - (FAMILY_INDEX.get(b[0]) ?? 0))
    .map(([family, ids]) => ({ family, ids }));
}

/** A capability entry carrying its level (AF-2) — the structural slice of
 *  `AppCapabilityEntry` the UI needs (kept local so this stays zod-free + client-safe). */
export interface CapabilityEntry {
  id: AppCapability;
  level?: CapabilityLevel;
  note?: string;
}

// primary ("built for") sorts ahead of secondary ("can also do"); unleveled last.
const LEVEL_RANK: Record<"primary" | "secondary" | "none", number> = {
  primary: 0,
  secondary: 1,
  none: 2,
};

/** Like {@link groupCapabilitiesByFamily} but preserves each entry's `level`/`note`
 *  and orders **primary before secondary** within every family (stable otherwise).
 *  The level-aware detail page renders from this so the headline jobs lead each row. */
export function groupCapabilityEntriesByFamily(
  entries: ReadonlyArray<CapabilityEntry>,
): ReadonlyArray<{ family: CapabilityFamily; entries: CapabilityEntry[] }> {
  const buckets = new Map<CapabilityFamily, CapabilityEntry[]>();
  for (const e of entries) {
    const fam = CAPABILITY_FAMILY[e.id];
    const arr = buckets.get(fam);
    if (arr) arr.push(e);
    else buckets.set(fam, [e]);
  }
  return [...buckets.entries()]
    .sort((a, b) => (FAMILY_INDEX.get(a[0]) ?? 0) - (FAMILY_INDEX.get(b[0]) ?? 0))
    .map(([family, es]) => ({
      family,
      entries: es
        .slice()
        .sort((a, b) => LEVEL_RANK[a.level ?? "none"] - LEVEL_RANK[b.level ?? "none"]),
    }));
}
