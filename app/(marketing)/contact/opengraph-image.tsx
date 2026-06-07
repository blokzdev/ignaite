import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blokz.dev — Talk to the directory.";

export default function Image() {
  return renderOgImage({
    eyebrow: "// Let's talk",
    titleA: "Talk to the",
    titleB: "directory.",
  });
}
