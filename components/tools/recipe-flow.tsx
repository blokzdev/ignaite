import Link from "next/link";
import type { ReactElement } from "react";
import { ChevronDown, GitBranch, GitMerge, Repeat, Replace } from "lucide-react";
import { CapabilityChip } from "@/components/tools/capability-chip";
import { getApp } from "@/lib/apps";
import {
  executionIndexById,
  recipeExecutionOrder,
  type OrderedStep,
} from "@/lib/tools/recipe-graph";
import {
  substituteCount,
  substitutesForStep,
  type Substitute,
} from "@/lib/tools/recipe-substitution";
import type { AppCapability } from "@/types/app";
import type { Recipe } from "@/types/recipe";

// The recipe step walkthrough as a pure-CSS FLOW (Chunk AG). It IS a semantic
// ordered list rendered in deterministic execution (topological) order — the
// reading order screen-reader and reduced-motion users get — with three layered,
// honest graph cues:
//   • same-rank steps group into one "In parallel" lane (side-by-side on sm+),
//   • a fan-in step shows "Converges · combines X + Y",
//   • a loop step shows "↻ Repeat from step N until <until>".
// No client JS, no graph dep — the route stays 0 B route JS (an interactive graph
// view is a BACKLOG'd react-flow/mermaid follow-up; this CSS view is its fallback).
// A recipe with no graph fields renders exactly like the pre-AG linear list.
export function RecipeFlow({ recipe }: Readonly<{ recipe: Recipe }>): ReactElement {
  const ordered = recipeExecutionOrder(recipe);
  const posById = executionIndexById(ordered); // step id → 0-based execution index
  const stepById = new Map(recipe.steps.map((s) => [s.id, s] as const));
  const nameOf = (slug: string) => getApp(slug)?.name ?? slug;
  const depName = (id: string) => {
    const s = stepById.get(id);
    return s ? nameOf(s.appSlug) : id;
  };

  // Group consecutive same-rank steps into lanes; a lane with >1 step is parallel.
  const lanes: OrderedStep[][] = [];
  for (const o of ordered) {
    const last = lanes.at(-1);
    if (last && last[0].rank === o.rank) last.push(o);
    else lanes.push([o]);
  }

  return (
    <ol className="list-none space-y-8">
      {lanes.map((lane, li) =>
        lane.length === 1 ? (
          <li key={lane[0].arrayIndex} id={`step-${lane[0].order + 1}`} className="scroll-mt-32">
            <StepBlock o={lane[0]} depName={depName} posById={posById} />
          </li>
        ) : (
          <li
            key={`lane-${li}`}
            aria-label={`Steps ${lane[0].order + 1}–${lane[lane.length - 1].order + 1} run in parallel`}
            className="rounded-2xl bg-[var(--color-accent)]/[0.03] p-4 ring-1 ring-[var(--color-accent)]/15 ring-inset sm:p-5"
          >
            <p className="mb-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--color-accent)] uppercase">
              <GitBranch aria-hidden className="h-3.5 w-3.5" />
              In parallel
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {lane.map((o) => (
                <div key={o.arrayIndex} id={`step-${o.order + 1}`} className="scroll-mt-32">
                  <StepBlock o={o} depName={depName} posById={posById} />
                </div>
              ))}
            </div>
          </li>
        ),
      )}
    </ol>
  );
}

function StepBlock({
  o,
  depName,
  posById,
}: Readonly<{
  o: OrderedStep;
  depName: (id: string) => string;
  posById: Map<string, number>;
}>): ReactElement {
  const { step } = o;
  const app = getApp(step.appSlug);
  const fanIn = (step.dependsOn?.length ?? 0) >= 2;

  return (
    <div className="flex gap-4">
      <div
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.10] font-mono text-sm font-medium text-[var(--color-accent)]"
      >
        {o.order + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {app ? (
            <Link
              href={`/apps/${app.slug}`}
              className="rounded text-base font-medium text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              {app.name}
            </Link>
          ) : (
            <span className="text-base font-medium text-[var(--color-ink)]">{step.appSlug}</span>
          )}
          {step.capability ? <CapabilityChip id={step.capability} /> : null}
        </div>
        {fanIn ? (
          <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            <GitMerge aria-hidden className="h-3.5 w-3.5" />
            Converges · combines {step.dependsOn!.map(depName).join(" + ")}
          </p>
        ) : null}
        <p className="text-sm leading-relaxed text-[var(--color-ink)]">{step.action}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-dim)] italic">
          {step.rationale}
        </p>
        {step.loop ? (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-violet)]/[0.10] px-3 py-1.5 text-[12px] text-[var(--color-violet)] ring-1 ring-[var(--color-violet)]/25 ring-inset">
            <Repeat aria-hidden className="h-3.5 w-3.5 shrink-0" />
            Repeat from step {(posById.get(step.loop.backTo) ?? 0) + 1} until {step.loop.until}
          </p>
        ) : null}
        {step.capability ? <SwapRail appSlug={step.appSlug} capability={step.capability} /> : null}
      </div>
    </div>
  );
}

// The "Swap this step" rail (Chunk AF) — listed alternatives that cover the same
// capability, ranked cheaper/opener/simpler by the deterministic substitution
// engine. Collapsed by default (native <details>, 0 B JS) to keep the walkthrough
// clean; renders nothing when no other listed app covers the capability.
function SwapRail({
  appSlug,
  capability,
}: Readonly<{ appSlug: string; capability: AppCapability }>): ReactElement | null {
  const subs = substitutesForStep(appSlug, capability, 5);
  if (subs.length === 0) return null;
  const total = substituteCount(appSlug, capability);

  return (
    <details className="group mt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none">
        <Replace aria-hidden className="h-3.5 w-3.5" />
        Swap this step
        <span className="text-[var(--color-ink-dim)]/70">({total})</span>
        <ChevronDown aria-hidden className="h-3 w-3 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mt-2.5 flex flex-col gap-2 border-l border-white/[0.08] pl-3.5">
        {subs.map((s) => (
          <SubstituteRow key={s.app.slug} sub={s} />
        ))}
      </ul>
      <p className="mt-2 pl-3.5 font-mono text-[10px] text-[var(--color-ink-dim)]">
        {total > subs.length ? `Top ${subs.length} of ${total} · ` : ""}ranked by license, cost, and
        platform footprint
      </p>
    </details>
  );
}

function SubstituteRow({ sub }: Readonly<{ sub: Substitute }>): ReactElement {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <Link
        href={`/apps/${sub.app.slug}`}
        className="rounded text-sm text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        {sub.app.name}
      </Link>
      {sub.reasons.length > 0 ? (
        <span className="font-mono text-[11px] text-[var(--color-ink-dim)]">
          {sub.reasons.join(" · ")}
        </span>
      ) : null}
      {sub.fit === "primary" ? (
        <span className="rounded-full bg-[var(--color-success)]/[0.12] px-1.5 py-0.5 text-[10px] text-[var(--color-success)]">
          best for this
        </span>
      ) : sub.fit === "secondary" ? (
        <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-[var(--color-ink-dim)]">
          can also do this
        </span>
      ) : null}
    </li>
  );
}
