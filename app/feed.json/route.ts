import { apps } from "@/.velite";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { capabilityList } from "@/lib/tools/capability-stats";
import { recentApps } from "@/lib/tools/filter-apps";
import { listRecipes } from "@/lib/recipes";

// /feed.json — JSON Feed 1.1 (jsonfeed.org) of the 50 newest active listings,
// in accession (addedSeq) order: the subscribe surface for the weekly
// discovery routine's output. Prerendered at build (force-static), regenerates
// on every deploy. Discoverable via the <link rel="alternate"> that
// buildMetadata() emits on every route.
export const dynamic = "force-static";

const FEED_SIZE = 50;

export function GET(): Response {
  const items = recentApps(apps, FEED_SIZE).map((a) => {
    const url = `${siteUrl}/apps/${a.slug}`;
    return {
      id: url,
      url,
      title: a.name,
      content_text: a.insight ? `${a.tagline} Worth knowing: ${a.insight}` : a.tagline,
      tags: [CATEGORY_LABEL[a.category], ...(a.tags ?? [])],
      // JSON Feed wants RFC 3339; addedAt is day-granular — skip when absent
      // rather than fabricate.
      ...(a.addedAt ? { date_published: `${a.addedAt}T00:00:00Z` } : {}),
    };
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${brand.name} — newest AI apps`,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: brand.tagline,
    icon: `${siteUrl}/apple-icon`,
    favicon: `${siteUrl}/icon.svg`,
    language: "en",
    items,
    // JSON-Feed extension (consumers ignore unknown `_`-prefixed keys): the full
    // capability → app-slug index (the WHAT axis, all leaves, desc by count) so an
    // agent can resolve "apps that do X" in one fetch, plus the curated recipe
    // graph (ordered app chains). `items` stays the newest-50 subscribe surface.
    _ignaite: {
      capabilities: capabilityList(apps),
      // Curated workflows over listed apps — the agent-facing graph payload
      // (ordered steps, each an app + the capability it performs). Build-resolved.
      recipes: listRecipes({ includeStale: true }).map((r) => ({
        slug: r.slug,
        url: `${siteUrl}/recipes/${r.slug}`,
        title: r.title,
        goal: r.goal,
        audience: r.audience,
        ...((r.status ?? "active") !== "active" ? { status: r.status } : {}),
        // The graph fields (Chunk AG) ride along so an agent can reconstruct the
        // DAG: id + dependsOn (parallel/fan-in) + loop (iteration). Linear recipes
        // emit none of these → the payload is unchanged for them.
        steps: r.steps.map((s) => ({
          appSlug: s.appSlug,
          ...(s.capability ? { capability: s.capability } : {}),
          action: s.action,
          ...(s.id ? { id: s.id } : {}),
          ...(s.dependsOn?.length ? { dependsOn: s.dependsOn } : {}),
          ...(s.loop ? { loop: s.loop } : {}),
        })),
      })),
    },
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
