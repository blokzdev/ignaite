import Link from "next/link";
import { ArrowUpRight, Check, FilePen, GitPullRequest } from "lucide-react";
import type { ChatToolBlock, WorkflowPlatform } from "@/types/workflow";
import { PlanChecklist } from "./harness-bits";

const PLATFORM_LABEL: Record<WorkflowPlatform, string> = {
  web: "web",
  android: "android",
  windows: "windows",
  ios: "ios",
};

// Renders the tool-use blocks attached to a claude message — terminal runs,
// file writes, plan checklists, a PR card, platform-specific notes. Mirrors how
// Claude Code surfaces tool calls inside a session.
export function ToolBlocks({
  blocks,
  platform,
}: Readonly<{ blocks: ReadonlyArray<ChatToolBlock>; platform: WorkflowPlatform }>) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) => (
        <ToolBlockView key={i} block={block} platform={platform} />
      ))}
    </div>
  );
}

function ToolBlockView({
  block,
  platform,
}: Readonly<{ block: ChatToolBlock; platform: WorkflowPlatform }>) {
  switch (block.kind) {
    case "run":
      return (
        <div className="rounded-xl bg-[#050811] p-3 font-mono text-[11px] leading-relaxed ring-1 ring-white/[0.08] ring-inset">
          <div className="flex items-start gap-2 text-[var(--color-ink)]">
            <span aria-hidden className="text-[var(--color-accent)]">
              $
            </span>
            <span className="break-all">{block.cmd}</span>
          </div>
          {block.out && (
            <div className="mt-1 flex items-center gap-1.5 text-[var(--color-ink-dim)]">
              <Check aria-hidden className="h-3 w-3 shrink-0 text-[var(--color-success)]" />
              {block.out}
            </div>
          )}
        </div>
      );

    case "write": {
      const inner = (
        <>
          <FilePen aria-hidden className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
          <span className="font-mono text-xs text-[var(--color-ink)]">{block.file}</span>
          {block.note && (
            <span className="truncate text-[11px] text-[var(--color-ink-dim)]">{block.note}</span>
          )}
        </>
      );
      const base =
        "inline-flex max-w-full items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/[0.08] ring-inset";
      return block.href ? (
        <Link
          href={block.href}
          className={`${base} transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none`}
        >
          {inner}
          <ArrowUpRight aria-hidden className="h-3 w-3 shrink-0 text-[var(--color-ink-dim)]" />
        </Link>
      ) : (
        <div className={base}>{inner}</div>
      );
    }

    case "plan":
      return (
        <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06] ring-inset">
          <p className="mb-2 font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
            Plan · awaiting approval
          </p>
          <PlanChecklist items={block.items} />
        </div>
      );

    case "pr":
      return (
        <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06] ring-inset">
          <div className="flex items-center gap-2">
            <GitPullRequest
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-ink)]">{block.title}</span>
          </div>
          <p className="mt-1 font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-dim)]">
            {block.status}
          </p>
        </div>
      );

    case "note":
      return (
        <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.02] px-3 py-2 ring-1 ring-white/[0.05] ring-inset">
          <span className="mt-px shrink-0 font-mono text-[9px] tracking-[0.12em] text-[var(--color-accent)] uppercase">
            {PLATFORM_LABEL[platform]}
          </span>
          <span className="font-mono text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
            {block.perPlatform[platform]}
          </span>
        </div>
      );
  }
}
