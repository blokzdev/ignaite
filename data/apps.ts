import type { App } from "@/types/app";

// AI apps directory. Comprehensive third-party listings, researched, written,
// and kept current with Claude Code. Signals are neutral and derived
// (category / pricing / license / deployment / platforms) — no studio badge.
//
// Migrated from the curated `tools` data in Iteration 3 chunk C. The 3 model
// entries (Claude, Gemini, Llama) were dropped — models are foundations,
// not browsable apps. Per-app `modelSupport` now describes which models each
// listing uses / supports.
//
// Edit freely; further entries land via batched data PRs (chunks A1, A2, A3...).

export const apps: ReadonlyArray<App> = [
  // ── IDE / Agent surfaces ───────────────────────────────────────────────
  {
    slug: "claude-code",
    insight:
      "Ships the same agent across CLI, IDE extension, desktop, and web from one codebase — and it's the tool that wrote this very directory.",
    name: "Claude Code",
    tagline: "Anthropic's official CLI / IDE / web agent. Primary author at Blokz.",
    description:
      "Claude Code is our lead architect. It reads the spec, drafts the diff, runs the tests, and opens the PR — across CLI, IDE extensions, the desktop app, and the web. Everything on blokz.dev was built with it.",
    category: "ide",
    pricing: "freemium",
    deployment: "local",
    vendor: "Anthropic",
    platforms: ["macos", "windows", "linux", "cli", "vscode-extension", "web"],
    modelSupport: {
      kind: "single-model",
      models: ["Claude Opus", "Claude Sonnet", "Claude Haiku"],
      notes: "Anthropic-only; runs against your API key or a Claude Pro/Max plan.",
    },
    accentColor: "#08D9D6",
    featured: true,
    tags: ["agentic", "cli", "ide", "mcp", "subagents"],
    links: [
      { kind: "website", url: "https://claude.com/claude-code", primary: true },
      { kind: "docs", url: "https://docs.anthropic.com/claude/docs/claude-code" },
      { kind: "github", url: "https://github.com/anthropics/claude-code" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "cursor",
    insight:
      "A full VS Code fork, so existing extensions and keybindings carry over — and one subscription covers Claude, GPT, and Gemini without a key.",
    name: "Cursor",
    tagline: "AI-first code editor. Multi-model, tab-completion native.",
    description:
      "Fork of VS Code with deep model integration — multi-line tab completion, agent mode, chat with codebase context. Strong for fast iteration on existing repos.",
    category: "ide",
    pricing: "freemium",
    deployment: "local",
    featured: true,
    vendor: "Anysphere",
    platforms: ["macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT-5", "Gemini", "DeepSeek"],
      notes: "Bundled plan covers all providers; BYO key also supported.",
    },
    accentColor: "#37F3FF",
    tags: ["ide", "multi-model", "vscode-fork"],
    links: [
      { kind: "website", url: "https://cursor.com", primary: true },
      { kind: "pricing", url: "https://cursor.com/pricing" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "windsurf",
    insight:
      "Its Cascade agent plans before it edits, which pays off when a change spans many files rather than a single buffer.",
    name: "Windsurf",
    tagline: "Cascade agent + IDE. Codeium's developer surface.",
    description:
      "Agent-first IDE that pairs autocomplete with Cascade, a planning-then-acting agent. Strong terminal integration; good when the diff spans many files.",
    category: "ide",
    pricing: "freemium",
    deployment: "local",
    vendor: "Codeium",
    platforms: ["macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini"],
      notes: "Bundled subscription includes the model spend.",
    },
    accentColor: "#A78BFA",
    tags: ["ide", "agentic", "cascade"],
    links: [
      { kind: "website", url: "https://windsurf.com", primary: true },
      { kind: "pricing", url: "https://windsurf.com/pricing" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "aider",
    insight:
      "Auto-commits each change to git, so every AI edit is its own revertable commit — and it runs against local models, not just frontier APIs.",
    name: "Aider",
    tagline: "Terminal-native pair programmer. BYO key, BYO model.",
    description:
      "Open-source CLI for AI pair-programming directly against your git repo. Brings any model (Claude, Gemini, GPT, local) into a tight commit-per-task loop.",
    category: "ide",
    pricing: "byo-key",
    openSource: true,
    deployment: "local",
    vendor: "Paul Gauthier",
    platforms: ["macos", "windows", "linux", "cli"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "Gemini", "GPT", "Local (Ollama, llama.cpp)"],
    },
    accentColor: "#5EEAD4",
    tags: ["cli", "open-source", "self-hosted", "multi-model"],
    links: [
      { kind: "website", url: "https://aider.chat", primary: true },
      { kind: "github", url: "https://github.com/Aider-AI/aider" },
      { kind: "docs", url: "https://aider.chat/docs/" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },

  // ── MCP servers ────────────────────────────────────────────────────────
  {
    slug: "mcp-github",
    insight:
      "Beyond PRs and issues it exposes secret-scanning, so an agent can audit a repo's security, not just read its code.",
    name: "GitHub MCP",
    tagline: "Reads + writes GitHub from any MCP-aware agent.",
    description:
      "Official GitHub MCP server. Wired into Claude Code and most agentic surfaces to read PRs, post comments, create branches, and run secret-scanning. Used daily at Blokz.",
    category: "mcp",
    pricing: "free",
    openSource: true,
    vendor: "GitHub",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#8FA3BA",
    tags: ["mcp", "git", "code-review", "open-source"],
    links: [
      { kind: "github", url: "https://github.com/github/github-mcp-server", primary: true },
      {
        kind: "docs",
        url: "https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-skillsets",
      },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "mcp-supabase",
    insight:
      "Lets an agent run Postgres migrations and deploy edge functions in-context, erasing the usual jump between editor and database dashboard.",
    name: "Supabase MCP",
    tagline: "Postgres + auth + edge functions from inside the agent.",
    description:
      "MCP server that exposes Supabase project ops — list tables, apply migrations, deploy edge functions, fetch advisors. Removes a context-switch cliff between code and database.",
    category: "mcp",
    pricing: "free",
    openSource: true,
    vendor: "Supabase",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#3ECF8E",
    tags: ["mcp", "database", "postgres", "open-source"],
    links: [
      { kind: "github", url: "https://github.com/supabase-community/supabase-mcp", primary: true },
      { kind: "docs", url: "https://supabase.com/docs/guides/getting-started/mcp" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "mcp-vercel",
    insight:
      "Archived here: the community github.com/vercel/mcp URL was retired once Vercel folded MCP into its first-party platform instead.",
    name: "Vercel MCP",
    tagline: "Deploys + build logs + runtime logs in agent context.",
    description:
      "Vercel-native MCP server for deploying directly from chat, inspecting build/runtime logs, and reading deployment metadata. Original github.com/vercel/mcp community URL is no longer published; first-party MCP integration ships via the Vercel docs.",
    category: "mcp",
    pricing: "free",
    vendor: "Vercel",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#E8F1F8",
    tags: ["mcp", "deploy", "logs"],
    links: [{ kind: "docs", url: "https://vercel.com/docs/mcp", primary: true }],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
    status: "archived",
  },

  // ── Eval / observability ───────────────────────────────────────────────
  {
    slug: "promptfoo",
    insight:
      "Define evals in plain YAML and run one goldset across models in CI — a prompt regression fails the build like any other test.",
    name: "Promptfoo",
    tagline: "Open-source LLM eval CLI. Rubric scoring + golden sets.",
    description:
      "YAML-driven eval harness. Pair a prompt with a goldset, define rubrics, run across multiple models in CI. Strong for catching prompt regressions before they hit production.",
    category: "eval",
    pricing: "free",
    openSource: true,
    vendor: "Promptfoo",
    platforms: ["cli", "macos", "windows", "linux"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "Local"],
    },
    accentColor: "#5EEAD4",
    tags: ["eval", "ci", "rubric", "open-source"],
    links: [
      { kind: "website", url: "https://promptfoo.dev", primary: true },
      { kind: "github", url: "https://github.com/promptfoo/promptfoo" },
      { kind: "docs", url: "https://promptfoo.dev/docs/getting-started" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "braintrust",
    insight:
      "Where teams graduate when a CI eval file stops scaling — it adds dataset versioning and OpenTelemetry traces to the loop.",
    name: "Braintrust",
    tagline: "Hosted eval + tracing platform for LLM apps.",
    description:
      "Production-grade eval orchestration with a dashboard, dataset versioning, and OpenTelemetry tracing. Useful once eval volume outgrows a CI YAML file.",
    category: "eval",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Braintrust",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "Custom"],
    },
    accentColor: "#FBBF24",
    tags: ["eval", "tracing", "datasets", "production"],
    links: [
      { kind: "website", url: "https://www.braintrust.dev", primary: true },
      { kind: "docs", url: "https://www.braintrust.dev/docs" },
      { kind: "pricing", url: "https://www.braintrust.dev/pricing" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Infra ──────────────────────────────────────────────────────────────
  {
    slug: "vercel",
    insight:
      "The infrastructure this directory itself runs on — Next.js-native deploys with edge functions powering the contact form.",
    name: "Vercel",
    tagline: "Where blokz.dev lives. Edge functions + image opt + analytics.",
    description:
      "Hosts blokz.dev. Next.js-native, fast deploys, edge functions for the contact API, free Speed Insights tier. Strong default for the React/Next ecosystem.",
    category: "infra",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Vercel",
    platforms: ["web", "api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#E8F1F8",
    featured: true,
    tags: ["hosting", "edge", "nextjs", "ci"],
    links: [
      { kind: "website", url: "https://vercel.com", primary: true },
      { kind: "docs", url: "https://vercel.com/docs" },
      { kind: "pricing", url: "https://vercel.com/pricing" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "supabase",
    insight:
      "Built on plain Postgres, so there's no proprietary lock-in — and the same project ships the Supabase MCP server also listed here.",
    name: "Supabase",
    tagline: "Postgres + auth + storage + edge functions, open source.",
    description:
      "Default backend layer at Blokz when an app needs persistence + auth + realtime. Open-source, self-hostable, very low friction to local dev with the CLI.",
    category: "infra",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Supabase",
    platforms: ["web", "api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#3ECF8E",
    tags: ["postgres", "auth", "realtime", "open-source"],
    links: [
      { kind: "website", url: "https://supabase.com", primary: true },
      { kind: "docs", url: "https://supabase.com/docs" },
      { kind: "github", url: "https://github.com/supabase/supabase" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "cloudflare",
    insight:
      "Its R2 storage charges no egress fees — the standout reason teams move large-asset workloads off S3.",
    name: "Cloudflare",
    tagline: "Workers + R2 + D1 + Durable Objects. Global edge runtime.",
    description:
      "When the app needs to run close to users globally, or when an isolate-per-request model fits the workload better than Node functions. R2 for storage, D1 for SQLite-at-the-edge.",
    category: "infra",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Cloudflare",
    platforms: ["web", "api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#F38020",
    tags: ["edge", "workers", "storage", "global"],
    links: [
      { kind: "website", url: "https://www.cloudflare.com/developer-platform/", primary: true },
      { kind: "docs", url: "https://developers.cloudflare.com" },
      { kind: "pricing", url: "https://www.cloudflare.com/plans/" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Memory / context ───────────────────────────────────────────────────
  {
    slug: "mem0",
    insight:
      "Stores distilled facts rather than whole transcripts, so an agent's memory stays small and relevant as conversations grow.",
    name: "mem0",
    tagline: "Long-term memory layer for AI agents. Self-hostable.",
    description:
      "Persistent memory store + retrieval pipeline for agent applications. Handles per-user/per-session/per-agent scope cleanly; pairs with OpenAI, Anthropic, and local models.",
    category: "memory",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Mem0",
    platforms: ["api", "cli"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "Local"],
    },
    accentColor: "#A78BFA",
    tags: ["memory", "agents", "rag", "self-hosted"],
    links: [
      { kind: "website", url: "https://mem0.ai", primary: true },
      { kind: "github", url: "https://github.com/mem0ai/mem0" },
      { kind: "docs", url: "https://docs.mem0.ai" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "letta",
    insight:
      "The productized successor to the MemGPT paper — agents edit their own memory blocks to manage a finite context window.",
    name: "Letta",
    tagline: "Stateful agents with structured memory. Successor to MemGPT.",
    description:
      "Open-source framework for building stateful agents — memory blocks, context-window management, tool-use primitives baked in. Useful as a reference architecture for long-running agents.",
    category: "memory",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Letta",
    platforms: ["api", "cli", "macos", "windows", "linux"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Local"],
    },
    accentColor: "#37F3FF",
    tags: ["memory", "stateful", "agents", "open-source"],
    links: [
      { kind: "website", url: "https://letta.com", primary: true },
      { kind: "github", url: "https://github.com/letta-ai/letta" },
      { kind: "docs", url: "https://docs.letta.com" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Research platforms ─────────────────────────────────────────────────
  {
    slug: "huggingface",
    insight:
      "One account spans model weights, datasets, runnable Spaces, and a daily papers feed — the closest thing to a commons for open AI.",
    name: "Hugging Face",
    tagline: "Models, datasets, papers, spaces. The AI research commons.",
    description:
      "Source-of-truth for open-weights models and datasets. Daily-paper feed for tracking research; Spaces for trying ideas without setting up infra. Heavy use at Blokz for any model we don't pay an API for.",
    category: "research-platform",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Hugging Face",
    platforms: ["web", "api", "cli"],
    modelSupport: {
      kind: "model-agnostic",
      notes: "Hosts the models; you pick which.",
    },
    accentColor: "#FBBF24",
    tags: ["models", "datasets", "papers", "open-source"],
    links: [
      { kind: "website", url: "https://huggingface.co", primary: true },
      { kind: "docs", url: "https://huggingface.co/docs" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "arxiv-sanity",
    insight:
      "Karpathy's own tool, open-source and self-hostable — a tag-trained recommender that tames the arXiv firehose into a personal feed.",
    name: "arxiv-sanity-lite",
    tagline: "Personalized arxiv reader by Andrej Karpathy.",
    description:
      "Tag-and-track arxiv papers without drowning in the firehose. We track papers across edge inference, multi-agent harnesses, and memory architectures here — the spine of the Blokz Brief sample product.",
    category: "research-platform",
    pricing: "free",
    vendor: "Andrej Karpathy",
    platforms: ["web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#5EEAD4",
    tags: ["arxiv", "papers", "research", "open-source"],
    links: [
      { kind: "website", url: "https://arxiv-sanity-lite.com", primary: true },
      { kind: "github", url: "https://github.com/karpathy/arxiv-sanity-lite" },
    ],
    addedAt: "2025-02-01",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Agent surfaces ─────────────────────────────────────────────────────
  {
    slug: "devin",
    insight:
      "Runs asynchronously in its own cloud sandbox aimed at whole tickets, not autocomplete — and the model and harness are closed.",
    name: "Devin",
    tagline: "Autonomous software engineer agent. Plans, codes, ships from a prompt.",
    description:
      "Cognition's hosted SWE agent. Operates inside its own sandbox with a browser, terminal, and editor — plans the work, writes the code, and submits a PR. Aimed at long-horizon tickets rather than tab-completions.",
    category: "agent",
    pricing: "paid",
    deployment: "cloud",
    vendor: "Cognition AI",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary model + harness; not user-configurable.",
    },
    accentColor: "#A78BFA",
    tags: ["autonomous", "swe-agent", "browser", "sandbox"],
    links: [
      { kind: "website", url: "https://devin.ai", primary: true },
      { kind: "docs", url: "https://docs.devin.ai" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "manus",
    insight:
      "Went viral on invite-only scarcity, then was acquired by Meta — a general operator for non-code work rather than a coding tool.",
    name: "Manus",
    tagline: "General-purpose autonomous agent for research, ops, and content.",
    description:
      "Cloud agent that browses, drafts, schedules, and follows multi-step instructions over hours. Closer to a virtual operator than a coding tool — strong for non-code knowledge work. Acquired by Meta; product continues to ship.",
    category: "agent",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Meta (formerly Monica / Manus AI)",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary orchestration over hosted frontier models.",
    },
    accentColor: "#37F3FF",
    tags: ["autonomous", "general-purpose", "ops", "browser"],
    links: [{ kind: "website", url: "https://manus.im", primary: true }],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "cline",
    insight:
      "Formerly 'Claude Dev' — fully open-source and BYO-key, it shows and asks approval for every file edit and command it runs.",
    name: "Cline",
    tagline: "Open-source autonomous coding agent in VS Code. BYO key.",
    description:
      "Community-maintained VS Code extension that turns the editor into an agent surface — reads the repo, runs commands, edits files, and verifies its work. Pairs naturally with Claude. Formerly known as Claude Dev.",
    category: "agent",
    pricing: "byo-key",
    openSource: true,
    deployment: "local",
    vendor: "Cline Bot Inc.",
    platforms: ["vscode-extension"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "DeepSeek", "Local (Ollama)"],
    },
    accentColor: "#5EEAD4",
    tags: ["agentic", "vscode", "open-source", "byo-key"],
    links: [
      { kind: "website", url: "https://cline.bot", primary: true },
      { kind: "github", url: "https://github.com/cline/cline" },
      { kind: "docs", url: "https://docs.cline.bot" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "openhands",
    insight:
      "The open-source answer to Devin (and its former name, OpenDevin) — same sandbox-agent shape, but you can self-host and read the code.",
    name: "OpenHands",
    tagline: "Open-source autonomous SWE agent. Successor to OpenDevin.",
    description:
      "Self-hostable agent platform with a browser, terminal, and editor in a sandbox — comparable to Devin in shape, open in licence. Active research community pushing the autonomous-SWE bar.",
    category: "agent",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "All Hands AI",
    platforms: ["web", "cli", "api"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "Local"],
    },
    accentColor: "#A78BFA",
    tags: ["autonomous", "swe-agent", "sandbox", "open-source", "self-hosted"],
    links: [
      { kind: "website", url: "https://www.openhands.dev", primary: true },
      { kind: "github", url: "https://github.com/All-Hands-AI/OpenHands" },
      { kind: "docs", url: "https://docs.all-hands.dev" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "bolt-new",
    insight:
      "The entire Node stack runs inside the browser tab via StackBlitz's WebContainers — no server is spun up behind your build.",
    name: "Bolt.new",
    tagline: "Prompt-to-app generator running in the browser. WebContainers under the hood.",
    description:
      "StackBlitz's in-browser full-stack app builder. Generates a working project — frontend, backend, deps — and lets you iterate in a sandboxed Node runtime without leaving the tab.",
    category: "agent",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "StackBlitz",
    platforms: ["web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT"],
    },
    accentColor: "#08D9D6",
    tags: ["full-stack", "web", "webcontainers", "prompt-to-app"],
    links: [
      { kind: "website", url: "https://bolt.new", primary: true },
      { kind: "docs", url: "https://support.bolt.new" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "v0",
    insight:
      "Emits real shadcn/ui + Tailwind code you can paste into a project — the same primitive stack this directory is built from.",
    name: "v0",
    tagline: "Prompt-to-UI generator from Vercel. Outputs React + Tailwind + shadcn.",
    description:
      "Vercel's generative UI surface. Type a description, get a working React component using Tailwind and shadcn primitives — copy the code or fork into a v0 project for iteration.",
    category: "agent",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Vercel",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      notes: "Vercel's tuned model; not user-configurable.",
    },
    accentColor: "#E8F1F8",
    tags: ["ui-gen", "react", "tailwind", "shadcn"],
    links: [
      { kind: "website", url: "https://v0.app", primary: true },
      { kind: "docs", url: "https://v0.app/docs" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Orchestration ──────────────────────────────────────────────────────
  {
    slug: "langchain",
    insight:
      "The ecosystem's default on-ramp, anchoring a trio with LangGraph (agents) and LangSmith (tracing) — both also listed here.",
    name: "LangChain",
    tagline: "The default open-source framework for composing LLM apps.",
    description:
      "Python + TypeScript framework for chaining prompts, tools, retrievers, and memory into LLM applications. Ubiquitous in the ecosystem; pairs with LangGraph for agent orchestration and LangSmith for tracing.",
    category: "orchestration",
    pricing: "free",
    openSource: true,
    featured: true,
    vendor: "LangChain",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#5EEAD4",
    tags: ["framework", "python", "typescript", "rag", "open-source"],
    links: [
      { kind: "website", url: "https://langchain.com", primary: true },
      { kind: "github", url: "https://github.com/langchain-ai/langchain" },
      { kind: "docs", url: "https://python.langchain.com" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "langgraph",
    insight:
      "LangChain's low-level layer: a durable state graph with checkpoints, so a long agent run can pause for a human and resume later.",
    name: "LangGraph",
    tagline: "Graph-based agent orchestration. Stateful loops with checkpoints.",
    description:
      "LangChain's agent layer. Model agents as nodes in a state graph with persistent checkpoints, human-in-the-loop steps, and durable execution. Strong when you need a long-running, debuggable agent rather than a one-shot chain.",
    category: "orchestration",
    pricing: "free",
    openSource: true,
    vendor: "LangChain",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["agents", "graph", "state", "open-source"],
    links: [
      { kind: "website", url: "https://langchain.com/langgraph", primary: true },
      { kind: "github", url: "https://github.com/langchain-ai/langgraph" },
      { kind: "docs", url: "https://langchain-ai.github.io/langgraph/" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "crewai",
    insight:
      "Built standalone rather than on LangChain — it models work as a 'crew' of role-typed agents that delegate tasks to each other.",
    name: "CrewAI",
    tagline: "Multi-agent framework with explicit roles and tasks.",
    description:
      "Python framework for orchestrating crews of specialised agents — researcher, writer, reviewer — coordinated through shared context. Opinionated about roles, sequencing, and delegation; good fit for content-and-research pipelines.",
    category: "orchestration",
    pricing: "freemium",
    openSource: true,
    vendor: "crewAIInc",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#37F3FF",
    tags: ["multi-agent", "roles", "python", "open-source"],
    links: [
      { kind: "website", url: "https://crewai.com", primary: true },
      { kind: "github", url: "https://github.com/crewAIInc/crewAI" },
      { kind: "docs", url: "https://docs.crewai.com" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "n8n",
    insight:
      "Licensed 'fair-code' (Sustainable Use), not OSI open-source — self-host it freely, but reselling it as a hosted service is restricted.",
    name: "n8n",
    tagline: "Fair-code workflow automation with first-class AI nodes.",
    description:
      "Visual workflow builder bridging APIs, databases, and AI providers. Self-hostable; commercial cloud available. The default Zapier-style surface for the agentic-workflow crowd.",
    category: "orchestration",
    pricing: "freemium",
    deployment: "hybrid",
    vendor: "n8n",
    platforms: ["web", "api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FF060A",
    tags: ["workflow", "automation", "visual", "self-hosted", "open-source"],
    links: [
      { kind: "website", url: "https://n8n.io", primary: true },
      { kind: "github", url: "https://github.com/n8n-io/n8n" },
      { kind: "docs", url: "https://docs.n8n.io" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "vercel-ai-sdk",
    insight:
      "Its streaming React hooks (useChat) are why so many AI chat UIs feel identical — swapping providers is a one-line change.",
    name: "Vercel AI SDK",
    tagline: "TypeScript SDK for streaming, tool-calling, and structured outputs.",
    description:
      "Vercel's batteries-included TypeScript framework for LLM-powered apps. Streaming primitives, structured outputs, tool calling, and React hooks for chat UIs — works with every major provider out of the box.",
    category: "orchestration",
    pricing: "free",
    openSource: true,
    vendor: "Vercel",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#E8F1F8",
    tags: ["typescript", "streaming", "tool-use", "structured-output"],
    links: [
      { kind: "website", url: "https://sdk.vercel.ai", primary: true },
      { kind: "github", url: "https://github.com/vercel/ai" },
      { kind: "docs", url: "https://sdk.vercel.ai/docs" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "inngest",
    insight:
      "Gives you durable, resumable functions — retries, sleeps, fan-out — without standing up a queue or worker pool yourself.",
    name: "Inngest",
    tagline: "Durable workflow engine for AI background jobs.",
    description:
      "Event-driven, durable execution engine — pause/resume, retries, fan-out, scheduling — designed for long-running AI jobs that can't sit in a request/response cycle. TypeScript-first; framework-agnostic.",
    category: "orchestration",
    pricing: "freemium",
    deployment: "hybrid",
    vendor: "Inngest",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FBBF24",
    tags: ["durable", "workflow", "background-jobs", "typescript"],
    links: [
      { kind: "website", url: "https://inngest.com", primary: true },
      { kind: "github", url: "https://github.com/inngest/inngest" },
      { kind: "docs", url: "https://www.inngest.com/docs" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Vector DB ──────────────────────────────────────────────────────────
  {
    slug: "pinecone",
    insight:
      "Fully managed with no self-host option — the trade-off for the serverless pricing it popularized in the vector-DB space.",
    name: "Pinecone",
    tagline: "Managed vector database. The industry-default serverless option.",
    description:
      "Fully-managed vector DB built for production RAG and semantic search at scale. Serverless pricing, low-latency reads, integrations across every framework. Most Blokz-adjacent AI teams reach for it first.",
    category: "vector-db",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "Pinecone",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#37F3FF",
    tags: ["managed", "serverless", "rag", "semantic-search"],
    links: [
      { kind: "website", url: "https://www.pinecone.io", primary: true },
      { kind: "docs", url: "https://docs.pinecone.io" },
      { kind: "pricing", url: "https://www.pinecone.io/pricing/" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "weaviate",
    insight:
      "Embeds text inline so you can skip a separate vectorizer step, and does hybrid BM25 + vector search out of the box.",
    name: "Weaviate",
    tagline: "Open-source vector database with built-in vectorisers.",
    description:
      "Cloud-native vector DB that can compute embeddings inline — pass raw text in, store vectors out. Strong hybrid (BM25 + vector) search; self-hostable or managed.",
    category: "vector-db",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Weaviate",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#5EEAD4",
    tags: ["open-source", "self-hosted", "hybrid-search", "rag"],
    links: [
      { kind: "website", url: "https://weaviate.io", primary: true },
      { kind: "github", url: "https://github.com/weaviate/weaviate" },
      { kind: "docs", url: "https://weaviate.io/developers/weaviate" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "qdrant",
    insight:
      "Written in Rust and ships as a single self-hostable binary — its payload filtering is why teams pick it for metadata-heavy search.",
    name: "Qdrant",
    tagline: "Open-source, Rust-based vector DB. Fast, predictable, self-hostable.",
    description:
      "Vector database written in Rust with a strong focus on filtering, payloads, and predictable latency at scale. Self-host on a single binary or use the managed cloud.",
    category: "vector-db",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Qdrant",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#D97757",
    tags: ["open-source", "rust", "self-hosted", "fast"],
    links: [
      { kind: "website", url: "https://qdrant.tech", primary: true },
      { kind: "github", url: "https://github.com/qdrant/qdrant" },
      { kind: "docs", url: "https://qdrant.tech/documentation/" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "chroma",
    insight:
      "Runs embedded inside your Python process — the lowest-friction way to prototype RAG before you need a server at all.",
    name: "Chroma",
    tagline: "Embedded vector DB. Pip-install, prototype, scale later.",
    description:
      "The low-friction starting point — Chroma runs embedded inside your Python process or as a hosted service. Great for prototypes and small-to-medium RAG apps; upgrade to a managed option when you outgrow it.",
    category: "vector-db",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Chroma",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FBBF24",
    tags: ["open-source", "embedded", "prototype", "python"],
    links: [
      { kind: "website", url: "https://trychroma.com", primary: true },
      { kind: "github", url: "https://github.com/chroma-core/chroma" },
      { kind: "docs", url: "https://docs.trychroma.com" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "pgvector",
    insight:
      "Keeps embeddings in the same Postgres as your relational data, so you can JOIN against them and back everything up together.",
    name: "pgvector",
    tagline: "Vector similarity search inside Postgres. The pragmatic default.",
    description:
      "Postgres extension that adds a vector type plus exact and approximate nearest-neighbour search. Pairs naturally with Supabase, Neon, and any managed Postgres. The lowest-friction RAG backend if you already run Postgres.",
    category: "vector-db",
    pricing: "free",
    openSource: true,
    deployment: "self-host",
    vendor: "pgvector community",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#3ECF8E",
    tags: ["postgres", "open-source", "extension", "rag"],
    links: [
      { kind: "github", url: "https://github.com/pgvector/pgvector", primary: true },
      { kind: "docs", url: "https://github.com/pgvector/pgvector#getting-started" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "turbopuffer",
    insight:
      "Stores indexes on object storage instead of RAM, so cost tracks usage not corpus size — Notion runs it in production.",
    name: "Turbopuffer",
    tagline: "Object-storage-backed vector DB. Serverless economics at scale.",
    description:
      "Bills like S3 — cold rest, warm reads, no per-namespace minimums. Designed for very-large, mostly-cold vector workloads where you can't justify keeping every index in RAM. Operated by Notion in production.",
    category: "vector-db",
    pricing: "paid",
    deployment: "cloud",
    vendor: "Turbopuffer",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["serverless", "object-storage", "cold-storage", "scale"],
    links: [
      { kind: "website", url: "https://turbopuffer.com", primary: true },
      { kind: "docs", url: "https://turbopuffer.com/docs" },
      { kind: "pricing", url: "https://turbopuffer.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Voice ──────────────────────────────────────────────────────────────
  {
    slug: "elevenlabs",
    insight:
      "Set the bar for voice cloning — a usable clone from seconds of reference audio — which is how it became the default TTS.",
    name: "ElevenLabs",
    tagline: "Frontier TTS, voice cloning, and dubbing. Industry default.",
    description:
      "Hosted speech synthesis at near-human quality — TTS, voice cloning, multilingual dubbing, and conversational voice agents. Default choice when you need a voice that sounds like a person, not a robot.",
    category: "voice",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "ElevenLabs",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary voice models. Not user-configurable.",
    },
    accentColor: "#E8F1F8",
    tags: ["tts", "voice-cloning", "dubbing", "multilingual"],
    links: [
      { kind: "website", url: "https://elevenlabs.io", primary: true },
      { kind: "docs", url: "https://elevenlabs.io/docs" },
      { kind: "pricing", url: "https://elevenlabs.io/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "vapi",
    insight:
      "Solves the hard parts of phone agents — telephony and barge-in interrupts — leaving you to pick the STT, LLM, and TTS layers.",
    name: "Vapi",
    tagline: "Voice agent infrastructure. Build a phone-agent in a weekend.",
    description:
      "Production voice-agent platform — telephony, STT, LLM, TTS, and interrupt handling stitched together so you call an endpoint and get a working phone agent. Pluggable models at every layer.",
    category: "voice",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Vapi",
    platforms: ["api", "web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini", "ElevenLabs", "Deepgram"],
      notes: "Compose your own STT + LLM + TTS stack.",
    },
    accentColor: "#5EEAD4",
    tags: ["voice-agents", "telephony", "phone", "real-time"],
    links: [
      { kind: "website", url: "https://vapi.ai", primary: true },
      { kind: "docs", url: "https://docs.vapi.ai" },
      { kind: "pricing", url: "https://vapi.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "cartesia",
    insight:
      "Its Sonic voices run on state-space models rather than transformers — the architectural reason it hits sub-100ms first audio.",
    name: "Cartesia",
    tagline: "Low-latency streaming TTS. Sub-100ms first audio.",
    description:
      "Streaming-first speech synthesis built around the Sonic family of state-space models. Aims at real-time agent voices where latency between turns is the product. Strong choice for sub-200ms voice loops.",
    category: "voice",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Cartesia",
    platforms: ["api"],
    modelSupport: {
      kind: "single-model",
      notes: "Sonic-family proprietary models.",
    },
    accentColor: "#37F3FF",
    tags: ["tts", "streaming", "low-latency", "real-time"],
    links: [
      { kind: "website", url: "https://cartesia.ai", primary: true },
      { kind: "docs", url: "https://docs.cartesia.ai" },
      { kind: "pricing", url: "https://cartesia.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "deepgram",
    insight:
      "Tuned for messy real-world audio — accents, phone lines, overlapping speakers — where general transcribers tend to fall apart.",
    name: "Deepgram",
    tagline: "Production speech-to-text. The STT default for many companies.",
    description:
      "End-to-end speech recognition platform — real-time streaming, batch transcription, speaker diarization, and language detection. Strong on accented speech, telephony audio, and long-form recordings.",
    category: "voice",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Deepgram",
    platforms: ["api"],
    modelSupport: {
      kind: "single-model",
      notes: "Nova family proprietary models.",
    },
    accentColor: "#08D9D6",
    tags: ["stt", "transcription", "streaming", "diarization"],
    links: [
      { kind: "website", url: "https://deepgram.com", primary: true },
      { kind: "docs", url: "https://developers.deepgram.com" },
      { kind: "pricing", url: "https://deepgram.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Vision ─────────────────────────────────────────────────────────────
  {
    slug: "roboflow",
    insight:
      "For when the answer is a small custom vision model, not a multimodal LLM — it owns the annotate-train-deploy loop end to end.",
    name: "Roboflow",
    tagline: "Vision MLOps end-to-end. Annotate, train, deploy.",
    description:
      "Annotation tooling, auto-labelling, hosted training, and edge deployment for computer-vision projects. Strong default when you're shipping a custom vision model rather than reaching for a multimodal LLM.",
    category: "vision",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Roboflow",
    platforms: ["web", "api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["annotation", "training", "deployment", "edge"],
    links: [
      { kind: "website", url: "https://roboflow.com", primary: true },
      { kind: "docs", url: "https://docs.roboflow.com" },
      { kind: "pricing", url: "https://roboflow.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "landing-ai",
    insight:
      "From Andrew Ng's lab — its 'visual prompting' lets you point at a few examples instead of labeling a full training set.",
    name: "LandingAI",
    tagline: "Visual prompting + vision agents from Andrew Ng's lab.",
    description:
      "Build vision applications with a labelling-light workflow — point at examples, get a deployable detector. Recently extended into vision agents that reason over images and PDFs without bespoke training.",
    category: "vision",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "LandingAI",
    platforms: ["web", "api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FBBF24",
    tags: ["visual-prompting", "agents", "document-ai", "no-code"],
    links: [
      { kind: "website", url: "https://landing.ai", primary: true },
      { kind: "docs", url: "https://landing.ai/docs" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "voxel51",
    insight:
      "FiftyOne's superpower is surfacing the bad labels and failure cases hiding in a vision dataset — debugging data, not just models.",
    name: "Voxel51",
    tagline: "FiftyOne — open-source vision data platform.",
    description:
      "Open-source toolkit for exploring, debugging, and curating vision datasets. Strong story for finding model failure modes, balancing classes, and tracking experiment drift across visual data at scale.",
    category: "vision",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Voxel51",
    platforms: ["api", "macos", "windows", "linux"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FF060A",
    tags: ["open-source", "datasets", "evaluation", "python"],
    links: [
      { kind: "website", url: "https://voxel51.com", primary: true },
      { kind: "github", url: "https://github.com/voxel51/fiftyone" },
      { kind: "docs", url: "https://docs.voxel51.com" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Image gen ──────────────────────────────────────────────────────────
  {
    slug: "midjourney",
    insight:
      "Ran Discord-only for years before shipping a web app — its opinionated house aesthetic is the trade-off for less fine control.",
    name: "Midjourney",
    tagline: "The brand-name image generator. Discord-native, web app available.",
    description:
      "Hosted image generation that defined the category. Strong aesthetic defaults, style references, and rich prompt-control vocabulary. Used by designers, illustrators, and prompt artists worldwide.",
    category: "image-gen",
    pricing: "paid",
    deployment: "cloud",
    featured: true,
    vendor: "Midjourney",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary V-series models, not user-configurable.",
    },
    accentColor: "#5EEAD4",
    tags: ["image-gen", "design", "illustration", "style-reference"],
    links: [
      { kind: "website", url: "https://www.midjourney.com", primary: true },
      { kind: "docs", url: "https://docs.midjourney.com" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "ideogram",
    insight:
      "The one to reach for when the image needs legible text — readable typography inside generations is its whole differentiator.",
    name: "Ideogram",
    tagline: "Image gen with the best text-in-image quality.",
    description:
      "Hosted image generator with industry-leading typography rendering — actually readable text inside images. Strong for logos, posters, social cards, and any composition where letterforms matter.",
    category: "image-gen",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Ideogram",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary image models, not user-configurable.",
    },
    accentColor: "#FBBF24",
    tags: ["image-gen", "typography", "posters", "logos"],
    links: [
      { kind: "website", url: "https://ideogram.ai", primary: true },
      { kind: "docs", url: "https://developer.ideogram.ai" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "krea",
    insight:
      "Fronts several engines (Flux, Imagen, Sora) on one real-time canvas, built to refine a single image rather than re-roll prompts.",
    name: "Krea",
    tagline: "Design-loop image surface. Generate, edit, upscale, iterate.",
    description:
      "Multi-model creative canvas — image generation, real-time edits, upscaling, and style transfer chained together. Strong for fast iteration on a single image rather than rolling fresh prompts.",
    category: "image-gen",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Krea AI",
    platforms: ["web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Flux", "Imagen", "Ideogram", "Sora"],
      notes: "Combines multiple providers behind one canvas.",
    },
    accentColor: "#37F3FF",
    tags: ["image-gen", "editing", "upscaling", "design"],
    links: [
      { kind: "website", url: "https://www.krea.ai", primary: true },
      { kind: "pricing", url: "https://www.krea.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "magnific",
    insight:
      "Doesn't just sharpen — it invents plausible new detail on upscale, the magic for concept art and the caveat for real photos.",
    name: "Magnific",
    tagline: "AI upscaling + relighting that goes beyond pixel-doubling.",
    description:
      "Upscales images while reimagining detail — adds plausible texture, lighting, and structure rather than just sharpening. Broke through with the 'AI photography' workflow for product shots and concept art.",
    category: "image-gen",
    pricing: "paid",
    deployment: "cloud",
    vendor: "Magnific AI",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary upscaling pipeline.",
    },
    accentColor: "#A78BFA",
    tags: ["upscaling", "enhancement", "relighting", "photography"],
    links: [
      { kind: "website", url: "https://magnific.ai", primary: true },
      { kind: "pricing", url: "https://magnific.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Video ──────────────────────────────────────────────────────────────
  {
    slug: "runway",
    insight:
      "The elder of the space — it pairs its Gen models with an actual timeline editor, which is why client work tends to land here.",
    name: "Runway",
    tagline: "Professional video AI. Gen-series models + a full editor.",
    description:
      "End-to-end video AI platform — text-to-video, image-to-video, in-painting, motion brush, and a timeline editor. Longest-running studio in the space; default choice when the output ships to clients.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "Runway",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      notes: "Gen-series proprietary video models.",
    },
    accentColor: "#08D9D6",
    tags: ["video-gen", "editing", "motion", "film"],
    links: [
      { kind: "website", url: "https://runwayml.com", primary: true },
      { kind: "docs", url: "https://docs.dev.runwayml.com" },
      { kind: "pricing", url: "https://runwayml.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "sora",
    insight:
      "OpenAI shipped it as a social app with a feed and remixing — consumer-first, unlike the API-first video tools around it.",
    name: "Sora",
    tagline: "OpenAI's video generator as a standalone app.",
    description:
      "OpenAI's video model surfaced as a consumer product — generate, remix, and share short videos from prompts or images. Available standalone and bundled into ChatGPT for subscribers.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "OpenAI",
    platforms: ["web", "ios"],
    modelSupport: {
      kind: "single-model",
      notes: "Sora family models, not user-configurable.",
    },
    accentColor: "#E8F1F8",
    tags: ["video-gen", "consumer", "social"],
    links: [
      { kind: "website", url: "https://sora.com", primary: true },
      { kind: "docs", url: "https://help.openai.com/en/collections/11627661-sora" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "luma-dream-machine",
    insight:
      "Mobile-first with keyframe controls — the indie creator's pick before a project graduates to Runway's heavier toolkit.",
    name: "Luma Dream Machine",
    tagline: "Mainstream-quality video generation. Indie creator default.",
    description:
      "Luma Labs' video model surfaced as an iOS app and web tool. Strong text-to-video, image-to-video, and keyframe controls — the indie creator's go-to before reaching for Runway's heavier toolkit.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Luma AI",
    platforms: ["web", "ios"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary Dream Machine models.",
    },
    accentColor: "#A78BFA",
    tags: ["video-gen", "image-to-video", "keyframes", "mobile"],
    links: [
      { kind: "website", url: "https://lumalabs.ai/dream-machine", primary: true },
      { kind: "docs", url: "https://docs.lumalabs.ai" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "heygen",
    insight:
      "Its translation + lip-sync, not the avatars, is what sells it to teams localizing one video into dozens of languages.",
    name: "HeyGen",
    tagline: "Avatar video at scale. Talking-head clips from a script.",
    description:
      "AI avatar platform for B2B content — generate a presenter from a photo, give them a script, get a finished video with lip-sync, voiceover, and translation. Used heavily in marketing and corporate training.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "HeyGen",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary avatar + lip-sync pipeline.",
    },
    accentColor: "#3ECF8E",
    tags: ["avatars", "talking-head", "translation", "b2b-content"],
    links: [
      { kind: "website", url: "https://www.heygen.com", primary: true },
      { kind: "docs", url: "https://docs.heygen.com" },
      { kind: "pricing", url: "https://www.heygen.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Audio ──────────────────────────────────────────────────────────────
  {
    slug: "suno",
    insight:
      "Generates real vocals and song structure, not just backing loops — and it's one of the few generative-audio tools with native mobile apps.",
    name: "Suno",
    tagline: "Full songs from a prompt. Vocals, instruments, structure.",
    description:
      "Hosted music generation with vocal performances, instrument arrangement, and song structure baked in. Type a description or upload a hook, get a finished track. Defined the prompt-to-song category.",
    category: "audio",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "Suno",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary music model.",
    },
    accentColor: "#FF060A",
    tags: ["music-gen", "vocals", "song-structure"],
    links: [
      { kind: "website", url: "https://suno.com", primary: true },
      { kind: "docs", url: "https://help.suno.com" },
      { kind: "pricing", url: "https://suno.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "udio",
    insight:
      "The other half of the music-gen duopoly — producers often run the same hook through both it and Suno and keep the better take.",
    name: "Udio",
    tagline: "AI music generation. The Suno alternative.",
    description:
      "Hosted full-song generation focused on production-quality output and finer style control. The other half of the AI music duopoly — many producers run prompts through both Suno and Udio.",
    category: "audio",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Udio",
    platforms: ["web", "ios"],
    modelSupport: {
      kind: "single-model",
      notes: "Proprietary music model.",
    },
    accentColor: "#37F3FF",
    tags: ["music-gen", "production", "vocals"],
    links: [
      { kind: "website", url: "https://www.udio.com", primary: true },
      { kind: "pricing", url: "https://www.udio.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "descript",
    insight:
      "Edit the transcript and the audio cuts to match — deleting a filler word is as easy as backspacing it in a document.",
    name: "Descript",
    tagline: "Podcast + audio editing where the transcript is the timeline.",
    description:
      "Audio and video editing built around an editable transcript — cut words, get cut audio. Add AI cleanup, overdub voice clones, and screen-recording for podcasts and tutorials in one tool.",
    category: "audio",
    pricing: "freemium",
    deployment: "local",
    vendor: "Descript",
    platforms: ["macos", "windows", "web"],
    modelSupport: {
      kind: "multi-model",
      notes: "Pluggable STT + voice-cloning providers.",
    },
    accentColor: "#5EEAD4",
    tags: ["editing", "podcasts", "transcript", "voice-clone"],
    links: [
      { kind: "website", url: "https://www.descript.com", primary: true },
      { kind: "docs", url: "https://help.descript.com" },
      { kind: "pricing", url: "https://www.descript.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Search ─────────────────────────────────────────────────────────────
  {
    slug: "perplexity",
    insight:
      "Its Sonar API exposes the same cited-search engine to your own app — so it's an answer product and a retrieval backend at once.",
    name: "Perplexity",
    tagline: "AI-augmented search. Cited answers, consumer + Sonar API.",
    description:
      "Hybrid search engine that returns synthesized answers with inline citations rather than a list of links. Ships a consumer product and the Sonar API for adding cited search to your own apps and agents.",
    category: "search",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "Perplexity AI",
    platforms: ["web", "ios", "android", "macos", "windows", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini", "Sonar"],
      notes: "Pro users select a model per query; Sonar API exposes the search layer.",
    },
    accentColor: "#37F3FF",
    tags: ["search", "citations", "consumer", "api"],
    links: [
      { kind: "website", url: "https://www.perplexity.ai", primary: true },
      { kind: "docs", url: "https://docs.perplexity.ai" },
      { kind: "pricing", url: "https://www.perplexity.ai/pro" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "tavily",
    insight:
      "Returns clean, scrape-ready content instead of a ranked link list — which is why it's the default search tool baked into agent frameworks.",
    name: "Tavily",
    tagline: "Search API built for AI agents. First-class in most agent frameworks.",
    description:
      "Search-as-a-tool for LLM agents — returns scrape-friendly results tuned for retrieval rather than ranking. Native integrations across LangChain, LangGraph, CrewAI, and the major agent surfaces.",
    category: "search",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Tavily",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#5EEAD4",
    tags: ["search-api", "agents", "rag", "tool-use"],
    links: [
      { kind: "website", url: "https://tavily.com", primary: true },
      { kind: "docs", url: "https://docs.tavily.com" },
      { kind: "pricing", url: "https://tavily.com/#pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "exa",
    insight:
      "Indexes the web by meaning, so 'find pages like this one' works as a query — formerly known as Metaphor.",
    name: "Exa",
    tagline: "Neural search API. Find pages by meaning, not keywords.",
    description:
      "Semantic search engine that indexes the open web with embeddings — pass a description, get matching pages. Strong for research-style queries and find-similar workflows; formerly known as Metaphor.",
    category: "search",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Exa Labs",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["semantic-search", "neural", "research", "api"],
    links: [
      { kind: "website", url: "https://exa.ai", primary: true },
      { kind: "docs", url: "https://docs.exa.ai" },
      { kind: "pricing", url: "https://exa.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "brave-search-api",
    insight:
      "One of the few search APIs backed by a genuinely independent crawl, not resold Bing or Google results.",
    name: "Brave Search API",
    tagline: "Independent search index. Privacy-respecting, non-Google.",
    description:
      "API access to Brave's independently-crawled search index. Useful when you need a non-Google source, want to dodge upstream rate limits, or have privacy posture requirements that rule out scraping competitors.",
    category: "search",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Brave Software",
    platforms: ["api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FF060A",
    tags: ["search-api", "independent-index", "privacy"],
    links: [
      { kind: "website", url: "https://brave.com/search/api/", primary: true },
      { kind: "docs", url: "https://api.search.brave.com/app/documentation" },
      { kind: "pricing", url: "https://brave.com/search/api/" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Observability ──────────────────────────────────────────────────────
  {
    slug: "helicone",
    insight:
      "Integrate by changing one base-URL line — no SDK wrapper — and it's open-source, so you can self-host the proxy.",
    name: "Helicone",
    tagline: "Drop-in LLM proxy with logging, caching, and cost tracking.",
    description:
      "One-line integration — change your OpenAI/Anthropic base URL and get a dashboard with every prompt, response, latency, and dollar tracked. Adds caching and rate-limit handling without code changes.",
    category: "observability",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Helicone",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FBBF24",
    tags: ["proxy", "logging", "caching", "cost-tracking"],
    links: [
      { kind: "website", url: "https://www.helicone.ai", primary: true },
      { kind: "github", url: "https://github.com/Helicone/helicone" },
      { kind: "docs", url: "https://docs.helicone.ai" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "langfuse",
    insight:
      "The self-hostable, OpenTelemetry-native answer to LangSmith — pick it when observability data has to stay on your own infra.",
    name: "Langfuse",
    tagline: "Open-source LLM observability. Self-hostable, OpenTelemetry-native.",
    description:
      "Tracing, evals, prompt management, and dataset tooling for LLM apps — self-host on your own infra or use Langfuse Cloud. The open-source default when you want full ownership of your observability stack.",
    category: "observability",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Langfuse",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#5EEAD4",
    tags: ["open-source", "tracing", "evals", "self-hosted"],
    links: [
      { kind: "website", url: "https://langfuse.com", primary: true },
      { kind: "github", url: "https://github.com/langfuse/langfuse" },
      { kind: "docs", url: "https://langfuse.com/docs" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "langsmith",
    insight:
      "Despite the name it works without LangChain in your stack — but it's cloud-only, where Langfuse lets you self-host.",
    name: "LangSmith",
    tagline: "LangChain's hosted observability + eval platform.",
    description:
      "Tracing, dataset management, eval orchestration, and prompt playground from the LangChain team. Pairs naturally if LangChain or LangGraph already runs in your stack, but works standalone via SDKs.",
    category: "observability",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "LangChain",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#08D9D6",
    tags: ["tracing", "evals", "datasets", "langchain"],
    links: [
      { kind: "website", url: "https://smith.langchain.com", primary: true },
      { kind: "docs", url: "https://docs.smith.langchain.com" },
      { kind: "pricing", url: "https://www.langchain.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "arize-phoenix",
    insight:
      "Spins up inside a Jupyter notebook and is sharpest at RAG debugging — finding the bad chunk that poisoned a retrieval.",
    name: "Arize Phoenix",
    tagline: "Open-source LLM tracing + evaluation. Strong on retrieval debugging.",
    description:
      "Phoenix is Arize's open-source observability — run locally in a notebook or as a service. Especially strong for inspecting RAG pipelines, finding bad chunks, and tracking retrieval quality over time.",
    category: "observability",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Arize AI",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["open-source", "tracing", "rag", "retrieval-debugging"],
    links: [
      { kind: "website", url: "https://arize.com/phoenix/", primary: true },
      { kind: "github", url: "https://github.com/Arize-ai/phoenix" },
      { kind: "docs", url: "https://docs.arize.com/phoenix" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Fine-tuning ────────────────────────────────────────────────────────
  {
    slug: "together-ai",
    insight:
      "Hosts hundreds of open-weights models and does both LoRA and full fine-tuning — a one-stop shop for the open-model side of the stack.",
    name: "Together AI",
    tagline: "Fine-tuning + inference for open-weights models. Broad coverage.",
    description:
      "Hosted inference and fine-tuning across hundreds of open-weights models (Llama, Mistral, DeepSeek, Qwen, etc.). Strong pricing for inference-at-scale; LoRA + full fine-tuning supported.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Together",
    platforms: ["api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Mistral", "DeepSeek", "Qwen"],
    },
    accentColor: "#3ECF8E",
    tags: ["inference", "fine-tuning", "open-weights", "lora"],
    links: [
      { kind: "website", url: "https://www.together.ai", primary: true },
      { kind: "docs", url: "https://docs.together.ai" },
      { kind: "pricing", url: "https://www.together.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "modal",
    insight:
      "You define GPU infra in Python decorators, not YAML or Dockerfiles — its fast cold starts make per-job GPU billing practical.",
    name: "Modal",
    tagline: "Serverless GPUs. Run training, inference, batch jobs from Python.",
    description:
      "Define cloud workloads in Python, deploy with one command — GPU access on demand, fast cold starts, fair-share pricing. The default 'I need to fine-tune a model from a Jupyter cell' platform.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Modal Labs",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#37F3FF",
    tags: ["gpu", "serverless", "python", "training"],
    links: [
      { kind: "website", url: "https://modal.com", primary: true },
      { kind: "docs", url: "https://modal.com/docs" },
      { kind: "pricing", url: "https://modal.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "openpipe",
    insight:
      "Distills your own logged GPT/Claude calls into a fine-tuned small model, then serves the swap behind your existing SDK.",
    name: "OpenPipe",
    tagline: "Replace frontier-model spend with a fine-tuned small model.",
    description:
      "Captures your production OpenAI / Anthropic calls, builds a dataset, fine-tunes a small open-weights model on your traffic, then serves the swap behind your existing SDK. The pitch: 10x cost reduction at parity.",
    category: "fine-tuning",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "OpenPipe",
    platforms: ["api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Mistral", "Qwen"],
    },
    accentColor: "#FBBF24",
    tags: ["fine-tuning", "cost-reduction", "drop-in", "open-weights"],
    links: [
      { kind: "website", url: "https://openpipe.ai", primary: true },
      { kind: "docs", url: "https://docs.openpipe.ai" },
      { kind: "pricing", url: "https://openpipe.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "fireworks-ai",
    insight:
      "Runs open models on its own FireAttention serving stack for low latency, and covers vision and audio models, not just text.",
    name: "Fireworks AI",
    tagline: "Fast inference + fine-tuning. Production deployments at scale.",
    description:
      "Optimized inference platform for open-weights models with strong latency numbers and serverless + dedicated deployment options. Fine-tuning supported; vision and audio models alongside text.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Fireworks AI",
    platforms: ["api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Mistral", "Qwen", "DeepSeek"],
    },
    accentColor: "#FF060A",
    tags: ["inference", "fine-tuning", "low-latency", "production"],
    links: [
      { kind: "website", url: "https://fireworks.ai", primary: true },
      { kind: "docs", url: "https://docs.fireworks.ai" },
      { kind: "pricing", url: "https://fireworks.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Browser extension ──────────────────────────────────────────────────
  {
    slug: "sider",
    insight:
      "One subscription puts Claude, GPT, and Gemini in a side-panel on any tab — among the most-installed of the browser AI assistants.",
    name: "Sider",
    tagline: "Multi-model AI side-panel for any browser tab.",
    description:
      "Browser extension that drops a Claude / GPT / Gemini panel onto any page — summarize the article, chat with the PDF, translate the YouTube transcript. Pluggable across providers in one subscription.",
    category: "browser-extension",
    pricing: "freemium",
    vendor: "Sider AI",
    platforms: ["browser-extension"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini", "DeepSeek"],
    },
    accentColor: "#A78BFA",
    tags: ["browser", "side-panel", "multi-model", "summarize"],
    links: [
      { kind: "website", url: "https://sider.ai", primary: true },
      { kind: "pricing", url: "https://sider.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "maxai",
    insight:
      "Occupies the same niche as Sider — its edge is saved prompt templates and one-click quick actions baked into the sidebar.",
    name: "MaxAI",
    tagline: "All-in-one in-browser AI assistant. Multi-model.",
    description:
      "Same shape as Sider — multi-model AI sidebar that follows you across the web. Strong on quick actions (summarise, rewrite, translate) and saved prompt templates.",
    category: "browser-extension",
    pricing: "freemium",
    vendor: "MaxAI.me",
    platforms: ["browser-extension"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini"],
    },
    accentColor: "#08D9D6",
    tags: ["browser", "sidebar", "multi-model", "quick-actions"],
    links: [
      { kind: "website", url: "https://www.maxai.me", primary: true },
      { kind: "pricing", url: "https://www.maxai.me/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "glasp",
    insight:
      "Built on a social highlight network, but BYO-key means your reading history stays yours rather than feeding a vendor.",
    name: "Glasp",
    tagline: "Highlight, summarise, and chat with anything you read on the web.",
    description:
      "Web-highlighter + AI extension. Save passages from any page, then ask AI for summaries, related ideas, or chat across your knowledge base. BYO key keeps your reading history private.",
    category: "browser-extension",
    pricing: "freemium",
    vendor: "Glasp",
    platforms: ["browser-extension", "web"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT"],
    },
    accentColor: "#FBBF24",
    tags: ["highlights", "read-later", "summarize", "byo-key"],
    links: [
      { kind: "website", url: "https://glasp.co", primary: true },
      { kind: "docs", url: "https://help.glasp.co" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Automation ─────────────────────────────────────────────────────────
  {
    slug: "zapier",
    insight:
      "Its moat is breadth — thousands of app integrations — with AI agents bolted on top, not the other way around.",
    name: "Zapier",
    tagline: "The ubiquitous low-code automation tool. Native AI features.",
    description:
      "Connects thousands of apps with no-code triggers and actions. Recent AI features include in-workflow LLM calls, AI agents, and chatbots. The default reach-for when you need to glue two SaaS tools together.",
    category: "automation",
    pricing: "freemium",
    deployment: "cloud",
    featured: true,
    vendor: "Zapier",
    platforms: ["web", "api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#FF060A",
    tags: ["no-code", "integrations", "agents", "chatbots"],
    links: [
      { kind: "website", url: "https://zapier.com", primary: true },
      { kind: "docs", url: "https://help.zapier.com" },
      { kind: "pricing", url: "https://zapier.com/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "make",
    insight:
      "The rebranded Integromat — its visual canvas handles the branching and loops that Zapier's linear steps struggle with.",
    name: "Make",
    tagline: "Visual-canvas automation. The Integromat folks went big on AI nodes.",
    description:
      "Drag-and-drop scenario builder with first-class AI provider nodes. More expressive than Zapier for complex routing and conditional logic; favoured when your automation has branches and loops.",
    category: "automation",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Make",
    platforms: ["web", "api"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#A78BFA",
    tags: ["no-code", "visual", "branching", "integrations"],
    links: [
      { kind: "website", url: "https://www.make.com", primary: true },
      { kind: "docs", url: "https://www.make.com/en/help" },
      { kind: "pricing", url: "https://www.make.com/en/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },
  {
    slug: "lindy",
    insight:
      "Trades Zapier's one-shot triggers for agents that sit waiting on an inbox or calendar, then act with some judgment.",
    name: "Lindy",
    tagline: "Agentic automation. Long-running agents instead of one-shot triggers.",
    description:
      "Builds AI agents that wait for emails, calendar invites, or webhooks — then take multi-step actions on your behalf. The 'agentic Zapier' pitch; strong for ops workflows that need judgement, not just routing.",
    category: "automation",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Lindy AI",
    platforms: ["web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT"],
    },
    accentColor: "#37F3FF",
    tags: ["agents", "automation", "email", "no-code"],
    links: [
      { kind: "website", url: "https://www.lindy.ai", primary: true },
      { kind: "pricing", url: "https://www.lindy.ai/pricing" },
    ],
    addedAt: "2026-05-13",
    lastVerifiedAt: "2026-06-01",
  },

  // ── Batch: assistants + creative (video / image / 3d) + research, 2026-06-06.
  // Web-verified sweep; see /add-app + docs/directory-playbook.md for the flow.

  // ── Assistants (general chat / multimodal) ──
  {
    slug: "chatgpt",
    insight:
      "The app that mainstreamed generative AI — its custom-GPT store turned a chatbot into a third-party app platform.",
    name: "ChatGPT",
    tagline: "The default AI assistant. Chat, voice, vision, and a tool ecosystem.",
    description:
      "OpenAI's consumer assistant — multimodal chat with voice, image input, web browsing, code, and custom GPTs. The product that put generative AI in everyone's hands.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "OpenAI",
    platforms: ["web", "ios", "android", "macos", "windows"],
    modelSupport: {
      kind: "single-model",
      models: ["GPT-5", "GPT-4o"],
      notes: "OpenAI's own GPT models.",
    },
    accentColor: "#10A37F",
    featured: true,
    tags: ["chat", "assistant", "multimodal", "voice"],
    links: [
      { kind: "website", url: "https://chatgpt.com", primary: true },
      { kind: "pricing", url: "https://openai.com/chatgpt/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "claude",
    insight:
      "Introduced both Artifacts and the MCP standard that this directory's tooling now runs on — the consumer sibling of Claude Code.",
    name: "Claude",
    tagline: "Anthropic's assistant. Thoughtful, long-context, strong at code + writing.",
    description:
      "The Claude consumer app — chat with Projects, artifacts, file analysis, and MCP connectors. Known for careful reasoning, large context, and being a strong writing + coding partner.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Anthropic",
    platforms: ["web", "ios", "android", "macos", "windows"],
    modelSupport: {
      kind: "single-model",
      models: ["Claude Opus", "Claude Sonnet", "Claude Haiku"],
      notes: "Anthropic's Claude models.",
    },
    accentColor: "#D97757",
    tags: ["chat", "assistant", "writing", "coding", "mcp"],
    links: [
      { kind: "website", url: "https://claude.ai", primary: true },
      { kind: "pricing", url: "https://www.anthropic.com/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "gemini",
    insight:
      "Its edge is distribution — wired into Search, Gmail, Docs, and Android — alongside among the largest context windows shipping.",
    name: "Gemini",
    tagline: "Google's assistant, wired into Search, Workspace, and Android.",
    description:
      "Google's multimodal assistant — chat, image generation, deep research, and tight integration across Gmail, Docs, and Android. Backed by the Gemini model family.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Google",
    platforms: ["web", "ios", "android"],
    modelSupport: { kind: "single-model", models: ["Gemini"], notes: "Google's Gemini models." },
    accentColor: "#4285F4",
    tags: ["chat", "assistant", "multimodal", "google"],
    links: [{ kind: "website", url: "https://gemini.google.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "grok",
    insight:
      "Its real-time access to the X firehose is something no rival assistant has — at the cost of a deliberately less-filtered voice.",
    name: "Grok",
    tagline: "xAI's assistant with real-time X access and a less-filtered voice.",
    description:
      "xAI's assistant — chat, image generation, and real-time knowledge pulled from X. Positioned as witty and current, with deep integration into the X platform.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "xAI",
    platforms: ["web", "ios", "android"],
    modelSupport: { kind: "single-model", models: ["Grok"], notes: "xAI's Grok models." },
    accentColor: "#E8F1F8",
    tags: ["chat", "assistant", "real-time", "x"],
    links: [{ kind: "website", url: "https://grok.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "kimi",
    insight:
      "Uniquely for a polished consumer assistant, its underlying Kimi K2 model ships as open weights you can self-host.",
    name: "Kimi",
    tagline: "Moonshot's assistant — long-context chat, deep research, and agents.",
    description:
      "Moonshot AI's assistant — long-context chat, Deep Research, and an agent mode (Kimi Code, parallel subagents). Built on the open-weight Kimi K2 model family.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Moonshot AI",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "single-model",
      models: ["Kimi K2"],
      notes: "Moonshot's Kimi K2 models; open weights, OpenAI-compatible API.",
    },
    accentColor: "#8B5CF6",
    tags: ["chat", "assistant", "long-context", "agents", "research"],
    links: [{ kind: "website", url: "https://kimi.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "le-chat",
    insight:
      "Europe's home-grown assistant — EU data residency and Mistral's own partly-open-weight models, with a speed focus.",
    name: "Le Chat",
    tagline: "Mistral's fast, European assistant with web search and code.",
    description:
      "Mistral AI's assistant — chat with web search, document analysis, image generation, and code. Fast, privacy-minded, and built on Mistral's own open and frontier models.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Mistral AI",
    platforms: ["web", "ios", "android"],
    modelSupport: { kind: "single-model", models: ["Mistral"], notes: "Mistral's own models." },
    accentColor: "#FA520F",
    tags: ["chat", "assistant", "europe", "search"],
    links: [{ kind: "website", url: "https://chat.mistral.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "deepseek",
    insight:
      "Its open-weight R1 release reset the industry's price-for-reasoning curve — and the consumer app stays free to use.",
    name: "DeepSeek",
    tagline: "Open, low-cost chat with strong reasoning. Free to use.",
    description:
      "DeepSeek's assistant — chat with a reasoning mode and web search, backed by the open-weight DeepSeek models that reset the cost curve for frontier-grade quality.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "DeepSeek",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "single-model",
      models: ["DeepSeek-V3", "DeepSeek-R1"],
      notes: "DeepSeek's open-weight models.",
    },
    accentColor: "#4D6BFE",
    tags: ["chat", "assistant", "reasoning", "open-weights"],
    links: [{ kind: "website", url: "https://chat.deepseek.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "microsoft-copilot",
    insight:
      "Now blends OpenAI models with Microsoft's own in-house MAI models, and reaches users at the OS level inside Windows itself.",
    name: "Microsoft Copilot",
    tagline: "Microsoft's assistant across Windows, Edge, and Microsoft 365.",
    description:
      "Microsoft's everyday assistant — chat, image generation, and Copilot Vision, woven into Windows, Edge, and the Microsoft 365 apps. The consumer front-door to Microsoft's AI.",
    category: "assistant",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Microsoft",
    platforms: ["web", "ios", "android", "windows"],
    modelSupport: {
      kind: "single-model",
      models: ["GPT"],
      notes: "Runs on OpenAI GPT plus Microsoft's in-house models.",
    },
    accentColor: "#0A84FF",
    tags: ["chat", "assistant", "microsoft-365", "windows"],
    links: [{ kind: "website", url: "https://copilot.microsoft.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Video ──
  {
    slug: "kling",
    insight:
      "From short-video giant Kuaishou — its motion realism and multishot sequences make it the leading non-Western Sora rival.",
    name: "Kling AI",
    tagline: "State-of-the-art AI video + image, with strong motion and multishot.",
    description:
      "Kuaishou's creative studio — text- and image-to-video with convincing motion, lip-sync, and multishot sequences up to ~15s, plus image generation. A leading Runway/Sora rival.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Kuaishou",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "single-model",
      models: ["Kling"],
      notes: "Kuaishou's Kling video models.",
    },
    accentColor: "#14B8C4",
    featured: true,
    tags: ["video-gen", "image-to-video", "motion", "multishot"],
    links: [{ kind: "website", url: "https://klingai.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "google-flow",
    insight:
      "Google's filmmaking surface over Veo and Imagen — it directs continuity across shots, and has absorbed Whisk and ImageFX.",
    name: "Google Flow",
    tagline: "Google's AI filmmaking studio — Veo video + Imagen, in one canvas.",
    description:
      "Google Labs' creative studio for filmmakers — generate and stitch shots with Veo, craft keyframes with Imagen, and direct camera + scene with a Gemini-powered agent. Now folds in Whisk and ImageFX.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Google",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      models: ["Veo", "Imagen", "Gemini"],
      notes: "Powered by Google Veo (video) + Imagen (image).",
    },
    accentColor: "#4285F4",
    tags: ["video-gen", "filmmaking", "veo", "google-labs"],
    links: [{ kind: "website", url: "https://labs.google/fx/tools/flow", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "pika",
    insight:
      "Leans into playful effects (Pikaffects) over photoreal output — it competes on shareable fun, not cinematic fidelity.",
    name: "Pika",
    tagline: "Playful AI video with Pikaffects, ingredients, and quick edits.",
    description:
      "Pika Labs' video generator — text- and image-to-video with signature effects (Pikaffects), character ingredients, and fast iteration. Popular for social-native, fun clips.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Pika Labs",
    platforms: ["web", "ios"],
    modelSupport: { kind: "single-model", notes: "Pika's own video models." },
    accentColor: "#FF4D8D",
    tags: ["video-gen", "effects", "social", "image-to-video"],
    links: [{ kind: "website", url: "https://pika.art", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "higgsfield",
    insight:
      "An aggregator, not a model-maker — one subscription fronts 15+ engines (Sora, Veo, Kling) behind cinematic camera presets.",
    name: "Higgsfield",
    tagline: "Cinematic AI video with camera controls — many models, one subscription.",
    description:
      "An AI video + image studio built around cinematic camera motion and presets. Aggregates 15+ third-party models (Sora, Veo, Kling, and more) so you switch engines without switching tools.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Higgsfield AI",
    platforms: ["web", "ios"],
    modelSupport: {
      kind: "multi-model",
      models: ["Sora", "Veo", "Kling", "Seedance", "Nano Banana"],
      notes: "Aggregates 15+ third-party video/image models under one subscription.",
    },
    accentColor: "#E8F1F8",
    tags: ["video-gen", "cinematic", "camera-control", "aggregator"],
    links: [
      { kind: "website", url: "https://higgsfield.ai", primary: true },
      { kind: "pricing", url: "https://higgsfield.ai/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "synthesia",
    insight:
      "The enterprise default for talking-head training video — one typed script renders an avatar in 140+ languages.",
    name: "Synthesia",
    tagline: "AI avatar video for training, marketing, and comms. Enterprise default.",
    description:
      "Studio for AI presenter videos — pick or clone an avatar, type a script in 140+ languages, and render a talking-head video. The go-to for L&D, onboarding, and corporate comms.",
    category: "video",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Synthesia",
    platforms: ["web"],
    modelSupport: { kind: "single-model", notes: "Proprietary avatar + voice models." },
    accentColor: "#2C5BE0",
    tags: ["avatar-video", "training", "localization", "enterprise"],
    links: [
      { kind: "website", url: "https://www.synthesia.io", primary: true },
      { kind: "pricing", url: "https://www.synthesia.io/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Image generation ──
  {
    slug: "recraft",
    insight:
      "Rare among image generators in outputting true editable SVG vectors — built to drop assets straight into real design work.",
    name: "Recraft",
    tagline: "Design-grade image + vector generation with brand consistency.",
    description:
      "Image generator aimed at designers — raster and true vector (SVG) output, brand style sets, mockups, and precise control. Strong when assets need to ship into real design work.",
    category: "image-gen",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Recraft",
    platforms: ["web", "api"],
    modelSupport: { kind: "single-model", notes: "Recraft's own image models (incl. vector)." },
    accentColor: "#F87171",
    tags: ["image-gen", "vector", "design", "brand"],
    links: [{ kind: "website", url: "https://www.recraft.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "leonardo-ai",
    insight:
      "Built for consistent game-asset pipelines via custom fine-tuned models — and now owned by Canva.",
    name: "Leonardo AI",
    tagline: "Image generation with fine-tuned models, control, and game-asset focus.",
    description:
      "Image platform with custom fine-tuned models, ControlNet-style guidance, real-time canvas, and upscaling. Popular with game studios and concept artists for consistent asset pipelines.",
    category: "image-gen",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Leonardo AI",
    platforms: ["web", "ios", "android"],
    modelSupport: { kind: "single-model", notes: "Leonardo's Phoenix + fine-tuned image models." },
    accentColor: "#8B5CF6",
    tags: ["image-gen", "game-assets", "control", "upscaling"],
    links: [{ kind: "website", url: "https://leonardo.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "flux",
    insight:
      "From the team that created Stable Diffusion — it ships open weights alongside a hosted pro tier for its strongest models.",
    name: "FLUX",
    tagline: "Black Forest Labs' open image models — sharp prompt adherence.",
    description:
      "The FLUX family from Black Forest Labs — open and pro image models known for crisp detail and strong prompt following. Usable via the BFL playground, API, and across the ecosystem.",
    category: "image-gen",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Black Forest Labs",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "single-model",
      models: ["FLUX"],
      notes: "Black Forest Labs' FLUX image models (open + pro).",
    },
    accentColor: "#E8F1F8",
    tags: ["image-gen", "open-weights", "api", "flux"],
    links: [{ kind: "website", url: "https://bfl.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── 3D (new category coverage) ──
  {
    slug: "meshy",
    insight:
      "Goes past raw meshes to auto-rigging and Blender/Unity/Unreal exports — built to slot into a real game-asset pipeline.",
    name: "Meshy",
    tagline: "Text- and image-to-3D models, textures, and rigging.",
    description:
      "Generate production-ready 3D assets from text or images — meshes, PBR textures, and auto-rigging, with exports for Blender, Unity, and Unreal. A staple of the AI 3D workflow.",
    category: "3d",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Meshy",
    platforms: ["web", "api"],
    modelSupport: { kind: "single-model", notes: "Meshy's own 3D generation models." },
    accentColor: "#6366F1",
    tags: ["3d-gen", "text-to-3d", "textures", "game-assets"],
    links: [{ kind: "website", url: "https://www.meshy.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "tripo",
    insight:
      "Competes on raw speed — a usable 3D model from one image in seconds — with one of the more generous free tiers in 3D gen.",
    name: "Tripo",
    tagline: "Fast text- and image-to-3D model generation.",
    description:
      "Generate detailed 3D models from a prompt or a single image in seconds, with texturing and clean topology options. Known for speed and an accessible free tier.",
    category: "3d",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Tripo AI",
    platforms: ["web", "api"],
    modelSupport: { kind: "single-model", notes: "Tripo's 3D generation models." },
    accentColor: "#00C2A8",
    tags: ["3d-gen", "image-to-3d", "fast", "api"],
    links: [{ kind: "website", url: "https://www.tripo3d.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "spline",
    insight:
      "Primarily a collaborative 3D design tool for interactive web scenes — AI generation is an accelerator bolted onto a real editor.",
    name: "Spline",
    tagline: "Collaborative 3D design in the browser, with AI generation.",
    description:
      "A browser-based 3D design tool for interactive scenes and web experiences, with Spline AI for generating objects, textures, and animations from prompts. Popular for product and web 3D.",
    category: "3d",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Spline",
    platforms: ["web", "macos", "windows"],
    modelSupport: { kind: "single-model", notes: "Spline's AI 3D + texture generation." },
    accentColor: "#FF6B6B",
    tags: ["3d-design", "web-3d", "interactive", "ai-textures"],
    links: [{ kind: "website", url: "https://spline.design", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "rodin",
    insight:
      "Aimed at production: clean topology and PBR materials, where most image-to-3D tools still output messy, unusable meshes.",
    name: "Rodin",
    tagline: "Deemos' image-to-3D for high-fidelity, production-ready meshes.",
    description:
      "Deemos' Rodin (Hyper3D) turns images or text into high-fidelity 3D models with clean geometry and PBR materials, aimed at game and film asset pipelines.",
    category: "3d",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Deemos",
    platforms: ["web"],
    modelSupport: { kind: "single-model", notes: "Deemos' Rodin 3D models." },
    accentColor: "#5EEAD4",
    tags: ["3d-gen", "image-to-3d", "pbr", "high-fidelity"],
    links: [{ kind: "website", url: "https://hyper3d.ai", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Research platforms ──
  {
    slug: "notebooklm",
    insight:
      "Answers strictly from your uploaded sources — no open-web drift — and its Audio Overviews turn a doc set into a two-host podcast.",
    name: "NotebookLM",
    tagline: "Grounded research notebook — chat your sources, get Audio Overviews.",
    description:
      "Google's source-grounded research tool — upload docs, PDFs, and links, then ask questions answered only from your material, with citations and shareable Audio Overviews. Powered by Gemini.",
    category: "research-platform",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Google",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "single-model",
      models: ["Gemini"],
      notes: "Grounded in your uploaded sources, powered by Gemini.",
    },
    accentColor: "#5E97F6",
    tags: ["research", "rag", "citations", "audio-overview"],
    links: [{ kind: "website", url: "https://notebooklm.google.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "google-ai-studio",
    insight:
      "The free front door to the Gemini API — prototype in the browser, then export the exact call as code with one click.",
    name: "Google AI Studio",
    tagline: "Prototype with Gemini — prompts, multimodal, and instant API keys.",
    description:
      "Google's free playground for building with Gemini — prompt design, multimodal input, structured output, and one-click export to API code. The fastest way to start building on Gemini.",
    category: "research-platform",
    pricing: "free",
    deployment: "cloud",
    vendor: "Google",
    platforms: ["web"],
    modelSupport: {
      kind: "single-model",
      models: ["Gemini"],
      notes: "Build + prototype with Gemini models.",
    },
    accentColor: "#4285F4",
    tags: ["prototyping", "gemini", "api", "playground"],
    links: [{ kind: "website", url: "https://aistudio.google.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Model hosting / fine-tuning ──
  {
    slug: "replicate",
    insight:
      "Any model is a 'Cog' container behind one API, billed per second — the low-commitment way to ship a model you didn't train.",
    name: "Replicate",
    tagline: "Run, fine-tune, and deploy thousands of open models via one API.",
    description:
      "A platform to run open-source models with one API call — image, video, audio, and language — plus fine-tuning and custom deploys with pay-per-second billing. No infra to manage.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Replicate",
    platforms: ["web", "api", "cli"],
    modelSupport: {
      kind: "multi-model",
      models: ["FLUX", "Llama", "Stable Diffusion", "Whisper"],
      notes: "Run + fine-tune thousands of community and open-source models.",
    },
    accentColor: "#E8F1F8",
    tags: ["model-hosting", "fine-tuning", "api", "open-source"],
    links: [
      { kind: "website", url: "https://replicate.com", primary: true },
      { kind: "docs", url: "https://replicate.com/docs" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Agentic app builders ──
  {
    slug: "lovable",
    insight:
      "Grew out of the GPT Engineer project — it wires a Supabase backend and GitHub sync into every app it generates.",
    name: "Lovable",
    tagline: "Prompt a full-stack app into existence — UI, backend, and deploy.",
    description:
      "An AI app builder that turns prompts into full-stack web apps — React UI, Supabase backend, GitHub sync, and one-click publish. Popular for going from idea to shipped product fast.",
    category: "agent",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Lovable",
    platforms: ["web"],
    modelSupport: {
      kind: "multi-model",
      notes: "Generates full-stack apps; frontier models under the hood.",
    },
    accentColor: "#FF5C8A",
    tags: ["app-builder", "full-stack", "no-code", "supabase"],
    links: [{ kind: "website", url: "https://lovable.dev", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "replit",
    insight:
      "Build, database, and hosting all live in the browser, so its Agent can ship an app from a phone with zero local setup.",
    name: "Replit",
    tagline: "Cloud IDE + Agent that builds, runs, and deploys from a prompt.",
    description:
      "A browser IDE with Replit Agent — describe an app and it scaffolds, codes, runs, and deploys it, with a hosted database and one-click publish. Zero local setup, ships from anywhere.",
    category: "agent",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Replit",
    platforms: ["web", "ios", "android"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT"],
      notes: "Replit Agent builds + deploys using frontier models.",
    },
    accentColor: "#F26207",
    tags: ["cloud-ide", "agent", "deploy", "full-stack"],
    links: [{ kind: "website", url: "https://replit.com", primary: true }],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Batch: discover-apps sweep — inference / gateway / data-ops / editor / 3d-gen,
  // 2026-06-06. Net-new category leaders + first data-ops entries. Web-verified;
  // see /discover-apps + docs/directory-playbook.md for the flow.

  // ── Inference (fine-tuning track) ──
  {
    slug: "groq",
    insight:
      "Speed comes from custom LPU silicon, not GPUs — which is why it serves open models at hundreds of tokens/sec on an OpenAI-compatible API.",
    name: "Groq",
    tagline: "Ultra-fast inference on custom LPU chips. Open-weights at 500+ tokens/sec.",
    description:
      "GroqCloud serves open-weights models (Llama, DeepSeek, Qwen, Kimi) on Groq's purpose-built LPU hardware, hitting hundreds of tokens per second where GPUs manage tens. OpenAI-compatible API with a free tier; the default when token latency is the product.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "Groq",
    platforms: ["api", "web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "DeepSeek", "Qwen", "Kimi K2", "GPT-OSS"],
      notes: "Open-weights catalog on Groq LPUs; OpenAI-compatible API.",
    },
    accentColor: "#F55036",
    tags: ["inference", "low-latency", "lpu", "open-weights"],
    links: [
      { kind: "website", url: "https://groq.com", primary: true },
      { kind: "docs", url: "https://console.groq.com/docs" },
      { kind: "pricing", url: "https://groq.com/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Model gateway (infra) ──
  {
    slug: "openrouter",
    insight:
      "Swap among 300+ models by changing one string, with automatic fallback if a provider is down — and one consolidated bill.",
    name: "OpenRouter",
    tagline: "One OpenAI-compatible API in front of 300+ models from every provider.",
    description:
      "A unified gateway that routes a single endpoint and API key to models from Anthropic, OpenAI, Google, Meta, DeepSeek, xAI, and more — swap models by changing one parameter, with automatic fallbacks and one consolidated bill. Pass-through token pricing plus dozens of free models.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "OpenRouter",
    platforms: ["api", "web"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini", "Llama", "DeepSeek", "Grok"],
      notes: "Single OpenAI-compatible endpoint fronting 300+ models; routing + fallbacks.",
    },
    accentColor: "#6467F2",
    tags: ["gateway", "routing", "multi-model", "fallbacks"],
    links: [
      { kind: "website", url: "https://openrouter.ai", primary: true },
      { kind: "docs", url: "https://openrouter.ai/docs" },
      { kind: "pricing", url: "https://openrouter.ai/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Data-ops (new category coverage — first entries) ──
  {
    slug: "firecrawl",
    insight:
      "Renders JS and dodges anti-bot to return clean markdown, not raw HTML — and its core is AGPL, so you can self-host the crawler.",
    name: "Firecrawl",
    tagline: "Turn any website into clean, LLM-ready data — scrape, crawl, search.",
    description:
      "A web data API for AI — scrape, crawl, map, and search pages into clean markdown or structured JSON, handling proxies, anti-bot, and JS rendering for you. Open-source core (AGPL) plus a hosted service; a default web-ingestion layer for agents and RAG pipelines.",
    category: "data-ops",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Firecrawl",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#F97316",
    tags: ["web-scraping", "crawling", "rag", "open-source"],
    links: [
      { kind: "website", url: "https://firecrawl.dev", primary: true },
      { kind: "github", url: "https://github.com/firecrawl/firecrawl" },
      { kind: "docs", url: "https://docs.firecrawl.dev" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "unstructured",
    insight:
      "Handles the unglamorous pre-RAG step — OCR, tables, and document hierarchy across 64+ file types — that makes or breaks retrieval.",
    name: "Unstructured",
    tagline: "ETL for LLMs — turn PDFs, decks, and emails into clean, structured data.",
    description:
      "Ingests 64+ file types and partitions, chunks, enriches, and embeds them into LLM-ready output, handling OCR, tables, and document hierarchy. An open-source library plus a low-code platform and API; a staple preprocessing layer for production RAG.",
    category: "data-ops",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Unstructured",
    platforms: ["api", "web"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#7C3AED",
    tags: ["document-etl", "preprocessing", "rag", "open-source"],
    links: [
      { kind: "website", url: "https://unstructured.io", primary: true },
      { kind: "github", url: "https://github.com/Unstructured-IO/unstructured" },
      { kind: "docs", url: "https://docs.unstructured.io" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Orchestration (data framework) ──
  {
    slug: "llamaindex",
    insight:
      "Retrieval-first where LangChain is orchestration-first — its LlamaParse service is the go-to for PDFs that defeat normal parsers.",
    name: "LlamaIndex",
    tagline: "The data framework for LLM apps — RAG, agents, and document workflows.",
    description:
      "An open-source framework (Python + TypeScript) for connecting LLMs to your data — ingestion, indexing, retrieval, and agentic document workflows. Pairs with the managed LlamaCloud (LlamaParse) for production parsing and extraction. The most-used RAG framework after LangChain.",
    category: "orchestration",
    pricing: "freemium",
    openSource: true,
    vendor: "LlamaIndex",
    platforms: ["api", "cli"],
    modelSupport: { kind: "model-agnostic" },
    accentColor: "#EC4899",
    tags: ["framework", "rag", "agents", "open-source"],
    links: [
      { kind: "website", url: "https://www.llamaindex.ai", primary: true },
      { kind: "github", url: "https://github.com/run-llama/llama_index" },
      { kind: "docs", url: "https://docs.llamaindex.ai" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── IDE ──
  {
    slug: "zed",
    insight:
      "From the creators of Atom and Tree-sitter — its open Agent Client Protocol lets external agents like Claude Code drive the editor.",
    name: "Zed",
    tagline: "The fast, open-source AI code editor in Rust, from the Atom creators.",
    description:
      "A GPU-accelerated, Rust-built editor with first-class agentic AI — parallel agents, edit prediction, and an open Agent Client Protocol that plugs into Claude, GPT, Gemini, MCP servers, and external CLI agents like Claude Code. Fully open source (GPL-3); BYO key or an optional hosted Pro tier.",
    category: "ide",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Zed Industries",
    platforms: ["macos", "linux", "windows"],
    modelSupport: {
      kind: "byo-key",
      models: ["Claude", "GPT", "Gemini", "Local"],
      notes:
        "BYO key or Zed-hosted Pro models; connects external agents via the Agent Client Protocol.",
    },
    accentColor: "#2563EB",
    tags: ["ide", "rust", "agentic", "open-source"],
    links: [
      { kind: "website", url: "https://zed.dev", primary: true },
      { kind: "docs", url: "https://zed.dev/docs" },
      { kind: "github", url: "https://github.com/zed-industries/zed" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Image / video generation (node-based) ──
  {
    slug: "comfyui",
    insight:
      "Exposes the whole diffusion pipeline as an explicit node graph, so a workflow is reproducible and shareable as a single JSON file.",
    name: "ComfyUI",
    tagline: "Node-based visual AI — wire up image, video, and audio diffusion pipelines.",
    description:
      "An open-source, node-graph interface for diffusion models — build precise, reproducible image/video/audio pipelines on an infinite canvas where every model and parameter is visible. Runs locally on your own GPU or as a desktop app, with thousands of community nodes.",
    category: "image-gen",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Comfy Org",
    platforms: ["windows", "macos", "linux", "web"],
    modelSupport: {
      kind: "model-agnostic",
      notes:
        "Runs open diffusion models you supply (FLUX, Stable Diffusion, video models); no LLM required.",
    },
    accentColor: "#10B981",
    tags: ["image-gen", "video-gen", "node-based", "open-source"],
    links: [
      { kind: "website", url: "https://www.comfy.org", primary: true },
      { kind: "github", url: "https://github.com/comfyanonymous/ComfyUI" },
      { kind: "docs", url: "https://docs.comfy.org" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Local model runners ──
  {
    slug: "ollama",
    insight:
      "Its OpenAI-compatible local server makes it a drop-in backend — point any app at localhost and swap the cloud for your own GPU.",
    name: "Ollama",
    tagline: "Run open-weight LLMs locally with one command. OpenAI-compatible API.",
    description:
      "The de-facto way to pull and run open-weight models (Llama, Qwen, Gemma, DeepSeek, gpt-oss) on your own machine — no API key, no data leaving the device. Ships native macOS/Windows/Linux apps, an OpenAI-compatible server, and official Python/JS libraries. MIT-licensed and free locally; an optional paid Ollama Cloud runs larger models.",
    category: "inference",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Ollama",
    platforms: ["macos", "windows", "linux", "cli", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Qwen", "Gemma", "DeepSeek", "Mistral", "gpt-oss"],
      notes:
        "Runs open-weight models locally; OpenAI-compatible API. Optional cloud for larger models.",
    },
    accentColor: "#E8F1F8",
    tags: ["local", "open-source", "llm-runner", "self-hosted"],
    links: [
      { kind: "website", url: "https://ollama.com", primary: true },
      { kind: "github", url: "https://github.com/ollama/ollama" },
      { kind: "docs", url: "https://docs.ollama.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "lm-studio",
    insight:
      "Free even for commercial use, though the app itself is closed-source — and it serves both OpenAI- and Anthropic-compatible local APIs.",
    name: "LM Studio",
    tagline: "Desktop app to discover, download, and run local LLMs privately.",
    description:
      "A GUI for running open-weight models on your own hardware — browse and download GGUF/MLX models, chat offline, and expose an OpenAI- and Anthropic-compatible local server for your apps. Includes RAG over local files, MCP tool-use support, and dual llama.cpp + Apple MLX runtimes. Free for personal and commercial use; the app itself is proprietary.",
    category: "inference",
    pricing: "free",
    deployment: "local",
    vendor: "LM Studio",
    platforms: ["macos", "windows", "linux", "cli", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Qwen", "DeepSeek", "Mistral", "Gemma", "gpt-oss"],
      notes:
        "Runs GGUF/MLX open-weight models locally behind an OpenAI/Anthropic-compatible server.",
    },
    accentColor: "#A78BFA",
    tags: ["local", "llm-runner", "gui", "privacy"],
    links: [
      { kind: "website", url: "https://lmstudio.ai", primary: true },
      { kind: "docs", url: "https://lmstudio.ai/docs" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Fine-tuning ──
  {
    slug: "unsloth",
    insight:
      "Hand-written CUDA kernels roughly halve fine-tuning time and VRAM, so a 13B model trains on a single consumer GPU.",
    name: "Unsloth",
    tagline: "Fine-tune open LLMs 2x faster with far less VRAM. Open source.",
    description:
      "An open-source (Apache-2.0) framework for fine-tuning and running open-weight models with custom CUDA kernels — roughly 2x faster training and large VRAM savings, so 7B–13B models fit on a single consumer GPU. Free tier runs on Colab/Kaggle or locally; Pro and Enterprise tiers add multi-GPU and multi-node speedups. Exports to GGUF/Safetensors for llama.cpp, vLLM, and Ollama.",
    category: "fine-tuning",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Unsloth AI",
    platforms: ["cli", "linux", "windows", "macos"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Qwen", "Gemma", "DeepSeek", "Mistral", "gpt-oss"],
      notes: "Fine-tunes open-weight models (LoRA/QLoRA + full) with reduced memory use.",
    },
    accentColor: "#5EEAD4",
    tags: ["fine-tuning", "lora", "open-source", "training"],
    links: [
      { kind: "website", url: "https://unsloth.ai", primary: true },
      { kind: "github", url: "https://github.com/unslothai/unsloth" },
      { kind: "docs", url: "https://docs.unsloth.ai" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── LLM app platform ──
  {
    slug: "dify",
    insight:
      "Bundles a workflow builder, RAG, and observability into one self-hostable platform — its license is source-available, not fully OSI.",
    name: "Dify",
    tagline: "Visual platform for agentic workflows, RAG pipelines, and LLM apps.",
    description:
      "An LLMOps platform that bundles a drag-and-drop workflow builder, RAG pipelines, agent tooling, model management, and observability into one surface — prototype to production without much glue code. Connects hundreds of proprietary and open models across providers. Self-host the source-available edition for free, or use Dify Cloud's paid tiers.",
    category: "orchestration",
    pricing: "freemium",
    deployment: "hybrid",
    vendor: "Dify (LangGenius)",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "model-agnostic",
      notes:
        "Provider-agnostic; wires up GPT, Claude, Gemini, Llama, and any OpenAI-compatible model.",
    },
    accentColor: "#1C64F2",
    tags: ["llm-ops", "workflow", "rag", "agents", "self-hosted"],
    links: [
      { kind: "website", url: "https://dify.ai", primary: true },
      { kind: "github", url: "https://github.com/langgenius/dify" },
      { kind: "docs", url: "https://docs.dify.ai" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Generative-media inference ──
  {
    slug: "fal",
    insight:
      "Specializes in generative-media latency — FLUX, Kling, Veo and 600+ media models — where general inference hosts focus on text.",
    name: "fal",
    tagline: "Serverless inference API for image, video, audio, and 3D models.",
    description:
      "A generative-media inference platform exposing FLUX, Kling, Veo, Wan, Stable Diffusion, and 600+ image/video/audio/3D models through one fast, serverless API — no GPUs to manage and near-zero cold starts. Pay per output or per GPU-second; free starter credits to test. Popular as the production backend for AI media features.",
    category: "inference",
    pricing: "freemium",
    deployment: "cloud",
    vendor: "fal",
    platforms: ["api", "web"],
    modelSupport: {
      kind: "multi-model",
      models: ["FLUX", "Kling", "Veo", "Wan", "Stable Diffusion"],
      notes: "Unified API to 600+ open and commercial generative-media models.",
    },
    accentColor: "#37F3FF",
    tags: ["generative-media", "image-gen", "video-gen", "serverless"],
    links: [
      { kind: "website", url: "https://fal.ai", primary: true },
      { kind: "docs", url: "https://docs.fal.ai" },
      { kind: "pricing", url: "https://fal.ai/pricing" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },

  // ── Agentic dev environment ──
  {
    slug: "warp",
    insight:
      "Began as a from-scratch Rust terminal and grew into a multi-agent dev environment — the command line reimagined as an agent surface.",
    name: "Warp",
    tagline: "Agentic development environment born out of the terminal.",
    description:
      "A modern terminal and agent platform — multi-agent orchestration, codebase indexing, a built-in editor (Warp Code), and granular permission controls for running coding agents. Adds the Oz cloud layer for remote agent execution and team knowledge via Warp Drive. Free tier with monthly AI credits; paid Build/Max/Business plans add more credits and BYOK.",
    category: "ide",
    pricing: "freemium",
    deployment: "local",
    vendor: "Warp",
    platforms: ["macos", "linux", "windows"],
    modelSupport: {
      kind: "multi-model",
      models: ["Claude", "GPT", "Gemini"],
      notes: "Access to frontier models; BYO API key supported on paid plans.",
    },
    accentColor: "#08D9D6",
    tags: ["terminal", "agentic", "dev-environment", "multi-agent"],
    links: [
      { kind: "website", url: "https://www.warp.dev", primary: true },
      { kind: "docs", url: "https://docs.warp.dev" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "librechat",
    insight:
      "MIT-licensed with multi-user auth built in — the closest thing to a self-owned, team-wide ChatGPT across every provider at once.",
    name: "LibreChat",
    tagline: "Self-hosted, open-source ChatGPT alternative unifying every major AI provider.",
    description:
      "A self-hosted AI chat platform that puts many providers behind one ChatGPT-style UI, with agents, code interpreter, web search, image generation, artifacts, file analysis, and multi-user auth. You run it yourself via Docker and supply your own model keys, or point it at a local Ollama/OpenAI-compatible endpoint. Fully open source under MIT — no cost for the software itself.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "Danny Avila / LibreChat",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "multi-model",
      models: [
        "OpenAI",
        "Anthropic",
        "Google",
        "AWS Bedrock",
        "Azure",
        "Groq",
        "Mistral",
        "Ollama",
      ],
      notes: "BYO keys across providers, or custom OpenAI-compatible / local endpoints.",
    },
    tags: ["chat", "self-hosted", "open-source", "multi-model", "rag"],
    links: [
      { kind: "github", url: "https://github.com/danny-avila/LibreChat", primary: true },
      { kind: "website", url: "https://librechat.ai" },
      { kind: "docs", url: "https://www.librechat.ai/docs" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "khoj",
    insight:
      "Lives inside the tools you already use — Obsidian, Emacs, desktop, mobile — as an AGPL second brain over your notes and the web.",
    name: "Khoj",
    tagline: "Open-source AI second brain that chats with your docs and the web, local or hosted.",
    description:
      'An open-source "AI second brain" for chatting with local or online models, searching across your personal documents and the internet, building custom agents, and automating research. Self-host it on your own machine, or use plugins for Obsidian, Emacs, desktop, and mobile. Licensed AGPL-3.0; a paid managed cloud tier also exists, so it\'s freemium.',
    category: "research-platform",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Khoj AI",
    platforms: ["web", "ios", "android", "macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Qwen", "Gemma", "Mistral", "GPT", "Claude", "Gemini", "DeepSeek"],
      notes: "Local or online models; bring your own API keys.",
    },
    tags: ["second-brain", "rag", "self-hosted", "open-source", "research"],
    links: [
      { kind: "github", url: "https://github.com/khoj-ai/khoj", primary: true },
      { kind: "website", url: "https://khoj.dev" },
      { kind: "docs", url: "https://docs.khoj.dev" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "anythingllm",
    insight:
      "Runs either as a one-click desktop app or a Docker server — the same private RAG workspace whether you're solo or a team.",
    name: "AnythingLLM",
    tagline: "All-in-one private AI app for chatting with your documents, with agents.",
    description:
      "An all-in-one application for private, ChatGPT-style chat over your own documents, with built-in RAG, AI agents, and multi-user workspaces. Runs as a local desktop app (Mac/Windows/Linux) or self-hosted via Docker, and supports 40+ LLM providers plus local models with your own keys. Open source under MIT; Mintplex Labs also offers a paid hosted instance, making it freemium.",
    category: "assistant",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "Mintplex Labs",
    platforms: ["web", "macos", "windows", "linux", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["OpenAI", "Anthropic", "Ollama", "LocalAI", "Mistral", "llama.cpp"],
      notes: "40+ providers; BYO API keys or fully local models.",
    },
    tags: ["rag", "documents", "self-hosted", "open-source", "agents"],
    links: [
      { kind: "github", url: "https://github.com/Mintplex-Labs/anything-llm", primary: true },
      { kind: "website", url: "https://anythingllm.com" },
      { kind: "docs", url: "https://docs.anythingllm.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "jan",
    insight:
      "Bundles its own model runner to work 100% offline, and is one of the few here that's fully free with no paid tier at all.",
    name: "Jan",
    tagline: "Open-source ChatGPT alternative that runs 100% offline on your computer.",
    description:
      "An open-source desktop assistant that runs AI models 100% offline on your own machine, bundling a local model runner so you can download and chat with open models like Llama, Gemma, and Qwen. It also supports bring-your-own keys for cloud providers when you want them, and exposes a local OpenAI-compatible server. Fully open source under Apache 2.0 with no paid tier.",
    category: "assistant",
    pricing: "free",
    openSource: true,
    deployment: "local",
    vendor: "Menlo Research",
    platforms: ["macos", "windows", "linux", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["Llama", "Gemma", "Qwen", "gpt-oss", "Claude", "Mistral"],
      notes: "Runs open models locally; BYO API keys for cloud providers.",
    },
    tags: ["offline", "local", "open-source", "privacy", "desktop"],
    links: [
      { kind: "github", url: "https://github.com/menloresearch/jan", primary: true },
      { kind: "website", url: "https://jan.ai" },
      { kind: "docs", url: "https://jan.ai/docs" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "big-agi",
    insight:
      "Deploys to your own Vercel in a click, and its 'beam' feature runs one prompt across several models to compare side by side.",
    name: "Big-AGI",
    tagline: "Multi-model AI workspace with chat, voice, image gen, and tool use — BYO keys.",
    description:
      "A self-hostable AI workspace for chatting across hundreds of models from many providers, with voice calls, image generation, web search, and code execution. It runs self-hosted via Docker or Vercel and connects to local engines (Ollama, LM Studio, LocalAI) as well as cloud providers. MIT-licensed and free — you supply your own provider API keys.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "Enrico Ros",
    platforms: ["web"],
    modelSupport: {
      kind: "multi-model",
      models: [
        "Anthropic",
        "OpenAI",
        "Google",
        "Mistral",
        "DeepSeek",
        "Groq",
        "Ollama",
        "LM Studio",
      ],
      notes:
        "Hundreds of models across providers incl. local engines and OpenAI-compatible endpoints.",
    },
    tags: ["chat", "multi-model", "self-hosted", "open-source", "workspace"],
    links: [
      { kind: "github", url: "https://github.com/enricoros/big-AGI", primary: true },
      { kind: "website", url: "https://big-agi.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "cherry-studio",
    insight:
      "Free for individuals and small teams, but its AGPL terms require a paid commercial license once an org passes ten people.",
    name: "Cherry Studio",
    tagline: "Desktop AI client unifying frontier LLMs, local models, and 300+ assistants.",
    description:
      "A cross-platform desktop AI productivity app for chatting across cloud and local models, with autonomous agents and 300+ prebuilt assistants. It runs on your own machine and supports local models via Ollama and LM Studio alongside cloud providers using your own keys. The community edition is AGPL-3.0; organizations over ten people require a paid commercial license.",
    category: "assistant",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "CherryHQ",
    platforms: ["macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      models: ["OpenAI", "Anthropic", "Google", "DeepSeek", "Qwen", "Ollama", "LM Studio"],
      notes: "Cloud and local models; bring your own keys.",
    },
    tags: ["desktop", "multi-model", "local", "open-source", "assistants"],
    links: [
      { kind: "github", url: "https://github.com/CherryHQ/cherry-studio", primary: true },
      { kind: "website", url: "https://www.cherry-ai.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "leon",
    insight:
      "One of the older open personal-assistant projects, now mid-rewrite to 2.0 — designed to run on local models and local context.",
    name: "Leon",
    tagline: "Open-source personal AI assistant built on tools, memory, and agentic execution.",
    description:
      "A self-hosted personal AI assistant organized around tools, context, memory, and agentic execution, with smart, controlled, and agent run modes. It runs on your own machine and can use local models and local context instead of routing everything through third-party services. MIT-licensed and free; currently shipping a 2.0 developer preview alongside the legacy stable branch.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "Leon AI",
    platforms: ["web", "macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      notes: "Supports both local and remote AI providers; bring your own keys for remote models.",
    },
    tags: ["assistant", "self-hosted", "open-source", "voice", "agent"],
    links: [
      { kind: "github", url: "https://github.com/leon-ai/leon", primary: true },
      { kind: "website", url: "https://getleon.ai" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "flowise",
    insight:
      "The drag-and-drop counterpart to code-first frameworks — it builds on LangChain/LlamaIndex nodes, so anything they support, it can wire.",
    name: "Flowise",
    tagline: "Visually build AI agents and LLM workflows — drag-and-drop, self-hosted.",
    description:
      "A low-code visual builder for AI agents, chatflows, and multi-agent systems on a drag-and-drop canvas. It self-hosts locally through npm or Docker, or deploys to major clouds, and is provider-agnostic across many LLMs via its node ecosystem. The core is Apache-2.0; a managed Flowise Cloud tier exists, making it freemium.",
    category: "orchestration",
    pricing: "freemium",
    openSource: true,
    deployment: "hybrid",
    vendor: "FlowiseAI",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["OpenAI", "Anthropic", "Google", "Ollama", "Hugging Face"],
      notes:
        "Provider-agnostic via LangChain/LlamaIndex nodes; exact set depends on installed nodes.",
    },
    tags: ["low-code", "agents", "self-hosted", "open-source", "workflows"],
    links: [
      { kind: "github", url: "https://github.com/FlowiseAI/Flowise", primary: true },
      { kind: "website", url: "https://flowiseai.com" },
      { kind: "docs", url: "https://docs.flowiseai.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "hermes-agent",
    insight:
      "From Nous Research — it accrues reusable skills from experience and is reachable over Telegram, Discord, or Slack, not just a terminal.",
    name: "Hermes Agent",
    tagline: "Self-improving personal AI agent that learns skills and keeps persistent memory.",
    description:
      "A self-hostable AI agent from Nous Research that builds skills from experience, maintains long-term memory, and is reachable through a terminal TUI, a web dashboard, or messaging gateways (Telegram, Discord, Slack). It runs anywhere from a small VPS to local Docker, and works with any model via Nous Portal, OpenRouter, OpenAI, or self-hosted endpoints. Free and open source under MIT; you bring your own model access.",
    category: "agent",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "Nous Research",
    platforms: ["cli", "web", "api"],
    modelSupport: {
      kind: "byo-key",
      models: ["Nous Portal", "OpenRouter", "OpenAI"],
      notes: "Any model via gateway or self-hosted endpoint.",
    },
    tags: ["personal-agent", "memory", "self-hosted", "open-source", "skills"],
    links: [
      { kind: "github", url: "https://github.com/NousResearch/hermes-agent", primary: true },
      { kind: "website", url: "https://hermes-agent.nousresearch.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "openclaw",
    insight:
      "One of the few self-hosted assistants that runs on iOS and Android too, controlled from WhatsApp, Telegram, Slack, or Discord.",
    name: "OpenClaw",
    tagline: "Local-first personal AI assistant you run on your own devices, on any platform.",
    description:
      "A self-hosted, local-first personal AI assistant with a gateway as the control plane, reachable across messaging channels like WhatsApp, Telegram, Slack, and Discord. It runs on macOS, Linux, Windows, iOS, and Android, with an onboarding wizard for setup. Free and open source under MIT; you supply your own model API key.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "OpenClaw Foundation",
    platforms: ["macos", "windows", "linux", "ios", "android", "cli"],
    modelSupport: {
      kind: "byo-key",
      notes: "Works with OpenAI and many other providers; bring your own key.",
    },
    tags: ["personal-assistant", "local-first", "self-hosted", "open-source", "messaging"],
    links: [
      { kind: "github", url: "https://github.com/openclaw/openclaw", primary: true },
      { kind: "website", url: "https://openclaw.ai" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "odysseus",
    insight:
      "Built and open-sourced by PewDiePie — a private ChatGPT-style workspace wired to local llama.cpp/Ollama/vLLM with MCP built in.",
    name: "Odysseus",
    tagline: "Self-hosted AI workspace with a ChatGPT-style UI for local and API models.",
    description:
      "A self-hosted, privacy-first AI workspace offering a ChatGPT/Claude-like interface with agent capabilities, memory, and productivity tools (PDF/Office, built-in MCP servers). It connects to local models via llama.cpp, Ollama, or vLLM, or to API providers like OpenAI and OpenRouter, and ships Docker support for Linux, macOS, and Windows. Free and open source under MIT.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "PewDiePie",
    platforms: ["web", "macos", "windows", "linux", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["llama.cpp", "Ollama", "vLLM", "OpenAI", "OpenRouter"],
      notes: "Local engines or API providers.",
    },
    tags: ["ai-workspace", "self-hosted", "open-source", "local-models", "mcp"],
    links: [
      { kind: "github", url: "https://github.com/pewdiepie-archdaemon/odysseus", primary: true },
      { kind: "website", url: "https://pewdiepie-archdaemon.github.io/odysseus" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "open-interpreter",
    insight:
      "Hands the model a real shell on your machine — Python, JS, bash — gated behind per-command approval, and it can run fully offline.",
    name: "Open Interpreter",
    tagline: "Natural-language interface that lets LLMs run code locally in your terminal.",
    description:
      "Gives LLMs a ChatGPT-like terminal interface to write and execute Python, JavaScript, Shell, and more on your own machine, asking approval before each run. It works with hosted models or fully local models via Ollama, LM Studio, or Jan using a --local flag. Free and open source under AGPL-3.0; you supply your own model (API key or local).",
    category: "agent",
    pricing: "byo-key",
    openSource: true,
    deployment: "local",
    vendor: "Open Interpreter",
    platforms: ["cli", "macos", "windows", "linux", "api"],
    modelSupport: {
      kind: "multi-model",
      models: ["GPT", "Ollama", "LM Studio", "Jan"],
      notes: "Hosted or fully-local models; --local for offline use.",
    },
    tags: ["code-execution", "terminal", "local", "open-source", "agent"],
    links: [
      { kind: "github", url: "https://github.com/openinterpreter/open-interpreter", primary: true },
      { kind: "website", url: "https://openinterpreter.com" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "goose",
    insight:
      "From Block (the Square/Cash App company) — an on-machine agent built around MCP extensions, with 15+ model providers.",
    name: "Goose",
    tagline: "Open-source on-machine AI agent for coding, workflows, and automation.",
    description:
      "An extensible AI agent from Block that runs natively on your machine as a desktop app or CLI, executing code and automating engineering tasks via MCP extensions. It supports 15+ LLM providers (Anthropic, OpenAI, Google, Ollama, and more) using your own keys. Free and open source under Apache 2.0.",
    category: "agent",
    pricing: "byo-key",
    openSource: true,
    deployment: "local",
    vendor: "Block",
    platforms: ["macos", "windows", "linux", "cli"],
    modelSupport: {
      kind: "multi-model",
      models: ["Anthropic", "OpenAI", "Google", "Ollama"],
      notes: "15+ providers; bring your own key.",
    },
    tags: ["coding-agent", "mcp", "automation", "open-source", "desktop"],
    links: [
      { kind: "github", url: "https://github.com/block/goose", primary: true },
      { kind: "website", url: "https://block.github.io/goose" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "gpt-researcher",
    insight:
      "An open-source take on 'deep research' — it fans out parallel searches and cites sources, runnable as a library or an MCP server.",
    name: "GPT Researcher",
    tagline:
      "Autonomous AI agent that runs deep multi-source web research and writes cited reports.",
    description:
      "An open-source autonomous research agent that plans a task, runs parallel multi-source web searches, validates sources, and synthesizes a cited report. It runs locally as a Python package, FastAPI server, or MCP server, and works with any LLM provider plus a search/retriever backend. Free and Apache-2.0 licensed — you only pay your own LLM and search-API costs.",
    category: "research-platform",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "Assaf Elovic / Tavily",
    platforms: ["web", "cli", "api"],
    modelSupport: {
      kind: "byo-key",
      notes: "Any LLM provider via config; requires your own LLM + retriever (e.g. Tavily) keys.",
    },
    tags: ["open-source", "self-hosted", "research", "agent", "rag"],
    links: [
      { kind: "github", url: "https://github.com/assafelovic/gpt-researcher", primary: true },
      { kind: "website", url: "https://gptr.dev" },
      { kind: "docs", url: "https://docs.gptr.dev" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "sillytavern",
    insight:
      "A pure frontend — you supply the backend — but its character cards and prompt control run anywhere, even Android via Termux.",
    name: "SillyTavern",
    tagline: "Self-hosted LLM chat frontend for power users, with characters and many backends.",
    description:
      "A self-hosted, browser-based LLM frontend aimed at power users, with rich character cards, prompt control, extensions, and group chats. It runs as a local Node.js server on Windows, macOS, Linux, and Android (via Termux), connecting to many backends — OpenAI, Anthropic, plus local runtimes — using your own keys. Free and AGPL-3.0 licensed with no paid tier.",
    category: "assistant",
    pricing: "byo-key",
    openSource: true,
    deployment: "self-host",
    vendor: "SillyTavern",
    platforms: ["web", "windows", "macos", "linux", "android"],
    modelSupport: {
      kind: "multi-model",
      notes: "Connects to many LLM backends (OpenAI, Anthropic, local runtimes) via your own keys.",
    },
    tags: ["open-source", "self-hosted", "chat", "local", "llm-frontend"],
    links: [
      { kind: "github", url: "https://github.com/SillyTavern/SillyTavern", primary: true },
      { kind: "website", url: "https://sillytavern.app" },
      { kind: "docs", url: "https://docs.sillytavern.app" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "continue",
    insight:
      "One open-source assistant spanning VS Code, JetBrains, and the CLI — point it at a local Ollama model and nothing leaves your machine.",
    name: "Continue",
    tagline: "Open-source AI coding assistant for VS Code, JetBrains, and the CLI.",
    description:
      "An open-source AI coding assistant delivered as a VS Code extension, a JetBrains plugin, and a CLI, with chat, autocomplete, and agent workflows. It runs locally in your editor and works with any model provider, including local models via Ollama, using your own keys. The core is Apache-2.0 and free; the company also offers a hosted Continue Hub for sharing and managing assistants.",
    category: "ide",
    pricing: "freemium",
    openSource: true,
    deployment: "local",
    vendor: "Continue Dev",
    platforms: ["vscode-extension", "cli", "macos", "windows", "linux"],
    modelSupport: {
      kind: "multi-model",
      notes: "Any provider and local models via Ollama; bring your own keys.",
    },
    tags: ["open-source", "local", "coding-assistant", "ide", "agent"],
    links: [
      { kind: "github", url: "https://github.com/continuedev/continue", primary: true },
      { kind: "website", url: "https://www.continue.dev" },
      { kind: "docs", url: "https://docs.continue.dev" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
  {
    slug: "onyx",
    insight:
      "Formerly Danswer — an MIT core for enterprise search over your own apps, with optional features under a separate open-core license.",
    name: "Onyx",
    tagline: "Open-source, self-hosted AI chat and enterprise search over your own docs.",
    description:
      "Onyx (formerly Danswer) is an open-source AI chat and RAG platform that connects to your company's docs and apps for grounded, cited answers, and works with any LLM. It is self-hosted via Docker/Kubernetes and supports local models, keeping data on your own infrastructure. The core is MIT-licensed and free; an open-core model puts optional enterprise features under a separate license, and the vendor also offers a managed cloud.",
    category: "assistant",
    pricing: "freemium",
    openSource: true,
    deployment: "self-host",
    vendor: "Onyx",
    platforms: ["web", "api"],
    modelSupport: {
      kind: "multi-model",
      notes:
        "Works with any LLM (OpenAI, Anthropic, local models); self-hosted, bring your own keys.",
    },
    tags: ["open-source", "self-hosted", "rag", "enterprise-search", "ai-chat"],
    links: [
      { kind: "github", url: "https://github.com/onyx-dot-app/onyx", primary: true },
      { kind: "website", url: "https://onyx.app" },
      { kind: "docs", url: "https://docs.onyx.app" },
    ],
    addedAt: "2026-06-06",
    lastVerifiedAt: "2026-06-06",
  },
];

// Cheap dev-time guard. Every directory entry must declare at least one
// platform so visitors know where the app runs. Runs at module load on the
// server (RSC), throws loudly during dev/build if an entry slips through.
if (process.env.NODE_ENV !== "production") {
  const seenSlugs = new Set<string>();
  for (const app of apps) {
    if (app.platforms.length === 0) {
      throw new Error(`App "${app.slug}" has no platforms. Every entry needs ≥1.`);
    }
    // Hard dedup: a duplicate slug fails the build (and so the CI gate), so an
    // accidental re-listing can never reach main even if a routine misjudges.
    if (seenSlugs.has(app.slug)) {
      throw new Error(`Duplicate app slug "${app.slug}". Every entry needs a unique slug.`);
    }
    seenSlugs.add(app.slug);
  }
}
