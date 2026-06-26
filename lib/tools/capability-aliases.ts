import type { AppCapability } from "@/types/app";

// Synonym → canonical-leaf map. The controlled `AppCapability` enum is the
// allowlist, but external callers (a recipe planner, an LLM function-call, a
// search query) will phrase a task many ways — "transcription" / "stt" /
// "speech recognition" all mean `speech-to-text`. This map makes the ids usable
// as a matching TARGET instead of brittle exact-match, and it keeps free-form
// terms resolving after merges/renames/splits (`ocr`→`ocr-extraction`,
// `enterprise-search`→`unified-search`), so a planner trained on an earlier
// vocabulary still lands. Values are compile-checked against the enum.
//
// Lookup contract: normalize the incoming string first — lowercase, trim, and
// collapse spaces/underscores to hyphens — then check (a) APP_CAPABILITIES for a
// direct id hit, (b) this map. Keys here are already in that normalized form.
export const CAPABILITY_ALIASES: Record<string, AppCapability> = {
  // coding
  "code-completion": "code-generation",
  autocomplete: "code-generation",
  "coding-agent": "agentic-coding",
  "code-docs": "code-documentation",
  docstrings: "code-documentation",
  "unit-tests": "test-generation",
  "test-gen": "test-generation",
  "qa-testing": "test-generation",
  // agents & automation
  "function-calling": "tool-calling",
  "function-call": "tool-calling",
  "web-data-extraction": "web-scraping", // merged
  scraping: "web-scraping",
  crawling: "web-scraping",
  "computer-use": "browser-automation",
  orchestration: "workflow-orchestration",
  "workflow-builder": "workflow-orchestration",
  automation: "automation-trigger",
  "trigger-action": "automation-trigger",
  "phone-agent": "voice-agent",
  telephony: "voice-agent",
  // model serving, training & compute
  inference: "model-inference",
  "model-serving": "model-inference",
  "model-routing": "llm-gateway",
  "fine-tuning": "model-fine-tuning",
  training: "model-fine-tuning",
  lora: "model-fine-tuning",
  // eval, observability & AI safety
  evals: "eval-suite",
  benchmarking: "eval-suite",
  tracing: "llm-observability",
  moderation: "content-moderation",
  "secrets-management": "ai-security-scanning", // closest surviving home
  // retrieval, RAG & memory
  "semantic-search": "vector-search",
  rag: "rag-pipeline",
  "retrieval-augmented-generation": "rag-pipeline",
  "enterprise-search": "unified-search", // renamed
  "workplace-search": "unified-search",
  memory: "agent-memory",
  "bio-knowledge-graph": "knowledge-graph", // merged
  recommender: "recommendation",
  personalization: "recommendation", // dropped → nearest
  // data pipeline, extraction & app building
  ocr: "ocr-extraction",
  "pdf-extraction": "document-parsing",
  "data-extraction": "document-parsing",
  etl: "etl-pipeline",
  "no-code": "app-builder",
  "low-code": "app-builder",
  nl2sql: "text-to-sql",
  spreadsheet: "spreadsheet-automation",
  // speech & voice
  transcription: "speech-to-text",
  stt: "speech-to-text",
  "speech-recognition": "speech-to-text",
  tts: "text-to-speech",
  "speech-synthesis": "text-to-speech",
  voiceover: "text-to-speech", // merged
  narration: "text-to-speech",
  diarization: "speaker-diarization",
  captions: "subtitle-generation",
  captioning: "subtitle-generation",
  subtitles: "subtitle-generation",
  // audio & music
  music: "music-generation",
  "vocal-separation": "stem-separation",
  "audio-denoise": "audio-cleanup",
  // image generation & vision
  "image-generation": "text-to-image",
  text2image: "text-to-image",
  "remove-background": "background-removal",
  upscaling: "image-upscaling",
  "super-resolution": "image-upscaling",
  avatar: "avatar-generation",
  "talking-avatar": "avatar-generation",
  "digital-human": "avatar-generation",
  // video, 3D & design
  "video-generation": "text-to-video",
  text2video: "text-to-video",
  "3d-generation": "text-to-3d",
  lipsync: "lip-sync",
  "design-to-code": "ui-design",
  slides: "presentation-generation",
  deck: "presentation-generation",
  // writing, research & knowledge
  summarize: "summarization",
  "structured-extraction": "schema-extraction", // renamed
  "json-extraction": "schema-extraction",
  "machine-translation": "translation",
  pkm: "note-taking",
  // productivity, meetings & comms
  scheduling: "calendar-scheduling",
  inbox: "email-assistant",
  "project-management": "task-management",
  bi: "data-analysis",
  "business-intelligence": "data-analysis",
  i18n: "localization",
  "software-localization": "localization",
  // sales, marketing, support & HR
  sdr: "outbound-prospecting",
  crm: "crm-automation",
  "customer-support": "ticket-deflection",
  helpdesk: "ticket-deflection",
  seo: "seo-optimization",
  geo: "seo-optimization",
  "ad-generation": "ad-creative-generation",
  "resume-parsing": "resume-screening",
  ats: "resume-screening",
  sourcing: "candidate-sourcing",
  // vertical
  "medical-scribe": "clinical-documentation",
  "ambient-scribe": "clinical-documentation",
  radiology: "medical-imaging",
  redlining: "contract-review",
  clm: "contract-lifecycle",
  accounting: "bookkeeping",
  tax: "tax-preparation",
  tutoring: "ai-tutoring",
  flashcards: "flashcard-generation",
  // frontier
  "protein-folding": "protein-structure-prediction",
  "self-driving": "autonomous-navigation",
  "autonomous-driving": "autonomous-navigation",
  vla: "vision-language-action",
  humanoid: "bipedal-locomotion",
};
