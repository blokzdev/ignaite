import { OG_CONTENT_TYPE, OG_SIZE, renderAppOgImage, renderOgImage } from "@/lib/og-image";
import { apps } from "@/.velite";
import { getApp } from "@/lib/apps";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";
import { PLATFORM_LABEL, PRICING_LABEL } from "@/lib/tools/app-labels";

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
    return renderOgImage({ eyebrow: "// Not found", titleA: "App", titleB: "not found." });
  }

  const monogram =
    app.name
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "AI";
  const eyebrow = `// ${CATEGORY_LABEL[app.category].toUpperCase()}${
    app.vendor ? ` · ${app.vendor.toUpperCase()}` : ""
  }`;
  const stats = [
    PRICING_LABEL[app.pricing],
    LICENSE_LABEL[licenseSignal(app)].toUpperCase(),
    app.platforms
      .map((p) => PLATFORM_LABEL[p])
      .slice(0, 3)
      .join(" · "),
  ]
    .filter(Boolean)
    .join("  ·  ");

  return renderAppOgImage({
    eyebrow,
    name: app.name,
    tagline: app.tagline,
    monogram,
    accent: app.accentColor ?? "#08D9D6",
    stats,
  });
}
