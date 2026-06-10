import { apps as allApps } from "@/.velite";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";
import { APP_CATEGORIES } from "@/types/app";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Ignaite — the AI apps directory.";

// Stat line is derived so it never drifts as the directory grows: total listing
// count floored to the nearest 100 ("400+"), categories straight from the
// canonical taxonomy tuple. Floor (never round up) so the figure is never
// overstated.
const appsLabel = `${Math.floor(allApps.length / 100) * 100}+ AI apps`;
const sub = `${appsLabel} · ${APP_CATEGORIES.length} categories · managed by Claude Code`;

export default function Image() {
  return renderOgImage({
    eyebrow: "// AI apps directory",
    titleA: "The signal,",
    titleB: "not the hype.",
    sub,
  });
}
