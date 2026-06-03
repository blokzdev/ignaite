import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blokz.dev — How we ship: idea to production.";

export default function Image() {
  return renderOgImage({
    eyebrow: "// How we ship",
    titleA: "Idea → spec →",
    titleB: "shipped.",
  });
}
