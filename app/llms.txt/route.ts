import { apps } from "@/.velite";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { CATEGORY_CLUSTERS, CATEGORY_DESCRIPTION } from "@/lib/tools/category-meta";
import { CAPABILITY_FAMILY_LABEL } from "@/lib/tools/capability-families";
import { activeCountByCategory } from "@/lib/tools/category-stats";
import { capabilityFamilyTotals, capabilityIndex } from "@/lib/tools/capability-stats";
import { listRecipes } from "@/lib/recipes";
import { categoryHref } from "@/lib/tools/facet-links";

// /llms.txt (llmstxt.org) — the compact LLM-facing index: what this site is,
// how it's organized, and where the machine surfaces live. Prerendered at
// build (force-static + no request access), so it regenerates with every
// deploy and is never hand-maintained. The exhaustive per-listing index is
// /llms-full.txt.
export const dynamic = "force-static";

export function GET(): Response {
  const counts = activeCountByCategory();

  const clusters = CATEGORY_CLUSTERS.map((cluster) => {
    const lines = cluster.categories
      .filter((c) => (counts.get(c) ?? 0) > 0)
      .map(
        (c) =>
          `- [${CATEGORY_LABEL[c]}](${siteUrl}${categoryHref(c)}) (${counts.get(c)} apps): ${CATEGORY_DESCRIPTION[c]}`,
      );
    return `### ${cluster.label} — ${cluster.blurb}\n\n${lines.join("\n")}`;
  });

  // Compact capability summary: the 14 families with assignment counts + a few
  // example leaves each. The exhaustive capability → app-slug index is llms-full.txt.
  const capIndex = capabilityIndex(apps);
  const usedLeaves = [...capIndex.values()].reduce((n, leaves) => n + leaves.length, 0);
  const capLines = capabilityFamilyTotals(apps).map(({ family, count }) => {
    const examples = (capIndex.get(family) ?? []).slice(0, 4).map((l) => l.label);
    return `- ${CAPABILITY_FAMILY_LABEL[family]} (${count}): ${examples.join(", ")}`;
  });

  // Curated recipes — one bullet each; the linearized walkthroughs live in
  // llms-full.txt.
  const recipes = listRecipes({ includeStale: true });
  const recipeLines = recipes.map(
    (r) => `- [${r.title}](${siteUrl}/recipes/${r.slug}) — ${r.goal}`,
  );

  const body = `# ${brand.name}

> ${brand.tagline}

${brand.positioning}

Every listing is a structured record: category, pricing, license signal, platforms,
deployment, model support, task capabilities, an honest pros/cons brief, and a dated
change history — re-verified on a weekly audit cycle.

## Categories

${clusters.join("\n\n")}

## Capabilities

Task axis (the WHAT) — finer than category, and may cross it. ${usedLeaves} capabilities in ${capIndex.size} families. Full capability → app-slug index: ${siteUrl}/llms-full.txt

${capLines.join("\n")}

## Recipes (workflows)

Curated, verified workflows over listed apps — ordered chains that take one real job
from raw input to finished output. Each step is a listed app performing a named
capability. Full linearized walkthroughs (steps + references): ${siteUrl}/llms-full.txt

${recipeLines.join("\n")}

## Machine surfaces

- [Full listing index](${siteUrl}/llms-full.txt): every app, one line each
- [JSON Feed](${siteUrl}/feed.json): the 50 newest listings + the capability & recipe graph
- [Sitemap](${siteUrl}/sitemap.xml)

## Pages

- [Directory](${siteUrl}/): browse, search, and filter all listings
- [Recipes](${siteUrl}/recipes): curated multi-app workflows
- [All categories](${siteUrl}/categories)
- [About](${siteUrl}/about): how the AI-managed directory works
- [Contact](${siteUrl}/contact)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
