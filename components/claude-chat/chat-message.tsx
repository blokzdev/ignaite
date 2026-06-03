import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/workflow";

// One message bubble in a Claude Code transcript. Tool-use `blocks` rendering
// lands in K-2 (with the tool-block component); for now it renders prose.
export function ChatMessageBubble({ message }: Readonly<{ message: ChatMessage }>) {
  const mine = message.speaker === "you";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
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
        {message.body}
      </div>
    </div>
  );
}
