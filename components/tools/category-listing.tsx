"use client";
import type { App } from "@/types/app";
import { useViewMode } from "@/hooks/use-view-mode";
import { RevealToolGrid } from "./reveal-tool-grid";
import { ViewToggle } from "./view-toggle";

// Client island for a category page's listing. The page's <Suspense> fallback
// (<ToolGrid items={apps}/>) renders the full set as static HTML — so every app
// stays crawlable — and this hydrates over it to add the grid/list toggle and the
// scroll-staggered reveal. No mount-windowing: the same full array renders, so
// the hydration swap doesn't shrink the page (and SEO matches the fallback).
export function CategoryListing({ apps }: Readonly<{ apps: ReadonlyArray<App> }>) {
  const [view, setView] = useViewMode();
  return (
    <>
      <div className="mb-4 flex justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>
      <RevealToolGrid items={apps} revealKey="category" view={view} />
    </>
  );
}
