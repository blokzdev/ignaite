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

// Content-Security-Policy, composed per-directive for readability. Constraints
// that shape it:
//   • Fully SSG site → no per-request nonces are possible, so script-src needs
//     'unsafe-inline' (Next's hydration/RSC-payload inline scripts) — the
//     standard posture for static Next sites.
//   • style-src 'unsafe-inline': React style={{}} attributes (accent gradients,
//     noise overlay) + next/font's injected <style> are blocked without it.
//   • img-src data:: the noise overlay's CSS url("data:image/svg+xml…")
//     background. No remote image hosts — the live site self-hosts everything
//     (the old glitch/play-lh remotePatterns served only the removed portfolio).
//   • Vercel analytics + speed-insights: production loads/beacons SAME-ORIGIN
//     (/_vercel/insights/*, /_vercel/speed-insights/*) → covered by 'self'.
//     va.vercel-scripts.com (dev/proxy scripts) + vitals.vercel-insights.com
//     (older-package beacon fallback) are allowed in all envs — harmless, and
//     they keep package upgrades from silently breaking telemetry.
//   • Dev needs 'unsafe-eval' (Turbopack/react-refresh); preview deployments
//     need vercel.live (toolbar) + its Pusher websocket. Both branch on env at
//     config-evaluation time — prod stays tight.
const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com` +
    (isDev ? " 'unsafe-eval'" : "") +
    (isPreview ? " https://vercel.live" : ""),
  `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com` +
    (isPreview ? " https://vercel.live wss://*.pusher.com" : ""),
  `style-src 'self' 'unsafe-inline'` + (isPreview ? " https://vercel.live" : ""),
  `img-src 'self' data:`,
  `font-src 'self'` + (isPreview ? " https://vercel.live" : ""),
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  `worker-src 'self'`,
  `manifest-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Share links already open with rel="noopener"; nothing needs a cross-origin
  // opener relationship, so the strictest value is free.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // No remotePatterns: every live image is self-hosted/code-generated. The
    // removed portfolio's glitch/play-lh hosts went with it (Chunk V) — re-add
    // alongside a revival.
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
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
      // The portfolio code was REMOVED in Chunk V (restore from git history —
      // see BACKLOG). The legacy /apps/<slug> explorer URLs and the /portfolio
      // namespace still get inbound traffic, so both fall back to /about.
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
      // "Browser Ext." was retired as a CATEGORY — it described delivery, not
      // kind, and duplicated the browser-extension PLATFORM facet. Its members
      // were re-homed to real categories; extensions stay browsable via
      // /?platform=browser-extension. Permanent — the category is gone for good.
      { source: "/category/browser-extension", destination: "/categories", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));
