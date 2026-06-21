import type { WorkflowProduct, WorkflowProductMeta } from "@/types/workflow";

export const products: Record<WorkflowProduct, WorkflowProductMeta> = {
  brief: {
    id: "brief",
    name: "Ignaite Brief",
    short: "Brief",
    tagline: "Arxiv link → structured paper digest.",
    description:
      "A web-first reader that turns any arxiv link into a printable, shareable digest: key claims, methods, baselines, limits, and a 'why it matters' angle. Research-rooted; B2B and B2C.",
    defaultPlatform: "web",
    accentColor: "#08D9D6",
  },
  forge: {
    id: "forge",
    name: "Eval Forge",
    short: "Forge",
    tagline: "Spec section → eval suite, golden set, CI harness.",
    description:
      "A developer tool that generates synthetic test cases, a grading rubric, and a Vitest harness for any Claude feature from a spec section. CI-runnable, GitHub-Action wired.",
    defaultPlatform: "web",
    accentColor: "#37F3FF",
  },
  memo: {
    id: "memo",
    name: "Edge Memo",
    short: "Memo",
    tagline: "On-device multi-agent meeting capture.",
    description:
      "Three small models cooperate locally — transcribe, summarise, extract action items. Privacy-first by design, iOS-native first, with optional self-hosted sync.",
    defaultPlatform: "ios",
    accentColor: "#A78BFA",
  },
};
