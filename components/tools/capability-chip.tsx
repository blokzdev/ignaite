import { Check } from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import { CAPABILITY_LABEL } from "@/lib/tools/capability-labels";
import {
  CAPABILITY_FAMILY,
  CAPABILITY_FAMILY_TONE,
  type CapabilityTone,
} from "@/lib/tools/capability-families";
import type { AppCapability, CapabilityLevel } from "@/types/app";

// Canonical chip tone → Tailwind classes (soft tint + tone-coloured text + inset
// ring) — the SINGLE source shared by the detail page (AC-1 `capabilities.tsx`),
// the /compare overlap row, and the comparison verdict, so "same family = same
// hue" holds everywhere a capability chip appears.
export const CAPABILITY_TONE_CHIP: Record<CapabilityTone, string> = {
  accent:
    "bg-[var(--color-accent)]/[0.09] text-[var(--color-accent)] ring-[var(--color-accent)]/25",
  violet:
    "bg-[var(--color-violet)]/[0.12] text-[var(--color-violet)] ring-[var(--color-violet)]/25",
  flame: "bg-[var(--color-flame)]/[0.10] text-[var(--color-flame)] ring-[var(--color-flame)]/25",
  // Vertical (mint) carries a hair more fill + ring than the others so it reads as
  // its own cluster beside the cyan Build chips (mint and cyan are close hues).
  success:
    "bg-[var(--color-success)]/[0.14] text-[var(--color-success)] ring-[var(--color-success)]/35",
  warn: "bg-[var(--color-warn)]/[0.10] text-[var(--color-warn)] ring-[var(--color-warn)]/25",
};

// Secondary level ("can also do") — a ghost variant of each tone: no fill, muted
// neutral text (AA-safe ink-soft), and a faint tone-tinted ring so the family hue
// still whispers. Primary keeps the filled tint above, so within a family row the
// headline jobs read solid + coloured and the supporting ones recede.
export const CAPABILITY_TONE_CHIP_SECONDARY: Record<CapabilityTone, string> = {
  accent: "text-[var(--color-ink-soft)] ring-[var(--color-accent)]/25",
  violet: "text-[var(--color-ink-soft)] ring-[var(--color-violet)]/25",
  flame: "text-[var(--color-ink-soft)] ring-[var(--color-flame)]/25",
  success: "text-[var(--color-ink-soft)] ring-[var(--color-success)]/30",
  warn: "text-[var(--color-ink-soft)] ring-[var(--color-warn)]/25",
};

// One capability leaf as a tone-tinted pill. Tone derives from the leaf's family,
// so callers pass only the id. `level` (AF-2) styles primary as a filled chip and
// secondary as a ghost chip, with a leading marker (filled dot = primary, hollow
// dot = secondary) so the distinction survives without colour. `note` (≤80 chars)
// renders as a muted qualifier. `shared` marks a leaf present on BOTH sides of a
// comparison (a Check glyph + a heavier ring; it takes the marker slot). Pure RSC.
export function CapabilityChip({
  id,
  level,
  note,
  shared = false,
}: Readonly<{
  id: AppCapability;
  level?: CapabilityLevel;
  note?: string;
  shared?: boolean;
}>): ReactElement {
  const tone = CAPABILITY_FAMILY_TONE[CAPABILITY_FAMILY[id]];
  const isSecondary = level === "secondary";
  return (
    <span
      title={note || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium break-words ring-1 ring-inset",
        isSecondary ? CAPABILITY_TONE_CHIP_SECONDARY[tone] : CAPABILITY_TONE_CHIP[tone],
        shared && "ring-2",
      )}
    >
      {shared ? (
        <Check aria-hidden className="h-3 w-3 shrink-0" />
      ) : level ? (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            isSecondary ? "opacity-60 ring-1 ring-current ring-inset" : "bg-current",
          )}
        />
      ) : null}
      {CAPABILITY_LABEL[id]}
      {note ? <span className="font-normal opacity-60">· {note}</span> : null}
      {level ? <span className="sr-only"> ({level} capability)</span> : null}
    </span>
  );
}
