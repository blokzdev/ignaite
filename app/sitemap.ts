import type { MetadataRoute } from "next";
import { apps } from "@/data/apps";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
  const appRoutes: MetadataRoute.Sitemap = apps.map((a) => ({
    url: `${siteUrl}/apps/${a.slug}`,
    lastModified: a.lastVerifiedAt ? new Date(a.lastVerifiedAt) : now,
    changeFrequency: "monthly",
    // Featured entries get a slight SEO bump; archived entries get demoted.
    priority: a.status === "archived" ? 0.4 : a.featured ? 0.75 : 0.65,
  }));
  // Portfolio (/portfolio/<slug>) is dormant — unpublished while the studio
  // refocuses on the AI-apps directory. Re-add when it's revived.
  return [...staticRoutes, ...appRoutes];
}
