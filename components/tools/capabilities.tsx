import {
  Atom,
  AudioLines,
  Bot,
  Boxes,
  Building2,
  CalendarCheck,
  Code2,
  Cpu,
  Database,
  Image as ImageIcon,
  type LucideIcon,
  Megaphone,
  Mic,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import { CapabilityChip } from "@/components/tools/capability-chip";
import {
  CAPABILITY_FAMILY_LABEL,
  CAPABILITY_FAMILY_TONE,
  type CapabilityEntry,
  type CapabilityFamily,
  type CapabilityTone,
  groupCapabilityEntriesByFamily,
} from "@/lib/tools/capability-families";

// One glyph per family — small, scannable, tinted to the family's tone.
const FAMILY_ICON: Record<CapabilityFamily, LucideIcon> = {
  coding: Code2,
  agents: Bot,
  "model-infra": Cpu,
  "eval-safety": ShieldCheck,
  retrieval: Database,
  "data-apps": Boxes,
  speech: Mic,
  audio: AudioLines,
  vision: ImageIcon,
  writing: PenLine,
  productivity: CalendarCheck,
  gtm: Megaphone,
  vertical: Building2,
  frontier: Atom,
};

// The family-icon badge: a small tone-tinted square that anchors each row and
// reinforces the cluster colour a second time (text colour comes from TONE_TEXT).
const TONE_BADGE: Record<CapabilityTone, string> = {
  accent: "bg-[var(--color-accent)]/10 ring-[var(--color-accent)]/20",
  violet: "bg-[var(--color-violet)]/10 ring-[var(--color-violet)]/20",
  flame: "bg-[var(--color-flame)]/10 ring-[var(--color-flame)]/20",
  success: "bg-[var(--color-success)]/12 ring-[var(--color-success)]/25",
  warn: "bg-[var(--color-warn)]/10 ring-[var(--color-warn)]/20",
};

const TONE_TEXT: Record<CapabilityTone, string> = {
  accent: "text-[var(--color-accent)]",
  violet: "text-[var(--color-violet)]",
  flame: "text-[var(--color-flame)]",
  success: "text-[var(--color-success)]",
  warn: "text-[var(--color-warn)]",
};

// The "Capabilities" section — a listing's TASK fingerprint (WHAT it does), the
// machine-readable keystone surfaced for humans. Grouped by capability family
// (each colour-coded to the directory's five super-clusters), a family per row:
// a tone-badged label column beside its chips. Within each row the AF-2 `level`
// orders + styles the chips — **primary** ("built for") read solid + coloured and
// lead; **secondary** ("can also do") are ghost pills that recede. The width is
// capped so single-chip rows read as a tidy spec ledger, not a ragged column
// trailing into the void. Pure server component — static, no JS.
export function Capabilities({
  entries,
}: Readonly<{ entries: ReadonlyArray<CapabilityEntry> }>): ReactElement | null {
  if (entries.length === 0) return null;
  const groups = groupCapabilityEntriesByFamily(entries);
  const primaryCount = entries.filter((e) => e.level === "primary").length;

  return (
    <section className="mt-10 max-w-[62ch]">
      <h2 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        Capabilities <span className="text-[var(--color-ink-dim)]/55">{entries.length}</span>
      </h2>
      <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-ink-dim)]">
        What it actually does — grouped by capability family.
      </p>
      {/* Legend — only shown once any level is set, so unleveled listings stay clean. */}
      {primaryCount > 0 ? (
        <p
          className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-ink-dim)]"
          aria-hidden
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-ink-soft)]" />
            Primary — built for this
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full opacity-60 ring-1 ring-[var(--color-ink-soft)] ring-inset" />
            Secondary — can also do
          </span>
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3">
        {groups.map((g) => {
          const tone = CAPABILITY_FAMILY_TONE[g.family];
          const Icon = FAMILY_ICON[g.family];
          const label = CAPABILITY_FAMILY_LABEL[g.family];
          return (
            <div
              key={g.family}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3.5"
            >
              {/* Decorative for SR (the chip <ul> below carries the family name). */}
              <div
                aria-hidden
                className={cn("flex items-center gap-2 sm:w-44 sm:shrink-0", TONE_TEXT[tone])}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1 ring-inset",
                    TONE_BADGE[tone],
                  )}
                >
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-[10px] leading-tight tracking-[0.1em] uppercase">
                  {label}
                </span>
              </div>
              <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label={`${label} capabilities`}>
                {g.entries.map((e) => (
                  <li key={e.id}>
                    <CapabilityChip id={e.id} level={e.level} note={e.note} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
