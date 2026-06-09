import type { ReactNode } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { cn } from "@/lib/utils";

interface Props {
  accent?: string;
  /** The sticky contextual toolbar (rendered first inside the column). */
  toolbar: ReactNode;
  /** The pinned mobile action bar (fixed; rendered outside the column). */
  actionBar: ReactNode;
  /** Mute the page (archived entries). */
  dimmed?: boolean;
  children: ReactNode;
}

// Apps-only detail scaffold (forked from DetailShell, which stays as-is for the
// dormant /portfolio route). Wider max-w-6xl column to host the two-column
// reading + sticky-spec layout, a clipped glow, the sticky toolbar, and the
// mobile action bar. The glow is clipped in its own layer so the wrapper does
// NOT establish an overflow context that would break the toolbar's sticky.
export function AppDetailShell({
  accent = "var(--color-accent)",
  toolbar,
  actionBar,
  dimmed,
  children,
}: Readonly<Props>) {
  return (
    <div className={cn("relative px-6 pt-32 pb-28 sm:pt-40 sm:pb-24", dimmed && "opacity-80")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-clip">
        <GlowOrb
          className="-top-24 left-1/2 -translate-x-1/2"
          size={680}
          color={accent}
          opacity={0.08}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {toolbar}
        {children}
      </div>

      {actionBar}
    </div>
  );
}
