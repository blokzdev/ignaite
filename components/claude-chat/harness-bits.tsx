import { Square } from "lucide-react";

// A plan-mode checklist (upcoming tasks). Shared by the workflow intro and the
// PlanBlock tool-use renderer.
export function PlanChecklist({ items }: Readonly<{ items: ReadonlyArray<string> }>) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-[13px] text-[var(--color-ink)]">
          <Square aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// The documentation architecture (7-doc system, condensed) — what the agent
// maintains alongside the code. From the vibecoding harness reference.
const DOCS: ReadonlyArray<{ doc: string; owns: string; tense: string }> = [
  { doc: "PRD", owns: "Product surface — vision, audience, scope", tense: "Aspirational" },
  { doc: "SPEC", owns: "Behavioral contracts — schemas, APIs, states", tense: "Prescriptive" },
  { doc: "ROADMAP", owns: "Sequencing — milestones, stages, tasks", tense: "Forward" },
  { doc: "BACKLOG", owns: "Deferred work with revisit triggers", tense: "Forward" },
  { doc: "CLAUDE.md", owns: "Operating manual + code reality today", tense: "Descriptive" },
];

export function DocGraph() {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-white/[0.08] ring-inset">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {["Doc", "Owns", "Tense"].map((h) => (
              <th
                key={h}
                className="border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOCS.map((d) => (
            <tr key={d.doc}>
              <td className="border-b border-white/[0.04] px-4 py-2.5 align-top font-mono text-xs text-[var(--color-accent)]">
                {d.doc}
              </td>
              <td className="border-b border-white/[0.04] px-4 py-2.5 align-top text-[13px] text-[var(--color-ink)]">
                {d.owns}
              </td>
              <td className="border-b border-white/[0.04] px-4 py-2.5 align-top font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-dim)]">
                {d.tense}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
