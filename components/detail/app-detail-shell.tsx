import type { ReactNode } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { cn } from "@/lib/utils";

interface Props {
  accent?: string;
  /** The sticky contextual toolbar (full-bleed, flush under the site header). */
  toolbar: ReactNode;
  /** The pinned mobile action bar (fixed; rendered outside the column). */
  actionBar: ReactNode;
  /** Mute the page (archived entries). */
  dimmed?: boolean;
  children: ReactNode;
}

// Apps-only detail scaffold (forked from DetailShell, which stays as-is for the
// dormant /portfolio route). The toolbar renders full-bleed directly under the
// fixed site header — the static pt-12 equals the header's TRUE rest height
// (the 3rem nav row; a var()-based padding would reflow the page every time
// the auto-hiding nav toggles the variable, so the toolbar's sticky offset
// tracks the vars instead). Below it, a max-w-6xl column hosts the two-column
// reading + sticky-spec layout. The glow is clipped in its own layer so the
// wrapper does NOT establish an overflow context that would break the
// toolbar's sticky.
export function AppDetailShell({
  accent = "var(--color-accent)",
  toolbar,
  actionBar,
  dimmed,
  children,
}: Readonly<Props>) {
  return (
    <div className={cn("relative pt-12 pb-28 sm:pb-24", dimmed && "opacity-80")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-clip">
        <GlowOrb
          className="-top-24 left-1/2 -translate-x-1/2"
          size={680}
          color={accent}
          opacity={0.08}
        />
      </div>

      {toolbar}

      <div className="relative mx-auto max-w-6xl px-6">{children}</div>

      {actionBar}
    </div>
  );
}
