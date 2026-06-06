import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blokz — an AI-managed directory of AI apps.";

export default function Image() {
  return renderOgImage({
    eyebrow: "// About Blokz",
    titleA: "Managed",
    titleB: "by AI.",
  });
}
