import { Fragment, type ReactElement } from "react";
import { CapabilityChip } from "@/components/tools/capability-chip";
import {
  type ComparisonVerdict,
  oxfordJoin,
  type VerdictAxis,
  type VerdictFocusLeaf,
  type VerdictLean,
} from "@/lib/tools/verdict";

// Renders the "When to pick which" verdict — a deterministic, non-directive
// projection from lib/tools/verdict.ts. It never declares a winner; it states the
// verified conditions under which each app fits. Pure RSC, zero client JS.

const CARD = "rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset";

function LeanBlock({ name, lean }: Readonly<{ name: string; lean: VerdictLean }>): ReactElement {
  const labels = lean.groups.flatMap((g) => g.labels);
  // Flatten ids + their levels in lockstep — the engine orders each group primary-first.
  const leaves = lean.groups.flatMap((g) => g.ids.map((id, i) => ({ id, level: g.levels[i] })));
  return (
    <div className={CARD}>
      <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Pick <strong className="font-medium text-[var(--color-ink)]">{name}</strong> if you need{" "}
        {oxfordJoin(labels)}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {leaves.map(({ id, level }) => (
          <li key={id}>
            <CapabilityChip id={id} level={level} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// AF-3b — one side of the "different focus" signal: shared capabilities this app is
// built AROUND (primary) that the other treats as secondary. Rendered as primary
// chips, so the emphasis reads visually as well as in prose.
function FocusSide({
  name,
  leaves,
}: Readonly<{ name: string; leaves: ReadonlyArray<VerdictFocusLeaf> }>): ReactElement | null {
  if (leaves.length === 0) return null;
  return (
    <div className={CARD}>
      <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
        <strong className="font-medium text-[var(--color-ink)]">{name}</strong> is built around{" "}
        {oxfordJoin(leaves.map((l) => l.label))}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {leaves.map((l) => (
          <li key={l.id}>
            <CapabilityChip id={l.id} level="primary" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusBlock({
  aName,
  bName,
  focusA,
  focusB,
  sameSet,
}: Readonly<{
  aName: string;
  bName: string;
  focusA: ReadonlyArray<VerdictFocusLeaf>;
  focusB: ReadonlyArray<VerdictFocusLeaf>;
  sameSet: boolean;
}>): ReactElement {
  // SYMMETRIC — BOTH apps lead with a shared capability the other keeps secondary.
  // Only here is the "each leads with different ones" framing accurate.
  if (focusA.length > 0 && focusB.length > 0) {
    return (
      <div>
        <p className="mb-3 text-sm text-[var(--color-ink-soft)]">
          {sameSet ? (
            <>
              {aName} and {bName} cover the same capabilities, but lead with different ones:
            </>
          ) : (
            <>They share capabilities, but each leads with different ones as a headline job:</>
          )}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FocusSide name={aName} leaves={focusA} />
          <FocusSide name={bName} leaves={focusB} />
        </div>
      </div>
    );
  }
  // ASYMMETRIC — exactly ONE app leads with a shared capability the other keeps
  // secondary. Describe ONLY that app's emphasis (never imply "each"); the other's
  // secondary level is a recorded fact, not an absence (Guardrail #2). One full-width
  // statement + chips, so there's no lopsided single card in a 2-col grid.
  const leadsA = focusA.length > 0;
  const leadName = leadsA ? aName : bName;
  const otherName = leadsA ? bName : aName;
  const leaves = leadsA ? focusA : focusB;
  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
        <strong className="font-medium text-[var(--color-ink)]">{leadName}</strong> leans on{" "}
        {oxfordJoin(leaves.map((l) => l.label))} as a headline capability; {otherName} treats{" "}
        {leaves.length > 1 ? "them" : "it"} as secondary.
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {leaves.map((l) => (
          <li key={l.id}>
            <CapabilityChip id={l.id} level="primary" />
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
  const {
    aName,
    bName,
    leanA,
    leanB,
    shared,
    focusA,
    focusB,
    axes,
    shape,
    capabilityClaim,
    parityGated,
  } = verdict;
  const axisNames = oxfordJoin(axes.map((ax) => ax.label.toLowerCase()));
  const hasFocus = focusA.length > 0 || focusB.length > 0;
  const sharedLine =
    shared.length > 0 ? (
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
        Both cover {oxfordJoin(shared.map((s) => s.label))}.
      </p>
    ) : null;

  // Shown alongside the unique-cap leans (shapes lean-*) when shared leaves also
  // diverge in focus — supplementary there, the main body in shape "focus".
  const focusBlock = hasFocus ? (
    <div className={`mt-4 ${CARD}`}>
      <FocusBlock aName={aName} bName={bName} focusA={focusA} focusB={focusB} sameSet={false} />
    </div>
  ) : null;

  const axesCard =
    axes.length > 0 ? (
      <div className={`mt-4 ${CARD}`}>
        <p className="text-sm text-[var(--color-ink-soft)]">They also differ on:</p>
        <Axes axes={axes} />
      </div>
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
          {focusBlock}
          {axesCard}
        </>
      );
      break;
    case "lean-a":
    case "lean-b":
      body = (
        <>
          {sharedLine}
          <div
            className={axes.length > 0 && !hasFocus ? "grid items-start gap-4 sm:grid-cols-2" : ""}
          >
            <LeanBlock
              name={shape === "lean-a" ? aName : bName}
              lean={shape === "lean-a" ? leanA : leanB}
            />
            {/* When focus is also present, axes drop below it (full width) rather than
                pairing beside the single lean — keeps the reading order leans→focus→axes. */}
            {axes.length > 0 && !hasFocus ? (
              <div className={CARD}>
                <p className="text-sm text-[var(--color-ink-soft)]">They also differ on:</p>
                <Axes axes={axes} />
              </div>
            ) : null}
          </div>
          {focusBlock}
          {hasFocus ? axesCard : null}
        </>
      );
      break;
    case "focus":
      // No unique-cap lean survived (identical sets, or parity-gated), but the apps
      // weight their shared capabilities differently — the level-derived verdict.
      body = (
        <>
          <div className={CARD}>
            <FocusBlock
              aName={aName}
              bName={bName}
              focusA={focusA}
              focusB={focusB}
              sameSet={capabilityClaim === "same"}
            />
          </div>
          {axesCard}
          {parityNote}
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
