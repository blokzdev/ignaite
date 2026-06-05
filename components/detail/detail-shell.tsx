import type { ReactNode } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { cn } from "@/lib/utils";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { CopyLinkButton } from "./copy-link-button";
import { DetailStickyBar } from "./detail-sticky-bar";

interface Props {
  accent?: string;
  breadcrumb: ReadonlyArray<Crumb>;
  /** Canonical URL copied by the copy-link control. */
  shareUrl: string;
  /** Primary action mirrored into the pinned mobile bar. */
  sticky: { href: string; label: string };
  /** Mute the page (archived entries). */
  dimmed?: boolean;
  children: ReactNode;
}

// Shared scaffold for /apps/[slug] and /portfolio/[slug]: page wrapper + glow +
// reading column + breadcrumb/copy row + the pinned mobile CTA. Each detail body
// supplies its own track-specific sections as children. Server component (SSG-safe);
// the only client island is the copy-link button.
export function DetailShell({
  accent = "var(--color-accent)",
  breadcrumb,
  shareUrl,
  sticky,
  dimmed,
  children,
}: Readonly<Props>) {
  return (
    <div
      className={cn(
        "relative overflow-clip px-6 pt-32 pb-28 sm:pt-40 sm:pb-24",
        dimmed && "opacity-80",
      )}
    >
      <GlowOrb
        className="-top-24 left-1/2 -translate-x-1/2"
        size={680}
        color={accent}
        opacity={0.08}
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <Breadcrumb items={breadcrumb} />
          <CopyLinkButton url={shareUrl} />
        </div>
        {children}
      </div>

      <DetailStickyBar href={sticky.href} label={sticky.label} />
    </div>
  );
}
