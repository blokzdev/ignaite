import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";
import { apps } from "@/.velite";
import { getApp } from "@/lib/apps";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

interface Props {
  params: { slug: string };
}

export default function Image({ params }: Props) {
  const app = getApp(params.slug);
  if (!app) {
    return renderOgImage({
      eyebrow: "// Not found",
      titleA: "App",
      titleB: "not found.",
    });
  }
  const eyebrow = app.vendor ? `// ${app.vendor.toUpperCase()}` : "// AI APPS DIRECTORY";
  return renderOgImage({
    eyebrow,
    titleA: app.name,
    titleB: app.tagline,
  });
}
