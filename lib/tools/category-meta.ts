import type { AppCategory } from "@/types/app";

// One-line descriptions for the /category/[slug] landing pages (page intro +
// meta description) and the /categories hub. Kept SEPARATE from
// category-labels.ts on purpose: the label map is re-exported by the client
// filter hook, so descriptions living there would ride into client bundles —
// these are server-only copy. `Record<AppCategory, string>` makes a missing
// description a compile error when a category is added. Keep each ≤160 chars
// (they double as meta descriptions).
export const CATEGORY_DESCRIPTION: Record<AppCategory, string> = {
  // Build — developer & infra tooling
  ide: "AI-native code editors and IDE assistants — autocomplete, codebase chat, and agentic edits inside the editor.",
  agent:
    "Autonomous AI agents that plan and execute multi-step work — from coding agents to general-purpose task runners.",
  orchestration:
    "Frameworks and platforms for composing, routing, and running LLM pipelines and multi-agent systems.",
  mcp: "Model Context Protocol servers and tooling that connect AI agents to external data, apps, and APIs.",
  eval: "Evaluation suites and testing harnesses for measuring LLM and agent quality before and after shipping.",
  observability:
    "Tracing, monitoring, and debugging for LLM apps — see what your prompts, chains, and agents actually did.",
  inference:
    "Model serving, inference engines, and LLM gateways — run, route, and scale models in production.",
  "fine-tuning":
    "Platforms and tooling for fine-tuning, distilling, and adapting foundation models on your own data.",
  infra:
    "GPU clouds, training stacks, and the compute infrastructure layer underneath modern AI workloads.",
  "vector-db":
    "Vector databases and embedding stores powering semantic search and retrieval-augmented generation.",
  memory:
    "Memory layers and knowledge stores that give AI assistants and agents persistent, recallable context.",
  "data-ops":
    "Data labeling, curation, and pipeline tooling that prepares training and evaluation data for AI.",
  security:
    "AI security tooling — guardrails, red-teaming, and protection for models, agents, and AI-powered SOCs.",
  // Create — media & design
  "image-gen":
    "Text-to-image generators and AI image editing, from diffusion models to production design pipelines.",
  video:
    "AI video generation and editing — text-to-video models, avatar studios, and automated post-production.",
  audio:
    "AI audio generation and processing — sound design, enhancement, dubbing, and speech-to-text engines.",
  music:
    "AI music generation — full tracks, stems, and royalty-free soundtracks from text prompts.",
  voice: "Voice AI — text-to-speech, voice cloning, and real-time conversational voice agents.",
  vision:
    "Computer-vision platforms and APIs — detection, OCR, visual search, and multimodal understanding.",
  "3d": "AI tools for 3D — text-to-3D asset generation, NeRFs, and spatial capture for games and design.",
  design: "AI design tools — UI generation, brand assets, and design-to-code workflows.",
  gaming:
    "AI for games — intelligent NPCs, world and level generation, and game-art and asset pipelines for studios and indie devs.",
  // Work — knowledge, ops & go-to-market
  assistant:
    "General-purpose AI assistants and chat interfaces — the daily-driver copilots for work and life.",
  writing:
    "AI writing tools — drafting, editing, and long-form content generation with editorial control.",
  productivity:
    "AI productivity tools — notes, documents, slides, and personal workflow automation.",
  search:
    "AI-powered search — answer engines, research copilots, and enterprise knowledge retrieval.",
  "research-platform":
    "Platforms for deep research and literature work — AI that reads, cites, and synthesizes sources.",
  analytics:
    "AI analytics — natural-language BI, automated insights, and data exploration copilots.",
  automation:
    "AI workflow automation — no-code builders and platforms that wire LLMs into business processes.",
  translation: "AI translation and localization — document, app, and real-time speech translation.",
  meeting: "AI meeting tools — recording, transcription, summaries, and action items from calls.",
  marketing: "AI marketing tools — campaign copy, SEO content, ad creative, and growth analytics.",
  support:
    "AI customer support — autonomous ticket resolution, support copilots, and CX automation.",
  sales:
    "AI for sales — autonomous SDRs, outbound prospecting, and conversation and revenue intelligence that research, write, and book pipeline.",
  hr: "AI for hiring and people ops — sourcing, AI interviewing and screening, onboarding, and HR support copilots.",
  // Verticals
  companion: "AI companions — conversational characters for connection, roleplay, and wellbeing.",
  healthcare:
    "AI for healthcare — clinical documentation, diagnostics support, and patient-facing tools.",
  legal: "AI for legal work — contract review, research, drafting, and matter management.",
  finance: "AI for finance — research copilots, accounting automation, and market intelligence.",
  education: "AI for learning — tutoring, course creation, and study tools.",
  "real-estate":
    "AI for real estate — property and parcel data, valuation, and CRE underwriting, leasing, and transaction workflows.",
  // Frontier
  robotics: "Embodied AI and robotics — foundation models, humanoids, and autonomous machines.",
  science:
    "AI for scientific discovery — drug design, protein and antibody engineering, and lab automation accelerating R&D.",
};

// The cluster grouping moved to category-clusters.ts when the filter UI (a
// client surface) started consuming it — clusters are dual-side, while the
// descriptions above stay server-only. Re-exported here so the existing server
// consumers (/categories, /category/[slug], llms.txt) keep their import path.
export { CATEGORY_CLUSTERS } from "./category-clusters";
