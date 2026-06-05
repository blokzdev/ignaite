import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "github-dark-default",
          keepBackground: false,
          defaultLang: { block: "txt", inline: "txt" },
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.glitch.global" },
      { protocol: "https", hostname: "cdn.glitch.me" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
    ],
  },
  // Permanent redirects from the pre-pivot IA. The directory used to live at
  // /tools (now /) and the Blokz portfolio used to live at /apps + /apps/[slug]
  // (now consolidated into /about + /portfolio/[slug]). Permanent so the old
  // URLs preserve SEO authority across the rename.
  //
  // The /apps/:slug redirect is scoped to only the 11 legacy portfolio slugs —
  // not a blanket match — because /apps/[slug] is now an active SSG route
  // hosting the AI apps directory detail pages (chunk C). A blanket redirect
  // would intercept those before the route handler runs.
  async redirects() {
    const legacySlugs = [
      "blockchair",
      "bitcoin-explorer",
      "blockexplorer",
      "bsctrace",
      "viewblock",
      "blockscan",
      "etherscan",
      "tron-explorer",
      "slyfox",
      "blokz-oss",
      "blokz-ai-incoming",
    ].join("|");
    return [
      { source: "/tools", destination: "/", permanent: true },
      { source: "/apps", destination: "/about", permanent: true },
      // The portfolio (/portfolio/<slug>) is now dormant (unpublished while the
      // studio refocuses on the AI-apps directory). The legacy /apps/<slug>
      // explorer URLs and the /portfolio namespace both fall back to /about.
      // Non-permanent so a revived portfolio can reclaim these without penalty.
      {
        source: `/apps/:slug(${legacySlugs})`,
        destination: "/about",
        permanent: false,
      },
      { source: "/portfolio/:path*", destination: "/about", permanent: false },
      { source: "/portfolio", destination: "/about", permanent: false },
      // /workflow is dormant (unpublished, retained under app/(marketing)/_workflow).
      // Non-permanent so republishing later carries no SEO penalty — the
      // detailed agentic process now surfaces as the "How we work" band on /about.
      { source: "/workflow", destination: "/about#how-we-work", permanent: false },
      { source: "/workflow/:path*", destination: "/about", permanent: false },
    ];
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));
