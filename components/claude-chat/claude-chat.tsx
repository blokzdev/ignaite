"use client";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ChatMessage } from "@/types/workflow";
import { ChatMessageBubble } from "./chat-message";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

interface Props {
  messages: ReadonlyArray<ChatMessage>;
  /** Window label after the traffic lights. */
  label?: string;
  /** Appended to message keys so callers can force a re-stagger on context change. */
  instanceKey?: string;
}

// Reusable mock Claude Code session window: traffic-light chrome + a staggered,
// reduced-motion-safe transcript. Presentational/state-only — no page logic.
export function ClaudeChat({
  messages,
  label = "claude.ai/code · session",
  instanceKey,
}: Readonly<Props>) {
  const reduced = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)]/70 ring-1 ring-white/[0.08] backdrop-blur-xl ring-inset">
      <header className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <p className="ml-2 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          {label}
        </p>
      </header>

      <ol className="flex flex-col gap-3 p-4 sm:p-5">
        {messages.map((m, i) => (
          <motion.li
            key={`${instanceKey ?? "chat"}-${i}`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT_EXPO,
              // Cap the stagger so long transcripts don't crawl in.
              delay: reduced ? 0 : Math.min(i, 6) * 0.12,
            }}
          >
            <ChatMessageBubble message={m} />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
