// The vibecoding journey as a realistic Claude Code session: you prompt, Claude
// does the work (scaffold, docs, code, terminal, PR, deploy). Four stages —
// Conceptualize → Specify → Build → Ship — threaded through three sample
// products. Platform-varying commands key off the active platform tab.
import type { Stage, WorkflowProduct } from "@/types/workflow";

// ── Ignaite Brief — arxiv link → structured paper digest ──────────────────────
const briefStages: ReadonlyArray<Stage> = [
  {
    id: "conceptualize",
    number: "01",
    title: "Conceptualize.",
    summary:
      "An idea, a chat window, a back-and-forth that turns a hunch into a product hypothesis worth shipping.",
    beats: [
      {
        id: "spark",
        title: "Spark",
        body: "You bring the idea. Claude reflects it back sharper — one input, one structured brief, no jargon tax.",
      },
      {
        id: "interrogate",
        title: "Interrogate",
        body: "Claude pushes back: who needs this, what do they do today, what unlocks weekly use? The hunch becomes a job-to-be-done.",
      },
      {
        id: "hypothesis",
        title: "Hypothesis",
        body: "A web-first reader with a single input and an export-perfect output, plus a measurable success metric to hold it to.",
      },
    ],
    platformNotes: {
      web: {
        title: "Likely stack",
        body: "Next.js + Tailwind on Vercel; server-rendered digests for SEO.",
      },
      android: {
        title: "Likely stack",
        body: "Kotlin + Compose; share-target for arxiv URLs; offline digests.",
      },
      windows: {
        title: "Likely stack",
        body: "Tauri (Rust + WebView2) over the web app; EV-signed installer.",
      },
      ios: {
        title: "Likely stack",
        body: "SwiftUI in Xcode 16; Safari share-extension; TestFlight cohort.",
      },
    },
    transcript: [
      {
        speaker: "you",
        body: "Ok, idea: paste an arxiv link, get a clean printable digest back in under a minute. Worth building?",
      },
      { speaker: "claude", body: "Could be. Who's it for — researchers, PMs, indie builders?" },
      {
        speaker: "you",
        body: "All three, but mostly builders tracking where AI capability is moving.",
      },
      {
        speaker: "claude",
        body: "Web-first, then. Five sections — claims, methods, baselines, limits, takeaway?",
      },
      {
        speaker: "you",
        body: "Yeah. Plus a 'why it matters' read from a focus area the user gives it.",
      },
      {
        speaker: "claude",
        body: "Sharp. So: single-input web reader, export-perfect output, and we measure digests shared per active session. Want me to write it up?",
      },
    ],
  },
  {
    id: "specify",
    number: "02",
    title: "Specify.",
    summary:
      "Before a line of product code, Claude drafts the contract — CLAUDE.md, a PRD, a tech spec — and a milestone plan you ratify.",
    beats: [
      {
        id: "claude-md",
        title: "CLAUDE.md",
        body: "The agent's working contract: stack, folder map, conventions, guardrails, definition of done.",
      },
      {
        id: "prd",
        title: "PRD",
        body: "Problem, the job-to-be-done, MVP scope as in/out, distribution per platform, a metric in numbers.",
      },
      {
        id: "spec",
        title: "Tech spec",
        body: "Fetch pipeline, extraction prompts, claim schema, share-card generation, eval set for digest fidelity.",
      },
    ],
    platformNotes: {
      web: {
        title: "Distribution",
        body: "Vercel preview per PR; production behind ignaite.app/brief with a staged-rollout flag.",
      },
      android: {
        title: "Distribution",
        body: "Signed AAB → Play internal → closed beta → production. Crashlytics from day one.",
      },
      windows: {
        title: "Distribution",
        body: "MSIX on GitHub Releases; winget manifest; Tauri auto-update.",
      },
      ios: {
        title: "Distribution",
        body: "TestFlight cohort, then App Store phased release with a kill-switch flag.",
      },
    },
    transcript: [
      { speaker: "you", body: "Yes — get it on paper before we touch code." },
      {
        speaker: "claude",
        body: "On it. Contract first:",
        blocks: [
          {
            kind: "write",
            file: "CLAUDE.md",
            note: "stack · conventions · guardrails",
            href: "/workflow/artifacts/brief/claude-md",
          },
          {
            kind: "write",
            file: "PRD.md",
            note: "problem · JTBD · metric",
            href: "/workflow/artifacts/brief/prd",
          },
          {
            kind: "write",
            file: "SPEC.md",
            note: "pipeline · schema · evals",
            href: "/workflow/artifacts/brief/spec",
          },
          {
            kind: "write",
            file: "prompts/",
            note: "reusable prompt library",
            href: "/workflow/artifacts/brief/prompt-library",
          },
        ],
      },
      {
        speaker: "claude",
        body: "And the milestones, for you to sign off:",
        blocks: [
          {
            kind: "plan",
            items: [
              "M1 · arxiv fetch + section parse",
              "M2 · LLM claim extraction + schema",
              "M3 · digest render + share card",
              "M4 · ship to ignaite.app/brief",
            ],
          },
        ],
      },
      { speaker: "you", body: "That's the shape of it. Go." },
    ],
  },
  {
    id: "build",
    number: "03",
    title: "Build.",
    summary:
      "Claude stands up the repo and harness in-session, then works one tight loop per milestone — plan, implement, verify — you ratify every step.",
    beats: [
      {
        id: "scaffold",
        title: "Scaffold",
        body: "Claude creates the project, locks deps, writes the lint/format/git-hook config and the CI workflow. No setup tax on you.",
      },
      {
        id: "implement",
        title: "Implement",
        body: "One task, one diff. Claude proposes the change; you read it before it's committed.",
      },
      {
        id: "verify",
        title: "Verify",
        body: "Tests alongside code; the eval set scores every digest. CI green is table stakes, not a milestone.",
      },
    ],
    platformNotes: {
      web: {
        title: "Scaffold",
        body: "create-next-app · @anthropic-ai/sdk · arxiv-api · gh repo create · vercel link · simple-git-hooks.",
      },
      android: {
        title: "Scaffold",
        body: "studio.sh · gradle wrapper · fastlane match-android · ktlint + detekt wired.",
      },
      windows: {
        title: "Scaffold",
        body: "create-tauri-app · sign with EV cert · winget validate · cargo test in CI.",
      },
      ios: {
        title: "Scaffold",
        body: "xcodegen · SPM deps · fastlane match-ios · xcodebuild test · Xcode Cloud nightly.",
      },
    },
    transcript: [
      {
        speaker: "claude",
        body: "Starting M1. Repo and harness first — I'll set it up in-session:",
        blocks: [
          {
            kind: "note",
            perPlatform: {
              web: "pnpm dlx create-next-app · pnpm add @anthropic-ai/sdk arxiv-api",
              android: "studio.sh · gradle wrapper · ktlint + detekt",
              windows: "cargo create-tauri-app · signtool EV cert",
              ios: "xcodegen · SPM deps · fastlane match-ios",
            },
          },
          {
            kind: "run",
            cmd: "gh repo create ignaite/brief --private && simple-git-hooks install",
            out: "repo created · pre-commit + pre-push hooks set",
          },
          {
            kind: "write",
            file: ".github/workflows/ci.yml",
            note: "lint · typecheck · build · eval gate",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Then the loop — plan, build, verify:",
        blocks: [
          {
            kind: "plan",
            items: [
              "fetch arxiv source (PDF + abstract)",
              "parse metadata + section boundaries",
              "unit tests for the parser",
            ],
          },
          {
            kind: "run",
            cmd: {
              web: "pnpm typecheck && pnpm test",
              android: "./gradlew test",
              windows: "cargo test",
              ios: "xcodebuild test -scheme Brief",
            },
            out: "0 errors · 14 passed",
          },
        ],
      },
      { speaker: "you", body: "Read the diff — clean. Keep going." },
      {
        speaker: "claude",
        body: "M1's green and merged. I updated CLAUDE.md to match the new fetch module.",
      },
    ],
  },
  {
    id: "ship",
    number: "04",
    title: "Ship.",
    summary:
      "The PR opens with receipts, CI signs off, the deploy fires, the release notes write themselves. Claude did the typing; you sign the manifest.",
    beats: [
      {
        id: "pr",
        title: "Pull request",
        body: "Claude opens the PR with a summary, screenshots, and a link to the spec section it implements.",
      },
      {
        id: "ci",
        title: "CI green",
        body: "Lint, types, build, tests, eval scores — all within budget. Anything red blocks the merge.",
      },
      {
        id: "deploy",
        title: "Deploy",
        body: "Merge to main triggers the production build; the platform artifact ships to its channel automatically.",
      },
    ],
    platformNotes: {
      web: {
        title: "Deploy",
        body: "Vercel auto-promotes main to ignaite.app/brief; edge cache invalidates; Speed Insights watches.",
      },
      android: {
        title: "Deploy",
        body: "Signed AAB via fastlane supply → Play internal → production after 24h clean Crashlytics.",
      },
      windows: {
        title: "Deploy",
        body: "Signed MSIX → GitHub Releases; winget index PR auto-opened; Tauri updater handles clients.",
      },
      ios: {
        title: "Deploy",
        body: "TestFlight build bumps; invites fire; App Store Connect phased release.",
      },
    },
    transcript: [
      { speaker: "you", body: "Looks done. Open the PR." },
      {
        speaker: "claude",
        body: "Up, with receipts:",
        blocks: [
          {
            kind: "pr",
            title: "feat: arxiv digest pipeline",
            status: "CI green · eval-set within budget · ready to merge",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Merged. Shipping it:",
        blocks: [
          {
            kind: "run",
            cmd: {
              web: "vercel deploy --prod",
              android: "fastlane supply --track internal",
              windows: "gh release create + winget PR",
              ios: "fastlane pilot upload",
            },
            out: "shipped",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Live behind ignaite.app/brief. I drafted release notes from the diff — yours to tweak.",
      },
    ],
  },
];

// ── Eval Forge — spec section → eval suite + golden set + CI harness ─────────
const forgeStages: ReadonlyArray<Stage> = [
  {
    id: "conceptualize",
    number: "01",
    title: "Conceptualize.",
    summary:
      "An idea, a chat window, a back-and-forth that turns 'add a feature' into 'add a feature with an eval gate behind it.'",
    beats: [
      {
        id: "spark",
        title: "Spark",
        body: "You bring the idea. Claude reflects it back as a contract: paste a spec section, get a grading rubric.",
      },
      {
        id: "interrogate",
        title: "Interrogate",
        body: "Who runs the evals — author, reviewer, CI? What does 'pass' mean? The fuzzy idea sharpens.",
      },
      {
        id: "hypothesis",
        title: "Hypothesis",
        body: "A tool that emits a Vitest suite + GitHub Action from a spec section; metric = features shipped behind a passing gate.",
      },
    ],
    platformNotes: {
      web: {
        title: "Likely stack",
        body: "Next.js dashboard on Vercel; server actions kick off runs; results stream over SSE.",
      },
      android: {
        title: "Likely stack",
        body: "Read-only Compose companion — view runs and scores; authoring stays web/CLI.",
      },
      windows: {
        title: "Likely stack",
        body: "First-class Rust CLI; suite generation runs locally before the dashboard sees it.",
      },
      ios: {
        title: "Likely stack",
        body: "SwiftUI companion for monitoring + re-runs; authoring stays on desktop.",
      },
    },
    transcript: [
      {
        speaker: "you",
        body: "Idea: every Claude feature ships behind a generated eval gate. Paste a spec section, get the suite.",
      },
      {
        speaker: "claude",
        body: "From the spec section directly. What's the output — a Vitest suite, or something custom?",
      },
      { speaker: "you", body: "Vitest + a golden set + a GitHub Action. Runnable end to end." },
      {
        speaker: "claude",
        body: "And 'pass' — exact-match, rubric-score, human-review? Or all three, author's pick per case?",
      },
      { speaker: "you", body: "All three, author picks. CLI first, dashboard second." },
      {
        speaker: "claude",
        body: "Got it. Spec-section → eval suite + CI gate; we measure features shipped behind a passing gate. Write it up?",
      },
    ],
  },
  {
    id: "specify",
    number: "02",
    title: "Specify.",
    summary:
      "CLAUDE.md, a PRD, a tech spec — three documents that pin down what 'good evals' means before any are generated.",
    beats: [
      {
        id: "claude-md",
        title: "CLAUDE.md",
        body: "Working contract: stack, folder map, conventions, guardrails specific to eval-generation prompts.",
      },
      {
        id: "prd",
        title: "PRD",
        body: "Problem, the developer shipping a Claude feature, a measurable success metric, MVP scope, distribution.",
      },
      {
        id: "spec",
        title: "Tech spec",
        body: "Spec-section parser, eval-case generator prompts, rubric schema, Vitest template, Action wiring.",
      },
    ],
    platformNotes: {
      web: {
        title: "Distribution",
        body: "Vercel preview per PR; production at forge.ignaite.app with flags for new eval kinds.",
      },
      android: {
        title: "Distribution",
        body: "Play internal → beta → production. Read-only companion; no authoring on mobile.",
      },
      windows: {
        title: "Distribution",
        body: "CLI via cargo + winget; dashboard as a local Tauri shell or web.",
      },
      ios: {
        title: "Distribution",
        body: "TestFlight, then App Store. Read-only monitor aligned with Android.",
      },
    },
    transcript: [
      { speaker: "you", body: "Write it down before any code." },
      {
        speaker: "claude",
        body: "On it. The contract:",
        blocks: [
          {
            kind: "write",
            file: "CLAUDE.md",
            note: "stack · eval-gen guardrails",
            href: "/workflow/artifacts/forge/claude-md",
          },
          {
            kind: "write",
            file: "PRD.md",
            note: "user · metric · scope",
            href: "/workflow/artifacts/forge/prd",
          },
          {
            kind: "write",
            file: "SPEC.md",
            note: "parser · rubric · harness",
            href: "/workflow/artifacts/forge/spec",
          },
          {
            kind: "write",
            file: "prompts/",
            note: "eval-gen prompt library",
            href: "/workflow/artifacts/forge/prompt-library",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Milestones to sign off:",
        blocks: [
          {
            kind: "plan",
            items: [
              "M1 · spec-section parser + CLI",
              "M2 · eval-case generator (3 kinds)",
              "M3 · Vitest harness + GitHub Action",
              "M4 · dashboard + ship",
            ],
          },
        ],
      },
      { speaker: "you", body: "That's it. Go." },
    ],
  },
  {
    id: "build",
    number: "03",
    title: "Build.",
    summary:
      "Claude scaffolds the generator and CI in-session, then works one tight loop per improvement — and meta-evals grade the generator's own output.",
    beats: [
      {
        id: "scaffold",
        title: "Scaffold",
        body: "A TypeScript monorepo (generator + harness + dashboard), deps locked, lint/format + the eval-run Action wired.",
      },
      {
        id: "implement",
        title: "Implement",
        body: "One task, one diff. Claude proposes the generator prompts; you read them before commit.",
      },
      {
        id: "verify",
        title: "Verify",
        body: "Meta-evals: generated suites are scored against a hand-built reference. CI green is table stakes.",
      },
    ],
    platformNotes: {
      web: {
        title: "Scaffold",
        body: "create-next-app · @anthropic-ai/sdk · vitest · gh repo create · vercel link · simple-git-hooks.",
      },
      android: {
        title: "Scaffold",
        body: "studio.sh · gradle wrapper · companion module from the dashboard API.",
      },
      windows: {
        title: "Scaffold",
        body: "cargo new --bin · clap for CLI flags · cargo test in CI · winget validate.",
      },
      ios: {
        title: "Scaffold",
        body: "xcodegen · SPM deps · companion shares its API client via OpenAPI.",
      },
    },
    transcript: [
      {
        speaker: "claude",
        body: "Starting M1. Monorepo and harness, scaffolded in-session:",
        blocks: [
          {
            kind: "note",
            perPlatform: {
              web: "pnpm dlx create-next-app · pnpm add @anthropic-ai/sdk vitest",
              android: "studio.sh · companion module",
              windows: "cargo new --bin · clap",
              ios: "xcodegen · SPM deps",
            },
          },
          {
            kind: "run",
            cmd: "gh repo create ignaite/forge --private && simple-git-hooks install",
            out: "repo + hooks set",
          },
          {
            kind: "write",
            file: ".github/workflows/evals.yml",
            note: "runs the generated suite on every PR",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Then the parser — plan, build, verify against the reference set:",
        blocks: [
          {
            kind: "plan",
            items: [
              "parse a spec section into testable claims",
              "CLI: forge gen <section>",
              "meta-eval against the reference set",
            ],
          },
          {
            kind: "run",
            cmd: "pnpm test && pnpm forge gen specs/login.md",
            out: "9 cases emitted · meta-eval 0.94",
          },
        ],
      },
      { speaker: "you", body: "Diff looks right. Keep going." },
      {
        speaker: "claude",
        body: "M1's green and merged. CLAUDE.md now carries the generator's prompt contract.",
      },
    ],
  },
  {
    id: "ship",
    number: "04",
    title: "Ship.",
    summary:
      "The PR opens with eval-run receipts, CI signs off, the deploy fires, the release notes write themselves.",
    beats: [
      {
        id: "pr",
        title: "Pull request",
        body: "Claude opens the PR with a summary, dashboard screenshots, and before/after eval scores.",
      },
      {
        id: "ci",
        title: "CI green",
        body: "Lint, types, build, meta-evals — all passing. Anything red blocks the merge.",
      },
      {
        id: "deploy",
        title: "Deploy",
        body: "Merge triggers the production build; the platform artifact ships to its channel.",
      },
    ],
    platformNotes: {
      web: {
        title: "Deploy",
        body: "Vercel auto-promotes main to forge.ignaite.app; Speed Insights watches.",
      },
      android: {
        title: "Deploy",
        body: "Signed AAB via fastlane supply → production after 24h clean Crashlytics.",
      },
      windows: {
        title: "Deploy",
        body: "Signed MSIX + cargo-published CLI → GitHub Releases; winget PR auto-opened.",
      },
      ios: {
        title: "Deploy",
        body: "TestFlight build bumps; invites fire; App Store phased release.",
      },
    },
    transcript: [
      { speaker: "you", body: "Ship it. Open the PR." },
      {
        speaker: "claude",
        body: "Up, with the eval delta:",
        blocks: [
          {
            kind: "pr",
            title: "feat: spec-section eval generator",
            status: "CI green · meta-eval 0.94 (+0.06) · ready to merge",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Merged. Shipping:",
        blocks: [
          {
            kind: "run",
            cmd: {
              web: "vercel deploy --prod",
              android: "fastlane supply --track internal",
              windows: "cargo publish + gh release + winget PR",
              ios: "fastlane pilot upload",
            },
            out: "shipped",
          },
        ],
      },
      {
        speaker: "claude",
        body: "forge.ignaite.app is live; the CLI's on cargo. Release notes drafted from the meta-eval delta — your call on voice.",
      },
    ],
  },
];

// ── Edge Memo — on-device multi-agent meeting capture ────────────────────────
const memoStages: ReadonlyArray<Stage> = [
  {
    id: "conceptualize",
    number: "01",
    title: "Conceptualize.",
    summary:
      "An idea, a chat window, a back-and-forth that turns 'capture this' into 'capture this without sending it to the cloud.'",
    beats: [
      {
        id: "spark",
        title: "Spark",
        body: "You bring the idea. Claude reflects it back: three small models cooperating locally, nothing leaves the phone.",
      },
      {
        id: "interrogate",
        title: "Interrogate",
        body: "Which models fit on-device? What's the latency budget? When does the user read vs. just trust the action items?",
      },
      {
        id: "hypothesis",
        title: "Hypothesis",
        body: "A privacy-first, iOS-native-first capture app; optional self-hosted sync; metric = meetings captured per active user per week.",
      },
    ],
    platformNotes: {
      web: {
        title: "Likely stack",
        body: "WebGPU pipeline for laptops; transformers.js; a thin dashboard for self-hosted sync.",
      },
      android: {
        title: "Likely stack",
        body: "Kotlin + Compose; GGUF via llama.cpp bindings; foreground service for long meetings.",
      },
      windows: {
        title: "Likely stack",
        body: "Tauri + Rust; DirectML or CPU fallback; runs on a 2-year-old laptop without a GPU.",
      },
      ios: {
        title: "Likely stack",
        body: "SwiftUI in Xcode 16; Core ML models; Background Modes for active recording.",
      },
    },
    transcript: [
      {
        speaker: "you",
        body: "Idea: meeting capture that runs entirely on the device — three small models cooperating, nothing leaves the phone.",
      },
      {
        speaker: "claude",
        body: "Transcribe, summarise, extract action items — all local? What's the latency budget?",
      },
      {
        speaker: "you",
        body: "Sub-5s after the meeting ends, on a 30-minute clip. iPhone 14 Pro target.",
      },
      {
        speaker: "claude",
        body: "Sync — leave it off by default, opt-in, self-hosted, end-to-end encrypted?",
      },
      { speaker: "you", body: "Exactly. Nothing leaves unless the user enrolls a relay." },
      {
        speaker: "claude",
        body: "Clear. On-device multi-agent capture, opt-in E2EE sync; we measure meetings captured per active user per week. Write it up?",
      },
    ],
  },
  {
    id: "specify",
    number: "02",
    title: "Specify.",
    summary:
      "CLAUDE.md, a PRD, a tech spec — three documents that pin down the privacy story before any audio is captured.",
    beats: [
      {
        id: "claude-md",
        title: "CLAUDE.md",
        body: "Stack, folder map, conventions — plus an explicit guardrail: nothing leaves the device by default.",
      },
      {
        id: "prd",
        title: "PRD",
        body: "Problem (privacy + battery of cloud capture), target user, JTBD, MVP scope, distribution per platform.",
      },
      {
        id: "spec",
        title: "Tech spec",
        body: "Multi-agent harness, model selection (quantization budgets), transcript schema, extractor prompts, sync protocol.",
      },
    ],
    platformNotes: {
      web: {
        title: "Distribution",
        body: "Vercel preview per PR; production at memo.ignaite.app; Service Worker caches models for offline.",
      },
      android: {
        title: "Distribution",
        body: "Signed AAB → Play internal → closed beta of 50 → open beta → production.",
      },
      windows: {
        title: "Distribution",
        body: "MSIX on GitHub Releases; winget manifest; Tauri updater.",
      },
      ios: {
        title: "Distribution",
        body: "TestFlight cohort first, then App Store phased release.",
      },
    },
    transcript: [
      { speaker: "you", body: "Write it down — the privacy story first, before any audio." },
      {
        speaker: "claude",
        body: "On it. The contract, guardrail front and centre:",
        blocks: [
          {
            kind: "write",
            file: "CLAUDE.md",
            note: "guardrail: nothing leaves the device",
            href: "/workflow/artifacts/memo/claude-md",
          },
          {
            kind: "write",
            file: "PRD.md",
            note: "privacy · users · scope",
            href: "/workflow/artifacts/memo/prd",
          },
          {
            kind: "write",
            file: "SPEC.md",
            note: "harness · models · sync",
            href: "/workflow/artifacts/memo/spec",
          },
          {
            kind: "write",
            file: "prompts/",
            note: "extractor prompt library",
            href: "/workflow/artifacts/memo/prompt-library",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Milestones to sign off:",
        blocks: [
          {
            kind: "plan",
            items: [
              "M1 · on-device transcribe (Core ML)",
              "M2 · summarise + action-item extract",
              "M3 · opt-in E2EE self-hosted sync",
              "M4 · TestFlight + ship",
            ],
          },
        ],
      },
      { speaker: "you", body: "That's the shape of it. Go." },
    ],
  },
  {
    id: "build",
    number: "03",
    title: "Build.",
    summary:
      "Claude scaffolds the target and the on-device harness in-session, then works one tight loop per improvement — scored on WER + recall.",
    beats: [
      {
        id: "scaffold",
        title: "Scaffold",
        body: "The target, quantized models vendored, lint/format + CI wired before the first agent harness exists.",
      },
      {
        id: "implement",
        title: "Implement",
        body: "One task, one diff. Claude proposes the harness orchestration; you read it before commit.",
      },
      {
        id: "verify",
        title: "Verify",
        body: "A hand-graded golden set scored on transcription WER and action-item recall. CI green is table stakes.",
      },
    ],
    platformNotes: {
      web: {
        title: "Scaffold",
        body: "create-next-app · @huggingface/transformers · gh repo create · vercel link · simple-git-hooks.",
      },
      android: {
        title: "Scaffold",
        body: "studio.sh · gradle wrapper · ndk for llama.cpp · fastlane match-android.",
      },
      windows: {
        title: "Scaffold",
        body: "create-tauri-app · vendor GGUF models · sign with EV cert · cargo test in CI.",
      },
      ios: {
        title: "Scaffold",
        body: "xcodegen · SPM deps · Core ML models under Resources/ · fastlane match-ios · xcodebuild test.",
      },
    },
    transcript: [
      {
        speaker: "claude",
        body: "Starting M1. Target and on-device harness, scaffolded in-session:",
        blocks: [
          {
            kind: "note",
            perPlatform: {
              web: "pnpm dlx create-next-app · pnpm add @huggingface/transformers",
              android: "studio.sh · ndk · llama.cpp bindings",
              windows: "cargo create-tauri-app · vendor GGUF",
              ios: "xcodegen · Core ML models under Resources/",
            },
          },
          {
            kind: "run",
            cmd: "gh repo create ignaite/memo --private && simple-git-hooks install",
            out: "repo + hooks set",
          },
          {
            kind: "write",
            file: ".github/workflows/ci.yml",
            note: "build · WER + recall scorer · model-size budget",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Then on-device transcribe — plan, build, score on the golden set:",
        blocks: [
          {
            kind: "plan",
            items: [
              "wire the Core ML transcribe model",
              "stream partials during recording",
              "score WER on the golden set",
            ],
          },
          {
            kind: "run",
            cmd: {
              web: "pnpm test",
              android: "./gradlew test",
              windows: "cargo test",
              ios: "xcodebuild test -scheme Memo",
            },
            out: "passed · WER 0.07 on a 30-min clip",
          },
        ],
      },
      { speaker: "you", body: "Diff looks right — nothing leaving the device. Keep going." },
      {
        speaker: "claude",
        body: "M1's green and merged. CLAUDE.md now carries the model budget and the on-device guardrail.",
      },
    ],
  },
  {
    id: "ship",
    number: "04",
    title: "Ship.",
    summary:
      "The PR opens with eval receipts, CI signs off, the deploy fires, the release notes write themselves.",
    beats: [
      {
        id: "pr",
        title: "Pull request",
        body: "Claude opens the PR with a summary, screenshots, and the eval-set delta versus the previous tag.",
      },
      {
        id: "ci",
        title: "CI green",
        body: "Lint, types, build, eval-set within budget. Anything red blocks the merge.",
      },
      {
        id: "deploy",
        title: "Deploy",
        body: "Merge triggers the platform build; the artifact ships to its channel.",
      },
    ],
    platformNotes: {
      web: {
        title: "Deploy",
        body: "Vercel auto-promotes main to memo.ignaite.app; Service Worker pre-caches the new model bundle.",
      },
      android: {
        title: "Deploy",
        body: "Signed AAB via fastlane supply → production after 24h clean Crashlytics.",
      },
      windows: {
        title: "Deploy",
        body: "Signed MSIX → GitHub Releases; winget PR auto-opened; Tauri updater.",
      },
      ios: {
        title: "Deploy",
        body: "TestFlight build bumps; invites fire; App Store phased release.",
      },
    },
    transcript: [
      { speaker: "you", body: "Looks done. Open the PR." },
      {
        speaker: "claude",
        body: "Up, with receipts:",
        blocks: [
          {
            kind: "pr",
            title: "feat: on-device transcribe + extract",
            status: "CI green · WER 0.07 · recall 0.91 · ready to merge",
          },
        ],
      },
      {
        speaker: "claude",
        body: "Merged. Shipping the build:",
        blocks: [
          {
            kind: "run",
            cmd: {
              web: "vercel deploy --prod",
              android: "fastlane supply --track internal",
              windows: "gh release create + winget PR",
              ios: "fastlane pilot upload",
            },
            out: "shipped",
          },
        ],
      },
      {
        speaker: "claude",
        body: "TestFlight invites are firing. Release notes drafted from the eval delta — yours to tweak.",
      },
    ],
  },
];

export const stages: Record<WorkflowProduct, ReadonlyArray<Stage>> = {
  brief: briefStages,
  forge: forgeStages,
  memo: memoStages,
};
