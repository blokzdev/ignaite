import type { AppCategory } from "@/types/app";

// SINGLE SOURCE OF TRUTH for human-readable category labels. Imported by both
// server components (tool-card, app-detail) and the client filter hook
// (use-directory-filters re-exports it) — this module carries no "use client"
// directive so either side can pull it without dragging the other's bundle in.
// Ordered to mirror the cluster order of APP_CATEGORIES in types/app.ts.
// The `Record<AppCategory, string>` type makes a missing label a compile error,
// so adding a category to the enum forces a label here (and nowhere else).
export const CATEGORY_LABEL: Record<AppCategory, string> = {
  // Build — developer & infra tooling
  ide: "IDE",
  agent: "Agent",
  orchestration: "Orchestration",
  mcp: "MCP",
  eval: "Eval",
  observability: "Observability",
  inference: "Inference",
  "fine-tuning": "Fine-tuning",
  infra: "Infra",
  "vector-db": "Vector DB",
  memory: "Memory",
  "data-ops": "Data Ops",
  security: "Security",
  // Create — media & design
  "image-gen": "Image",
  video: "Video",
  audio: "Audio",
  music: "Music",
  voice: "Voice",
  vision: "Vision",
  "3d": "3D",
  design: "Design",
  gaming: "Gaming",
  // Work — knowledge, ops & go-to-market
  assistant: "Assistant",
  writing: "Writing",
  productivity: "Productivity",
  search: "Search",
  "research-platform": "Research",
  analytics: "Analytics",
  automation: "Automation",
  translation: "Translation",
  meeting: "Meeting",
  marketing: "Marketing",
  support: "Support",
  sales: "Sales",
  hr: "HR",
  // Verticals
  companion: "Companion",
  healthcare: "Healthcare",
  legal: "Legal",
  finance: "Finance",
  education: "Education",
  "real-estate": "Real Estate",
  // Frontier
  robotics: "Robotics",
  science: "Science",
};
