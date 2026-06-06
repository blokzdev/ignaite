import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";

export function NowNextBand() {
  return (
    <section id="now-next" className="section-y relative overflow-hidden px-6">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={520}
        color="var(--color-violet)"
        opacity={0.05}
      />

      <div className="relative mx-auto grid max-w-5xl gap-px overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl md:grid-cols-2">
        {/* Now */}
        <div className="flex flex-col gap-4 bg-[var(--color-canvas)]/85 p-8 sm:p-10">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// What it is"}</p>
          <h2 className="text-3xl sm:text-4xl">
            <span className="text-display text-[var(--color-ink)]">An AI-managed directory.</span>
          </h2>
          <p className="text-base text-[var(--color-ink-dim)]">
            ~125 AI apps, agents, and tooling — every listing researched, written, and given a
            one-line insight by Claude Code. Curated by an agent, reviewed by humans.
          </p>
        </div>

        {/* Next */}
        <div className="flex flex-col gap-4 bg-[var(--color-canvas)]/85 p-8 sm:p-10">
          <p className="text-eyebrow text-[var(--color-violet)]">{"// How it stays current"}</p>
          <h2 className="text-3xl sm:text-4xl">
            <span className="text-display text-[var(--color-ink)]">Always growing,</span>{" "}
            <span className="text-display text-[var(--color-violet)]">always verified.</span>
          </h2>
          <p className="text-base text-[var(--color-ink-dim)]">
            Scheduled Claude Code routines discover net-new apps and re-audit existing ones every
            week — links, pricing, licenses, and insights kept honest, never left to rot.
          </p>
          <Link
            href="#how-we-work"
            className="mt-auto inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-violet)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          >
            See how we ship
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
