import type { MetadataRoute } from "next";
import { apps } from "@/data/apps";
import { projects } from "@/data/projects";
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
    // Marked entries (Blokz-vetted/deployed/contributing) get a slight SEO
    // bump; archived entries get demoted.
    priority: a.status === "archived" ? 0.4 : a.blokzMark ? 0.75 : 0.65,
  }));
  const portfolioRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...appRoutes, ...portfolioRoutes];
}
