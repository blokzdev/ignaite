import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, renderRecipeOgImage } from "@/lib/og-image";
import { getApp } from "@/lib/apps";
import { getRecipe, listRecipes } from "@/lib/recipes";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Browsable recipes only (archived excluded) — matches the page's params so an
// archived recipe has neither a page nor an OG card. Guarded like apps/[slug].
export function generateStaticParams() {
  return listRecipes({ includeStale: true }).map((r) => ({ slug: r.slug }));
}

interface Props {
  params: { slug: string };
}

export default function Image({ params }: Props) {
  const recipe = getRecipe(params.slug);
  if (!recipe) {
    return renderOgImage({ eyebrow: "// Not found", titleA: "Recipe", titleB: "not found." });
  }

  const stepCount = recipe.steps.length;
  const eyebrow = `// RECIPE · ${stepCount} STEP${stepCount === 1 ? "" : "S"}`;

  // The deduped app chain — the recipe's identity, scannable at a glance. ≤3 →
  // full "A → B → C"; >3 → first 3 + "+N" so it never overflows the card.
  const chain = [...new Set(recipe.steps.map((s) => s.appSlug))].map(
    (slug) => getApp(slug)?.name ?? slug,
  );
  const sub =
    chain.length > 3 ? `${chain.slice(0, 3).join(" → ")} +${chain.length - 3}` : chain.join(" → ");

  return renderRecipeOgImage({ eyebrow, title: recipe.title, sub });
}
