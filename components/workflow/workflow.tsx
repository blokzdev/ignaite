"use client";
import { products } from "@/content/workflow/products";
import { stages } from "@/content/workflow/stages";
import { useWorkflowPlatform } from "@/hooks/use-workflow-platform";
import { useWorkflowProduct } from "@/hooks/use-workflow-product";
import { PlatformTabs } from "./platform-tabs";
import { ProductTabs } from "./product-tabs";
import { StageSegment } from "./stage-segment";
import { WorkflowIntro } from "./workflow-intro";

export function Workflow() {
  const [product, setProduct] = useWorkflowProduct("brief");
  const productMeta = products[product];
  const [platform, setPlatform] = useWorkflowPlatform(productMeta.defaultPlatform);
  const activeStages = stages[product];

  return (
    <div className="relative">
      <WorkflowIntro productMeta={productMeta} />

      {/* Sticky session bar — the active product + platform context. */}
      <div className="sticky top-[64px] z-30 -mx-6 border-y border-white/[0.06] bg-[var(--color-canvas)]/85 px-6 py-2 backdrop-blur-xl sm:py-3">
        <div className="container-site flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-3 sm:justify-between">
            <p className="hidden font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase sm:block">
              Building
            </p>
            <div className="no-scrollbar max-sm:scroll-fade-x -mx-2 flex min-w-0 flex-1 overflow-x-auto px-2 sm:flex-initial">
              <ProductTabs product={product} onChange={setProduct} />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-between">
            <p className="hidden font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase sm:block">
              Target
            </p>
            <div className="no-scrollbar max-sm:scroll-fade-x -mx-2 flex min-w-0 flex-1 overflow-x-auto px-2 sm:flex-initial">
              <PlatformTabs platform={platform} onChange={setPlatform} />
            </div>
          </div>
        </div>
      </div>

      {/* Screen-reader summary mirroring the visual stages. */}
      <ol className="sr-only">
        {activeStages.map((s) => (
          <li key={s.id}>
            <strong>
              Stage {s.number}: {s.title}
            </strong>{" "}
            {s.summary}
          </li>
        ))}
      </ol>

      {activeStages.map((stage) => (
        <StageSegment
          key={`${product}-${stage.id}`}
          stage={stage}
          product={product}
          platform={platform}
          accentColor={productMeta.accentColor}
        />
      ))}
    </div>
  );
}
