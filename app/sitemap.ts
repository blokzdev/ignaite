import type { MetadataRoute } from "next";
import { apps } from "@/.velite";
import { siteUrl } from "@/lib/seo";
import { activeCategoryApps, categoryLastVerified } from "@/lib/tools/category-stats";
import { comparisonHref, comparisonPairs } from "@/lib/tools/comparisons";
import { categoryHref } from "@/lib/tools/facet-links";
import { APP_CATEGORIES } from "@/types/app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
  // Category landing pages — freshness from the newest lastVerifiedAt among the
  // category's active apps (the weekly audit routine keeps these moving).
  const categoryRoutes: MetadataRoute.Sitemap = APP_CATEGORIES.filter(
    (c) => activeCategoryApps(c).length > 0,
  ).map((c) => ({
    url: `${siteUrl}${categoryHref(c)}`,
    lastModified: categoryLastVerified(c) ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const appRoutes: MetadataRoute.Sitemap = apps.map((a) => ({
    url: `${siteUrl}/apps/${a.slug}`,
    lastModified: a.lastVerifiedAt ? new Date(a.lastVerifiedAt) : now,
    changeFrequency: "monthly",
    // Featured entries get a slight SEO bump; archived entries get demoted.
    priority: a.status === "archived" ? 0.4 : a.featured ? 0.75 : 0.65,
  }));
  // Comparison pages — one per curated head-to-head (the indexed
  // `alternatives`-graph cohort). A build-time projection over two live listings;
  // freshness is the newer of the two apps' lastVerifiedAt stamps.
  const compareRoutes: MetadataRoute.Sitemap = comparisonPairs().map((p) => {
    const stamps = [p.a.lastVerifiedAt, p.b.lastVerifiedAt].filter((d): d is string => !!d);
    const latest = stamps.length ? stamps.sort().at(-1)! : null;
    return {
      url: `${siteUrl}${comparisonHref(p.a.slug, p.b.slug)}`,
      lastModified: latest ? new Date(latest) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });
  // Portfolio (/portfolio/<slug>) is dormant — unpublished while the studio
  // refocuses on the AI-apps directory. Re-add when it's revived.
  return [...staticRoutes, ...categoryRoutes, ...appRoutes, ...compareRoutes];
}
