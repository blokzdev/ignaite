import type { ReactNode } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";

interface Props {
  accent?: string;
  /** The sticky contextual toolbar (full-bleed, flush under the site header). */
  toolbar: ReactNode;
  /** The pinned mobile action bar (fixed; rendered outside the column). */
  actionBar: ReactNode;
  children: ReactNode;
}

// Apps-only detail scaffold (forked from DetailShell, which stays as-is for the
// dormant /portfolio route). The toolbar renders full-bleed directly under the
// fixed site header — the static pt-12 equals the header's TRUE rest height
// (the 3rem nav row; a var()-based padding would reflow the page every time
// the auto-hiding nav toggles the variable, so the toolbar's sticky offset
// tracks the vars instead). Below it, a max-w-6xl column hosts the masthead,
// stat strip, and the brief + dossier zones. The glow is clipped in its own
// layer so the wrapper does NOT establish an overflow context that would break
// the toolbar's sticky.
export function AppDetailShell({
  accent = "var(--color-accent)",
  toolbar,
  actionBar,
  children,
}: Readonly<Props>) {
  return (
    // pt = the 3rem nav-row rest height + the top safe-area inset (0 in a browser
    // tab). --safe-top is a static env() — it never toggles on scroll, so it can
    // join the padding without the reflow that a --nav-h-based padding would cause.
    <div className="relative pt-[calc(3rem+var(--safe-top))] pb-28 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-clip">
        <GlowOrb
          className="-top-24 left-1/2 -translate-x-1/2"
          size={680}
          color={accent}
          opacity={0.08}
        />
      </div>

      {toolbar}

      <div className="safe-px relative mx-auto max-w-6xl">{children}</div>

      {actionBar}
    </div>
  );
}
