// TODO(user): rewrite copy to your voice before launch — tracked in BACKLOG.md.
// Keep `body` ≤ 2 short sentences; the magazine grid in
// components/manifesto/manifesto.tsx handles ≤ 7 principles automatically.

export interface Principle {
  id: string;
  number: string;
  title: string;
  body: string;
}

export const principles: ReadonlyArray<Principle> = [
  {
    id: "comprehensive",
    number: "01",
    title: "Comprehensive, not thin.",
    body: "A directory earns trust by breadth. We list the whole field — category leaders and quiet standouts alike — not a sponsored shortlist.",
  },
  {
    id: "no-fabrication",
    number: "02",
    title: "No fabrication.",
    body: "Every field is verified against the app's own source. If a fact can't be confirmed, it doesn't ship — a blank beats a guess.",
  },
  {
    id: "signal",
    number: "03",
    title: "Signal on every line.",
    body: "Listings surface a one-sentence fact worth knowing — the non-obvious thing the marketing page won't tell you, never a re-pitch of the tagline.",
  },
  {
    id: "honest-openness",
    number: "04",
    title: "Honest about openness.",
    body: "Open source, open core, or proprietary — and the licensing nuance behind it — stated plainly, never blurred to flatter a tool.",
  },
  {
    id: "always-current",
    number: "05",
    title: "Always current.",
    body: "An AI directory that goes stale is worse than none. Scheduled routines re-audit the catalog every week so it stays alive.",
  },
];
