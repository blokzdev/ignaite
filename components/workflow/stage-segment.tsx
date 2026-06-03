import { ClaudeChat } from "@/components/claude-chat/claude-chat";
import type { Stage, WorkflowPlatform, WorkflowProduct } from "@/types/workflow";

interface Props {
  stage: Stage;
  product: WorkflowProduct;
  platform: WorkflowPlatform;
  accentColor: string;
}

// One stage of the session: a (desktop-sticky) header — number, title, summary,
// beats, platform note — beside the Claude Code transcript for the active product.
export function StageSegment({ stage, product, platform, accentColor }: Readonly<Props>) {
  const note = stage.platformNotes[platform];
  return (
    <section
      id={`stage-${stage.id}`}
      aria-labelledby={`stage-${stage.id}-title`}
      className="relative border-t border-white/[0.06] px-6 py-20 sm:py-28"
    >
      <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <header className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] tracking-[0.2em]" style={{ color: accentColor }}>
              {stage.number}
            </span>
            <h2 id={`stage-${stage.id}-title`} className="text-3xl sm:text-4xl">
              <span className="text-display text-[var(--color-ink)]">{stage.title}</span>
            </h2>
          </div>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-ink-dim)]">
            {stage.summary}
          </p>

          <ul className="mt-6 flex flex-col gap-4">
            {stage.beats.map((b) => (
              <li key={b.id}>
                <p
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: accentColor }}
                >
                  {b.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-dim)]">{b.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] ring-inset">
            <p className="font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
              {note.title} · {platform}
            </p>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
              {note.body}
            </p>
          </div>
        </header>

        <div className="min-w-0">
          <ClaudeChat
            messages={stage.transcript}
            platform={platform}
            instanceKey={`${product}-${stage.id}`}
          />
        </div>
      </div>
    </section>
  );
}
