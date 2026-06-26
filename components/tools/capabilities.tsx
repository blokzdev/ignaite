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
  success:
    "bg-[var(--color-success)]/[0.10] text-[var(--color-success)] ring-[var(--color-success)]/25",
  warn: "bg-[var(--color-warn)]/[0.10] text-[var(--color-warn)] ring-[var(--color-warn)]/25",
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
// (each colour-coded to the directory's super-clusters), a family per row: an
// iconned label column beside its chips. Pure server component — static, no JS.
export function Capabilities({
  ids,
}: Readonly<{ ids: ReadonlyArray<AppCapability> }>): ReactElement | null {
  if (ids.length === 0) return null;
  const groups = groupCapabilitiesByFamily(ids);

  return (
    <section className="mt-10">
      <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        Capabilities
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {groups.map((g) => {
          const tone = CAPABILITY_FAMILY_TONE[g.family];
          const Icon = FAMILY_ICON[g.family];
          return (
            <div key={g.family} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <div
                className={cn(
                  "flex items-center gap-1.5 sm:w-40 sm:shrink-0 sm:pt-1.5",
                  TONE_TEXT[tone],
                )}
              >
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase">
                  {CAPABILITY_FAMILY_LABEL[g.family]}
                </span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.ids.map((id) => (
                  <li
                    key={id}
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 ring-inset",
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
