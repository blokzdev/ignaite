import type { Metadata } from "next";
import { Suspense } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolGrid } from "@/components/tools/tool-grid";
import { ToolsBrowser } from "@/components/tools/tools-browser";
import { brand } from "@/data/brand";
import { apps as allApps } from "@/.velite";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Apps Directory",
  description:
    "A growing directory of AI apps, agents, IDEs, MCP servers, infra, and tooling — searchable and filterable by category, pricing, license, deployment, and platform.",
  path: "/",
});

export default function HomePage() {
  const total = allApps.length;
  const categories = new Set(allApps.map((a) => a.category)).size;

  // Top padding clears the pinned directory console (nav + search + category
  // strip) fixed-positioned in the shared header. The masthead is a plain block
  // (not a <header> — site-nav owns the one <header> landmark) and scrolls away
  // under the console.
  return (
    <div className="relative overflow-clip px-6 pt-40 pb-32 sm:pt-44">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={720}
        color="var(--color-accent)"
        opacity={0.07}
      />

      <div className="container-site relative">
        <div className="mb-10 max-w-3xl">
          <p className="text-eyebrow text-[var(--color-accent)]">AI Apps Directory</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">
            <span className="text-display text-[var(--color-ink)]">Find the AI app</span>{" "}
            <span className="text-display text-[var(--color-accent)]">for the job.</span>
          </h1>
          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
            {total} apps · {categories} categories · researched &amp; kept current by Claude Code
          </p>
        </div>

        <Suspense fallback={<ToolGrid items={allApps} />}>
          <ToolsBrowser apps={allApps} />
        </Suspense>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${brand.name} — AI Apps Directory`,
          url: siteUrl,
          description: metadata.description ?? undefined,
          hasPart: allApps.map((a) => ({
            "@type": "SoftwareApplication",
            name: a.name,
            url: a.links.find((l) => l.primary)?.url ?? a.links[0]?.url,
          })),
        }}
      />
    </div>
  );
}
