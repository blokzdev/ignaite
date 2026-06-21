import { DocGraph } from "@/components/claude-chat/harness-bits";
import type { WorkflowProductMeta } from "@/types/workflow";

interface Props {
  productMeta: WorkflowProductMeta;
}

// The /workflow hero: what agentic engineering is, the one-time setup, and the
// documentation architecture the agent maintains. Product-aware accent only.
export function WorkflowIntro({ productMeta }: Readonly<Props>) {
  return (
    <section className="px-6 pt-32 pb-16 sm:pt-40">
      <div className="container-site max-w-4xl">
        <p className="text-eyebrow" style={{ color: productMeta.accentColor }}>
          {"// How we build"}
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl">
          <span className="text-display text-[var(--color-ink)]">Vibecoding with </span>
          <span className="text-display" style={{ color: productMeta.accentColor }}>
            Claude Code.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-dim)] sm:text-lg">
          Agentic engineering:{" "}
          <span className="text-[var(--color-ink)]">you are the architect and reviewer</span>,
          Claude is the primary author. It scaffolds the repo, writes the docs, builds the features,
          runs the terminal, and opens the PR — all in one session. Every line of ignaite.app was
          built this way.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
          The workflow is model- and provider-agnostic. Spend capability where judgment is hard —
          conceptualizing, hard reasoning, complex code — and reach for faster, cheaper models on
          the routine paths. Swap the models; the workflow doesn&apos;t change.
        </p>

        {/* The only manual steps. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <SetupStep n="1" title="Create an empty GitHub repo">
            A blank private repo — nothing in it yet.
          </SetupStep>
          <SetupStep n="2" title="Start a Claude Code session in it">
            Open the repo and run{" "}
            <code className="font-mono text-[var(--color-accent)]">claude</code>. Everything below
            happens in-session.
          </SetupStep>
        </div>
        <div className="mt-4 rounded-xl bg-[#050811] p-4 font-mono text-[12px] leading-relaxed ring-1 ring-white/[0.08] ring-inset">
          <span aria-hidden className="text-[var(--color-accent)]">
            ${" "}
          </span>
          <span className="break-all text-[var(--color-ink)]">
            gh repo create ignaite/app --private --clone && cd app && claude
          </span>
        </div>

        {/* The doc architecture the agent keeps. */}
        <p className="mt-12 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Claude maintains a documentation architecture as it goes
        </p>
        <div className="mt-4">
          <DocGraph />
        </div>

        <p className="mt-12 max-w-2xl text-sm text-[var(--color-ink-dim)]">
          Below: the same four stages threaded through{" "}
          <span className="text-[var(--color-ink)]">{productMeta.name}</span> —{" "}
          {productMeta.tagline.replace(/\.$/, "")}. Toggle the product and platform above to
          compare.
        </p>
      </div>
    </section>
  );
}

function SetupStep({
  n,
  title,
  children,
}: Readonly<{ n: string; title: string; children: React.ReactNode }>) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] ring-inset">
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.12] font-mono text-xs text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 ring-inset"
      >
        {n}
      </span>
      <div>
        <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">{children}</p>
      </div>
    </div>
  );
}
