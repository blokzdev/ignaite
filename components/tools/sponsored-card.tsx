import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SponsoredSlot } from "@/types/sponsored";

interface Props {
  slot: SponsoredSlot;
}

export function SponsoredCard({ slot }: Readonly<Props>) {
  const monogram = slot.name
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  // Internal CTAs (e.g., /contact?subject=…) skip target=_blank and the
  // sponsored rel. Google's spec uses rel="sponsored" for paid placements
  // that point off-site.
  const isExternal = /^https?:/i.test(slot.link.url);
  const accent = slot.accentColor ?? "#08D9D6";

  return (
    <article
      aria-label={`Sponsored: ${slot.name}`}
      data-sponsored="true"
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-[var(--color-surface)]/70 p-5 ring-1 ring-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ring-inset hover:-translate-y-1 hover:bg-[var(--color-surface)]/90 hover:shadow-[0_8px_30px_-12px_var(--color-accent)] hover:ring-[var(--color-accent)]/20"
    >
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2 py-0.5 text-[var(--color-ink-dim)] ring-1 ring-white/[0.10] ring-inset">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-[var(--color-ink-dim)]" />
          Sponsored
        </span>
        <span className="ml-auto text-[var(--color-ink-dim)]">By {slot.promotedBy}</span>
      </div>

      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs tracking-[0.08em] uppercase"
          style={{
            background: `linear-gradient(135deg, ${accent}1f, transparent)`,
            color: accent,
            boxShadow: `inset 0 0 0 1px ${accent}33`,
          }}
        >
          {monogram}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium tracking-[-0.01em] text-[var(--color-ink)]">
            {slot.name}
          </h3>
          <p className="text-xs text-[var(--color-ink-dim)]">{slot.promotedBy}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="line-clamp-2 text-sm text-[var(--color-ink)]">{slot.tagline}</p>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-ink-dim)]">
          {slot.description}
        </p>
      </div>

      <div className="mt-auto flex items-center pt-2">
        <Link
          href={slot.link.url}
          {...(isExternal && {
            target: "_blank",
            rel: "sponsored noopener noreferrer",
          })}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-accent)]/[0.12] px-4 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.2] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none sm:h-9"
        >
          {slot.link.label}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
