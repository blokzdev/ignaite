import { GlowOrb } from "@/components/effects/glow-orb";

// High-level positioning only — this is the public-facing "how we work"
// touch, deliberately not a process playbook. The detailed agentic-
// engineering walkthrough (stages + transcripts + artifacts) is retained
// in the repo but kept off the live site.
const pillars: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "AI-researched",
    body: "Claude Code reads each app's own site and docs, then writes the listing and its insight.",
  },
  {
    label: "Human-reviewed",
    body: "Every entry lands as a pull request a human approves before it goes live.",
  },
  {
    label: "Always current",
    body: "Weekly routines re-verify links, pricing, and licenses so listings don't rot.",
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" className="section-y relative overflow-hidden px-6">
      <GlowOrb className="top-0 right-0" size={460} color="var(--color-accent)" opacity={0.05} />

      <div className="relative mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// How it's managed"}</p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-display text-[var(--color-ink)]">Researched by AI.</span>{" "}
            <span className="text-display text-[var(--color-accent)]">Reviewed by humans.</span>
          </h2>
          <p className="mt-6 text-base text-[var(--color-ink-dim)] sm:text-lg">
            Every listing is researched, written, and audited by Claude Code against each app&apos;s
            official source — then a human reviews the pull request before it ships. No fabrication,
            no pay-to-list, no crowd-sourced noise.
          </p>
        </header>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-xl sm:grid-cols-3">
          {pillars.map((pillar) => (
            <li
              key={pillar.label}
              className="flex flex-col gap-2 bg-[var(--color-canvas)]/85 p-7 sm:p-8"
            >
              <p className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase">
                {pillar.label}
              </p>
              <p className="text-sm text-[var(--color-ink-dim)]">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
