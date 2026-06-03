import { cn } from "@/lib/utils";
import type { ChatMessage, WorkflowPlatform } from "@/types/workflow";
import { ToolBlocks } from "./tool-block";

interface Props {
  message: ChatMessage;
  platform: WorkflowPlatform;
}

// One message in a Claude Code transcript. `you` messages are right-aligned
// bubbles; `claude` messages are left-aligned and may carry tool-use blocks
// (terminal runs, file writes, plans, a PR) rendered below the prose.
export function ChatMessageBubble({ message, platform }: Readonly<Props>) {
  const mine = message.speaker === "you";
  const hasBlocks = (message.blocks?.length ?? 0) > 0;

  if (mine) {
    return (
      <div className="flex justify-end">
        <Bubble mine>{message.body}</Bubble>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      {message.body && <Bubble mine={false}>{message.body}</Bubble>}
      {hasBlocks && (
        <div className="w-full max-w-[92%] sm:max-w-[88%]">
          <ToolBlocks blocks={message.blocks ?? []} platform={platform} />
        </div>
      )}
    </div>
  );
}

function Bubble({ mine, children }: Readonly<{ mine: boolean; children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[78%]",
        mine
          ? "bg-[var(--color-accent)]/[0.14] text-[var(--color-ink)] ring-1 ring-[var(--color-accent)]/30 ring-inset"
          : "bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset",
      )}
    >
      <p className="mb-0.5 font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        {mine ? "you" : "claude"}
      </p>
      {children}
    </div>
  );
}
