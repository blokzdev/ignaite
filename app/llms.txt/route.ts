import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { CATEGORY_CLUSTERS, CATEGORY_DESCRIPTION } from "@/lib/tools/category-meta";
import { activeCountByCategory } from "@/lib/tools/category-stats";
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

  const body = `# ${brand.name}

> ${brand.tagline}

${brand.positioning}

Every listing is a structured record: category, pricing, license signal, platforms,
deployment, model support, an honest pros/cons brief, and a dated change history —
re-verified on a weekly audit cycle.

## Categories

${clusters.join("\n\n")}

## Machine surfaces

- [Full listing index](${siteUrl}/llms-full.txt): every app, one line each
- [JSON Feed](${siteUrl}/feed.json): the 50 newest listings
- [Sitemap](${siteUrl}/sitemap.xml)

## Pages

- [Directory](${siteUrl}/): browse, search, and filter all listings
- [All categories](${siteUrl}/categories)
- [About](${siteUrl}/about): how the AI-managed directory works
- [Contact](${siteUrl}/contact)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
