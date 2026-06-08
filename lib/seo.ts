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
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export { siteUrl };
