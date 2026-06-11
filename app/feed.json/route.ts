import { apps } from "@/.velite";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { recentApps } from "@/lib/tools/filter-apps";

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
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
