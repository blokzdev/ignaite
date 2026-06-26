import {
  Archive,
  ArrowUpRight,
  RefreshCw,
  Replace,
  RotateCcw,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ChangeEntry, ChangeKind } from "@/types/app";
import { cn, formatDate } from "@/lib/utils";

const KIND: Record<
  ChangeKind,
  { label: string; icon: ComponentType<{ className?: string }>; chip: string; dot: string }
> = {
  added: {
    label: "Listed",
    icon: Sparkles,
    chip: "bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-[var(--color-accent)]/30",
    dot: "bg-[var(--color-accent)]",
  },
  updated: {
    label: "Updated",
    icon: RefreshCw,
    chip: "bg-[var(--color-violet)]/[0.14] text-[var(--color-violet)] ring-[var(--color-violet)]/30",
    dot: "bg-[var(--color-violet)]",
  },
  fixed: {
    label: "Corrected",
    icon: Wrench,
    chip: "bg-[var(--color-warn)]/[0.14] text-[var(--color-warn)] ring-[var(--color-warn)]/30",
    dot: "bg-[var(--color-warn)]",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    chip: "bg-white/[0.05] text-[var(--color-ink-dim)] ring-white/[0.10]",
    dot: "bg-[var(--color-ink-dim)]",
  },
  relisted: {
    label: "Relisted",
    icon: RotateCcw,
    chip: "bg-[var(--color-success)]/[0.12] text-[var(--color-success)] ring-[var(--color-success)]/30",
    dot: "bg-[var(--color-success)]",
  },
  // Recipe audit only (a step's app was swapped/changed) — apps never carry this
  // kind, but the Record<ChangeKind,…> must be total. Reused when AE renders a
  // recipe's change history.
  restepped: {
    label: "Re-stepped",
    icon: Replace,
    chip: "bg-[var(--color-accent)]/[0.12] text-[var(--color-accent)] ring-[var(--color-accent)]/30",
    dot: "bg-[var(--color-accent)]",
  },
};

interface Node {
  date: string;
  kind: ChangeKind;
  summary: string;
  asOf?: string;
  source?: string;
}

/**
 * Visible audit trail for a listing — the structured record of substantive
 * changes the maintenance routines made, newest first, ending at the origin
 * ("Listed · addedAt") so there's never an empty void. Rendered inside the
 * dossier's expandable provenance footer (dossier-rail.tsx). Returns null only when there's
 * genuinely nothing to show (no changelog and no addedAt). Server component.
 */
export function ChangeHistory({
  entries,
  addedAt,
}: Readonly<{ entries: ReadonlyArray<ChangeEntry>; addedAt?: string }>) {
  // Newest first; storage order is irrelevant.
  const nodes: Node[] = [...entries].sort((a, b) =>
    a.date > b.date ? -1 : a.date < b.date ? 1 : 0,
  );

  // Anchor the trail at the listing's origin without backfilling every file —
  // unless an explicit `added` entry already records it. This is the elegant
  // baseline for a never-changed listing: a single "Listed" node.
  if (addedAt && !nodes.some((n) => n.kind === "added")) {
    nodes.push({ date: addedAt, kind: "added", summary: "Added to the directory." });
  }

  if (nodes.length === 0) return null;

  // No heading of its own — the disclosure trigger ("N updates · View history")
  // labels the panel.
  return (
    <div>
      <ol className="relative mt-1 space-y-5 border-l border-white/[0.08] pl-6">
        {nodes.map((n, i) => {
          const meta = KIND[n.kind];
          const Icon = meta.icon;
          return (
            <li key={`${n.date}-${n.kind}-${i}`} className="relative">
              <span
                aria-hidden
                className={cn(
                  "absolute top-1.5 left-[-1.5rem] h-2 w-2 -translate-x-1/2 rounded-full ring-2 ring-[var(--color-canvas)]",
                  meta.dot,
                )}
              />

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <time
                  dateTime={n.date}
                  className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
                >
                  {formatDate(n.date)}
                </time>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ring-1 ring-inset",
                    meta.chip,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </span>
              </div>

              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {n.summary}
              </p>

              {(n.asOf || n.source) && (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                  {n.asOf && <span>As of {formatDate(n.asOf)}</span>}
                  {n.source && (
                    <a
                      href={n.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--color-accent)] transition-opacity hover:opacity-75"
                    >
                      Source
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
