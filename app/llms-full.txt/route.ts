import { apps } from "@/.velite";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
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

  const body = `# ${brand.name} — all listings

> ${brand.tagline}

${apps.length} listings. Each links to a detail page carrying the full structured
record: description, pricing, license signal, platforms, deployment, model support,
pros/cons, alternatives, references, and a dated change history.

${sections.join("\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
