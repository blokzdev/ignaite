import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/effects/glow-orb";

export function NowNextBand() {
  return (
    <section id="now-next" className="section-y relative scroll-mt-24 overflow-hidden px-6">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={520}
        color="var(--color-violet)"
        opacity={0.05}
      />

      <div className="relative mx-auto grid max-w-5xl gap-px overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl md:grid-cols-2">
        {/* Now */}
        <div className="flex flex-col gap-4 bg-[var(--color-canvas)]/85 p-8 sm:p-10">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// Now"}</p>
          <h2 className="text-3xl sm:text-4xl">
            <span className="text-display text-[var(--color-ink)]">
              Building cool things since 2020.
            </span>
          </h2>
          <p className="text-base text-[var(--color-ink-dim)]">
            A portfolio of production Android apps shipping on Google Play — blockchain explorers
            spanning BTC, ETH, BNB, TRON, and more. Quiet runway funding the studio while we pivot.
          </p>
        </div>

        {/* Next */}
        <div className="flex flex-col gap-4 bg-[var(--color-canvas)]/85 p-8 sm:p-10">
          <p className="text-eyebrow text-[var(--color-violet)]">{"// Next"}</p>
          <h2 className="text-3xl sm:text-4xl">
            <span className="text-display text-[var(--color-ink)]">Sophisticated AI</span>{" "}
            <span className="text-display text-[var(--color-violet)]">for B2B + B2C.</span>
          </h2>
          <p className="text-base text-[var(--color-ink-dim)]">
            Multi-agent systems · edge inference · memory architectures. Research-rooted product
            work, built end-to-end with Claude Code as the primary author.
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
