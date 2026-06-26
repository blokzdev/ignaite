import { Fragment, type ReactElement } from "react";
import { CapabilityChip } from "@/components/tools/capability-chip";
import {
  type ComparisonVerdict,
  oxfordJoin,
  type VerdictAxis,
  type VerdictLean,
} from "@/lib/tools/verdict";

// Renders the "When to pick which" verdict — a deterministic, non-directive
// projection from lib/tools/verdict.ts. It never declares a winner; it states the
// verified conditions under which each app fits. Pure RSC, zero client JS.

const CARD = "rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset";

function LeanBlock({ name, lean }: Readonly<{ name: string; lean: VerdictLean }>): ReactElement {
  const labels = lean.groups.flatMap((g) => g.labels);
  const ids = lean.groups.flatMap((g) => g.ids);
  return (
    <div className={CARD}>
      <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Pick <strong className="font-medium text-[var(--color-ink)]">{name}</strong> if you need{" "}
        {oxfordJoin(labels)}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <li key={id}>
            <CapabilityChip id={id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Axes({ axes }: Readonly<{ axes: ReadonlyArray<VerdictAxis> }>): ReactElement {
  return (
    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
      {axes.map((ax) => (
        <Fragment key={ax.key}>
          <dt className="self-center font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            {ax.label}
          </dt>
          <dd className="text-[var(--color-ink-soft)]">
            {ax.a} <span className="text-[var(--color-ink-dim)]">·</span> {ax.b}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

// The signals the verdict actually compares — named in the "no difference" copy so
// the twins case stays honest about scope (it never claims unset fields "match").
const COMPARED_SIGNALS = "pricing, license, platforms, and model support";

export function ComparisonVerdict({
  verdict,
}: Readonly<{ verdict: ComparisonVerdict }>): ReactElement {
  const { aName, bName, leanA, leanB, shared, axes, shape, capabilityClaim, parityGated } = verdict;
  const axisNames = oxfordJoin(axes.map((ax) => ax.label.toLowerCase()));
  const sharedLine =
    shared.length > 0 ? (
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
        Both cover {oxfordJoin(shared.map((s) => s.label))}.
      </p>
    ) : null;

  // The honest "compare the lists above" note, shown only when a real capability
  // difference was parity-suppressed (never presents an enrichment gap as signal).
  const parityNote = parityGated ? (
    <p className="mt-3 text-[13px] leading-snug text-[var(--color-ink-dim)]">
      Their capability lists differ in recorded depth — compare the full lists above before
      deciding.
    </p>
  ) : null;

  let body: ReactElement;
  switch (shape) {
    case "lean-both":
      body = (
        <>
          {sharedLine}
          <div className="grid gap-4 sm:grid-cols-2">
            <LeanBlock name={aName} lean={leanA} />
            <LeanBlock name={bName} lean={leanB} />
          </div>
          {axes.length > 0 ? (
            <div className={`mt-4 ${CARD}`}>
              <p className="text-sm text-[var(--color-ink-soft)]">They also differ on:</p>
              <Axes axes={axes} />
            </div>
          ) : null}
        </>
      );
      break;
    case "lean-a":
    case "lean-b":
      body = (
        <>
          {sharedLine}
          <div className={axes.length > 0 ? "grid items-start gap-4 sm:grid-cols-2" : ""}>
            <LeanBlock
              name={shape === "lean-a" ? aName : bName}
              lean={shape === "lean-a" ? leanA : leanB}
            />
            {axes.length > 0 ? (
              <div className={CARD}>
                <p className="text-sm text-[var(--color-ink-soft)]">They also differ on:</p>
                <Axes axes={axes} />
              </div>
            ) : null}
          </div>
        </>
      );
      break;
    case "axes-only":
      body = (
        <div className={CARD}>
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {capabilityClaim === "same" ? (
              <>
                {aName} and {bName} cover the same capabilities. They differ on {axisNames}:
              </>
            ) : (
              <>
                Across the signals we compare, {aName} and {bName} differ on {axisNames}:
              </>
            )}
          </p>
          <Axes axes={axes} />
          {parityNote}
        </div>
      );
      break;
    default: {
      // twins — no distinguishing difference found. Stay honest about scope: name
      // the compared signals; never claim unset fields or unequal-depth caps "match".
      const tail =
        capabilityClaim === "same"
          ? ", or capabilities. Pick on team fit."
          : capabilityClaim === "differ"
            ? ". Their capability lists differ only in recorded depth — compare them above. Pick on team fit."
            : ". Pick on team fit.";
      body = (
        <div className={CARD}>
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
            We found no distinguishing difference between {aName} and {bName} on the signals we
            track — {COMPARED_SIGNALS}
            {tail}
          </p>
        </div>
      );
    }
  }

  return (
    <section className="mt-12" aria-labelledby="verdict-heading">
      <h2
        id="verdict-heading"
        className="text-eyebrow mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
      >
        When to pick which
      </h2>
      {body}
    </section>
  );
}
