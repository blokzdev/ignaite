import type { Metadata } from "next";
import { brand } from "@/data/brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ignaite.app";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description = brand.positioning,
  path = "/",
  ogImage,
}: BuildMetadataInput = {}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const fullTitle = title ? `${title} — ${brand.name}` : `${brand.name} — ${brand.tagline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    applicationName: brand.legalName,
    authors: [{ name: brand.legalName, url: siteUrl }],
    keywords: [
      "Ignaite",
      "AI apps directory",
      "AI tools directory",
      "AI app discovery",
      "AI-managed directory",
      "AI agents",
      "MCP servers",
      "AI coding tools",
      "vector databases",
      "open source AI",
      "Claude Code",
      "agentic engineering",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: brand.name,
      type: "website",
      // Only set images explicitly when a caller passes one. Emitting
      // `images: undefined` would suppress Next's colocated
      // `opengraph-image.tsx` file convention, leaving every route with no
      // `og:image` (text-only social cards). Omitting the key lets the file
      // convention populate it; per-route cards (e.g. /apps/[slug]) still win.
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    appleWebApp: { capable: true, title: brand.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
  };
}

export { siteUrl };
