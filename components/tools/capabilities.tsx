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
import { CAPABILITY_LABEL } from "@/lib/tools/capability-labels";
import {
  CAPABILITY_FAMILY_LABEL,
  CAPABILITY_FAMILY_TONE,
  type CapabilityFamily,
  type CapabilityTone,
  groupCapabilitiesByFamily,
} from "@/lib/tools/capability-families";
import type { AppCapability } from "@/types/app";

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

// Chip surface per tone (soft tint + tone-coloured text + inset ring).
const TONE_CHIP: Record<CapabilityTone, string> = {
  accent:
    "bg-[var(--color-accent)]/[0.09] text-[var(--color-accent)] ring-[var(--color-accent)]/25",
  violet:
    "bg-[var(--color-violet)]/[0.12] text-[var(--color-violet)] ring-[var(--color-violet)]/25",
  flame: "bg-[var(--color-flame)]/[0.10] text-[var(--color-flame)] ring-[var(--color-flame)]/25",
  // Vertical (mint) carries a hair more fill + ring than the others so it reads
  // as its own cluster beside the cyan Build chips (mint and cyan are close hues).
  success:
    "bg-[var(--color-success)]/[0.14] text-[var(--color-success)] ring-[var(--color-success)]/35",
  warn: "bg-[var(--color-warn)]/[0.10] text-[var(--color-warn)] ring-[var(--color-warn)]/25",
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
// a tone-badged label column beside its chips. The width is capped so single-chip
// rows read as a tidy spec ledger, not a ragged column trailing into the void.
// Pure server component — static, no JS.
export function Capabilities({
  ids,
}: Readonly<{ ids: ReadonlyArray<AppCapability> }>): ReactElement | null {
  if (ids.length === 0) return null;
  const groups = groupCapabilitiesByFamily(ids);

  return (
    <section className="mt-10 max-w-[62ch]">
      <h2 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        Capabilities <span className="text-[var(--color-ink-dim)]/55">{ids.length}</span>
      </h2>
      <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-ink-dim)]">
        What it actually does — grouped by capability family.
      </p>
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
                {g.ids.map((id) => (
                  <li
                    key={id}
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium break-words ring-1 ring-inset",
                      TONE_CHIP[tone],
                    )}
                  >
                    {CAPABILITY_LABEL[id]}
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
