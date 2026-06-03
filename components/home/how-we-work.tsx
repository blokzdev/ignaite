import { GlowOrb } from "@/components/effects/glow-orb";

// High-level positioning only — this is the public-facing "how we work"
// touch, deliberately not a process playbook. The detailed agentic-
// engineering walkthrough (stages + transcripts + artifacts) is retained
// in the repo but kept off the live site.
const pillars: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "Architect + reviewer",
    body: "Humans set direction, shape the spec, and own the quality bar on every change.",
  },
  {
    label: "AI as primary author",
    body: "Claude Code writes the bulk of the code end-to-end — conceptualize, build, ship.",
  },
  {
    label: "Research-rooted",
    body: "Grounded in current work on edge AI, multi-agent systems, and memory.",
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:py-32">
      <GlowOrb className="top-0 right-0" size={460} color="var(--color-accent)" opacity={0.05} />

      <div className="relative mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// How we work"}</p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-display text-[var(--color-ink)]">Architect + reviewer.</span>{" "}
            <span className="text-display text-[var(--color-accent)]">AI as primary author.</span>
          </h2>
          <p className="mt-6 text-base text-[var(--color-ink-dim)] sm:text-lg">
            We design, prompt, and ship production apps end-to-end with Claude Code as the primary
            author — humans hold the architecture and the bar, the agent does the heavy lifting, and
            every change is reviewed. Research-rooted, spec-first, shipped.
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
