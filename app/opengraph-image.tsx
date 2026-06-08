import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Ignaite — the AI apps directory.";

export default function Image() {
  return renderOgImage({
    eyebrow: "// AI apps directory",
    titleA: "Find the",
    titleB: "right AI app.",
  });
}
