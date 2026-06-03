import { ClaudeChat } from "@/components/claude-chat/claude-chat";
import type { ChatMessage, WorkflowProduct } from "@/types/workflow";

const MESSAGES: Record<WorkflowProduct, ReadonlyArray<ChatMessage>> = {
  brief: [
    {
      speaker: "you",
      body: "What if you could paste an arxiv link and walk away with a printable digest?",
    },
    { speaker: "claude", body: "Interesting. Who reads it — researchers, PMs, indie builders?" },
    { speaker: "you", body: "All three. Builders tracking AI capability shifts, mostly." },
    {
      speaker: "claude",
      body: "Got it. Web-first then? Five-section structure — claims, methods, baselines, limits, takeaway?",
    },
    { speaker: "you", body: "Yes. Plus a 'why it matters' angle from a user-supplied focus area." },
    { speaker: "claude", body: "Done. Want me to draft the PRD and the CLAUDE.md?" },
  ],
  forge: [
    { speaker: "you", body: "What if every Claude feature shipped behind a generated eval gate?" },
    {
      speaker: "claude",
      body: "From the spec section directly? What's the output — a Vitest suite, or something custom?",
    },
    { speaker: "you", body: "Vitest + a golden set + a GitHub Action. Runnable end-to-end." },
    { speaker: "claude", body: "Three eval kinds: exact-match, rubric-score, human-review?" },
    { speaker: "you", body: "Yes. Authors pick the kind per case. CLI first, dashboard second." },
    { speaker: "claude", body: "Done. Want me to draft the PRD and the CLAUDE.md?" },
  ],
  memo: [
    {
      speaker: "you",
      body: "What if meeting capture ran entirely on the device — three small models cooperating?",
    },
    {
      speaker: "claude",
      body: "Transcribe, summarise, extract action items — all local? What's the latency budget?",
    },
    {
      speaker: "you",
      body: "Sub-5s after meeting end, on a 30-minute clip. iPhone 14 Pro target.",
    },
    { speaker: "claude", body: "Sync? Optional, self-hosted, end-to-end encrypted?" },
    {
      speaker: "you",
      body: "Exactly. Nothing leaves the device unless the user explicitly enrolls a relay.",
    },
    { speaker: "claude", body: "Done. Want me to draft the PRD and the CLAUDE.md?" },
  ],
};

interface Props {
  product: WorkflowProduct;
}

export function ChapterConceptualize({ product }: Readonly<Props>) {
  return <ClaudeChat messages={MESSAGES[product]} instanceKey={product} />;
}
