import type { Metadata } from "next";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GlowOrb } from "@/components/effects/glow-orb";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolGrid } from "@/components/tools/tool-grid";
import { ToolsBrowser } from "@/components/tools/tools-browser";
import { brand } from "@/data/brand";
import { apps as allApps } from "@/data/apps";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Apps Directory",
  description:
    "A growing directory of AI apps, agents, IDEs, MCP servers, infra, and tooling for vibecoders and developers — searchable, filterable, with a Blokz mark on the picks we've actually deployed.",
  path: "/",
});

export default function HomePage() {
  const total = allApps.length;
  const categories = new Set(allApps.map((a) => a.category)).size;

  return (
    <div className="relative overflow-clip px-6 pt-24 pb-32 sm:pt-32">
      <GlowOrb
        className="-top-32 left-1/2 -translate-x-1/2"
        size={720}
        color="var(--color-accent)"
        opacity={0.07}
      />

      <div className="container-site relative">
        <header className="mb-8 max-w-3xl">
          <p className="text-eyebrow text-[var(--color-accent)]">AI Apps Directory</p>
          <h1 className="mt-4 text-5xl sm:text-6xl md:text-7xl">
            <span className="text-display text-[var(--color-ink)]">Find the AI app</span>{" "}
            <span className="text-display text-[var(--color-accent)]">for the job.</span>
          </h1>
          <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
            {total} apps · {categories} categories · curated and growing
          </p>
        </header>

        <Suspense fallback={<ToolGrid items={allApps} />}>
          <NuqsAdapter>
            <ToolsBrowser apps={allApps} />
          </NuqsAdapter>
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
