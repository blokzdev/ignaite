// lib/tools/recipe-graph.ts
// PURE helper (no @/.velite import → safe on any build path): derive a recipe's
// deterministic EXECUTION ORDER from its optional step graph (Chunk AG).
//
// A recipe's steps[] is linear-by-array-order by default; when steps carry `id` +
// `dependsOn` it's a DAG (parallel branches + fan-in) and `loop` adds a back-edge.
// This function is the SINGLE source of execution order for everything that must
// agree — the on-page flow (<ol>), the HowTo JSON-LD linearization, the flow-view
// rank grouping, and the machine surfaces (feed.json / llms-full.txt).
//
// Two load-bearing guarantees:
//   1. ZERO MIGRATION — if NO step carries `id`/`dependsOn`, it returns the steps in
//      array order untouched (`rank = order = arrayIndex`). The 4 pre-AG recipes hit
//      this fast path and render byte-for-byte as before.
//   2. DETERMINISM — graph mode orders by (rank, arrayIndex), and `rank` is the
//      longest-path depth computed by a Kahn pass. The arrayIndex tie-break makes the
//      order STABLE build-to-build, so HowTo `position` numbers + `#step-N` anchors
//      never churn. `loop` is NOT a dependency edge (it's a back-edge), so it never
//      affects the forward order — the loop is rendered as an annotation, not a step.
import type { Recipe, RecipeStep } from "@/types/recipe";

export interface OrderedStep {
  step: RecipeStep;
  /** 0-based position in the original steps[] array (stable identity / dedupe key). */
  arrayIndex: number;
  /** 0-based execution position after topological ordering. */
  order: number;
  /** Topological depth (longest path from a root). Steps sharing a rank can run in
   *  parallel — the flow view groups them into one "lane". */
  rank: number;
}

const hasGraph = (steps: ReadonlyArray<RecipeStep>): boolean =>
  steps.some((s) => s.id !== undefined || (s.dependsOn?.length ?? 0) > 0);

export function recipeExecutionOrder(recipe: Recipe): OrderedStep[] {
  const steps = recipe.steps;
  // Fast path: a linear recipe (no graph fields) keeps array order exactly.
  if (!hasGraph(steps)) {
    return steps.map((step, i) => ({ step, arrayIndex: i, order: i, rank: i }));
  }

  // Build dependency edges from `dependsOn` only (loop back-edges are excluded).
  const indexById = new Map<string, number>();
  steps.forEach((s, i) => {
    if (s.id !== undefined) indexById.set(s.id, i);
  });
  const inDeg = steps.map(() => 0);
  const adj: number[][] = steps.map(() => []);
  steps.forEach((s, i) => {
    for (const dep of s.dependsOn ?? []) {
      const from = indexById.get(dep);
      if (from === undefined || from === i) continue; // velite guarantees existence; defensive
      adj[from].push(i);
      inDeg[i] += 1;
    }
  });

  // Kahn pass → longest-path rank per node. Process ready nodes in ascending array
  // index so ranks are assigned deterministically (the order itself is derived below).
  const rank = steps.map(() => 0);
  const work = inDeg.slice();
  const ready: number[] = steps.map((_, i) => i).filter((i) => work[i] === 0);
  while (ready.length) {
    ready.sort((a, b) => a - b);
    const i = ready.shift()!;
    for (const j of adj[i]) {
      rank[j] = Math.max(rank[j], rank[i] + 1);
      if (--work[j] === 0) ready.push(j);
    }
  }

  // Execution order = (rank asc, then arrayIndex asc) — a valid, deterministic
  // topological order that also groups same-rank (parallel) steps adjacently. An
  // accidental dependsOn cycle (velite hard-fails it) would leave a node at rank 0;
  // every step is still included here, so the renderer never silently drops one.
  const indices = steps.map((_, i) => i).sort((a, b) => rank[a] - rank[b] || a - b);
  return indices.map((i, pos) => ({ step: steps[i], arrayIndex: i, order: pos, rank: rank[i] }));
}

/** Execution-order index (0-based) per step `id` — used to resolve a `loop.backTo`
 *  reference to its rendered step number, and to validate "loop points earlier". */
export function executionIndexById(ordered: ReadonlyArray<OrderedStep>): Map<string, number> {
  const m = new Map<string, number>();
  ordered.forEach((o) => {
    if (o.step.id !== undefined) m.set(o.step.id, o.order);
  });
  return m;
}
