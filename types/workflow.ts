export type WorkflowPlatform = "web" | "android" | "windows" | "ios";

export const WORKFLOW_PLATFORMS: ReadonlyArray<WorkflowPlatform> = [
  "web",
  "android",
  "windows",
  "ios",
];

export type WorkflowProduct = "brief" | "forge" | "memo";

export const WORKFLOW_PRODUCTS: ReadonlyArray<WorkflowProduct> = ["brief", "forge", "memo"];

export type ArtifactType = "claude-md" | "prd" | "spec" | "prompt-library";

export const ARTIFACT_TYPES: ReadonlyArray<ArtifactType> = [
  "claude-md",
  "prd",
  "spec",
  "prompt-library",
];

export interface WorkflowProductMeta {
  id: WorkflowProduct;
  name: string;
  short: string;
  tagline: string;
  description: string;
  defaultPlatform: WorkflowPlatform;
  accentColor: string;
}

export interface PlatformNote {
  title: string;
  body: string;
}

export interface ChapterBeat {
  id: string;
  title: string;
  body: string;
}

// ── Claude Code chat transcript model (reusable components/claude-chat/*) ──
export type ChatSpeaker = "you" | "claude";

// Tool-use renders inside a claude message. (Rendering lands with the tool-block
// component in K-2; the type is defined here so the data model is stable.)
export type ChatToolBlock =
  | { kind: "run"; cmd: string; out?: string }
  | { kind: "write"; file: string; note?: string; href?: string }
  | { kind: "plan"; items: ReadonlyArray<string> }
  | { kind: "pr"; title: string; status: string }
  | { kind: "note"; perPlatform: Record<WorkflowPlatform, string> };

export interface ChatMessage {
  speaker: ChatSpeaker;
  body?: string;
  blocks?: ReadonlyArray<ChatToolBlock>;
}

// A stage of the vibecoding journey (Conceptualize → Specify → Build → Ship),
// shown as a Claude Code chat transcript. Replaces the old `Phase`.
export type StageId = "conceptualize" | "specify" | "build" | "ship";

export interface Stage {
  id: StageId;
  number: string;
  title: string;
  summary: string;
  beats: ReadonlyArray<ChapterBeat>;
  platformNotes: Record<WorkflowPlatform, PlatformNote>;
  transcript: ReadonlyArray<ChatMessage>;
}
