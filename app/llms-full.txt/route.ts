import { apps } from "@/.velite";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { CAPABILITY_FAMILY_LABEL } from "@/lib/tools/capability-families";
import { capabilityIndex } from "@/lib/tools/capability-stats";
import { APP_CATEGORIES } from "@/types/app";
import { PRICING_LABEL } from "@/lib/tools/app-labels";

// /llms-full.txt — the exhaustive LLM-facing index: one line per listing,
// grouped by category in enum order. Build-generated from the Velite data
// (force-static), never hand-maintained. The compact orientation file is
// /llms.txt.
export const dynamic = "force-static";

export function GET(): Response {
  const sections = APP_CATEGORIES.map((category) => {
    const entries = apps
      .filter((a) => a.category === category)
      .sort((a, b) => b.addedSeq - a.addedSeq)
      .map((a) => {
        const archived = (a.status ?? "active") === "archived" ? " [ARCHIVED]" : "";
        return `- [${a.name}](${siteUrl}/apps/${a.slug})${archived} — ${a.tagline} (${PRICING_LABEL[a.pricing]})`;
      });
    if (entries.length === 0) return null;
    return `## ${CATEGORY_LABEL[category]}\n\n${entries.join("\n")}`;
  }).filter(Boolean);

  // Capability → app-slug reverse index (the WHAT axis), grouped by family in
  // canonical order. The leaf id leads each bullet as the machine key.
  const capIndex = capabilityIndex(apps);
  const usedLeaves = [...capIndex.values()].reduce((n, leaves) => n + leaves.length, 0);
  const capSections = [...capIndex.entries()].map(([family, leaves]) => {
    const lines = leaves.map(
      (l) => `- ${l.id} — ${l.label} (${l.count} apps): ${l.slugs.join(", ")}`,
    );
    return `### ${CAPABILITY_FAMILY_LABEL[family]}\n\n${lines.join("\n")}`;
  });
  const capabilitySection = `## Capabilities (task index)

Each app carries up to 6 task capabilities (the WHAT — finer than category, and may
cross it). ${usedLeaves} capabilities across ${capIndex.size} families; an app is
listed under every capability it carries.

${capSections.join("\n\n")}`;

  const body = `# ${brand.name} — all listings

> ${brand.tagline}

${apps.length} listings. Each links to a detail page carrying the full structured
record: description, pricing, license signal, platforms, deployment, model support,
task capabilities, pros/cons, alternatives, references, and a dated change history.

${sections.join("\n\n")}

${capabilitySection}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
