import type { App } from "@/types/app";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { LICENSE_LABEL, licenseSignal } from "@/lib/tools/license";
import { DEPLOYMENT_LABEL, MODEL_KIND_LABEL, PLATFORM_LABEL } from "@/lib/tools/app-labels";

// Listing exports — the "take this listing with you" formats offered by the
// detail page's Share menu. Built server-side at SSG time (pure functions of
// the App record, no runtime dates — rebuilds stay deterministic) and handed
// to the client menu as plain strings; downloads are data-URI anchors, so no
// generation happens in the browser. Markdown is the human/LLM-pasteable
// brief; JSON is the raw record for agents and tooling.

const PRICING_NICE: Record<App["pricing"], string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "byo-key": "BYO key",
};

export function buildAppMarkdown(app: App, url: string): string {
  const lines: string[] = [];

  lines.push(`# ${app.name}`, "", `> ${app.tagline}`, "");
  lines.push(app.description);
  if (app.longDescription) lines.push("", app.longDescription);
  lines.push("");

  if (app.insight) lines.push(`**Worth knowing:** ${app.insight}`, "");
  if (app.edge) lines.push(`**The edge:** ${app.edge}`, "");

  lines.push("## At a glance", "");
  lines.push(`- **Category:** ${CATEGORY_LABEL[app.category]}`);
  if (app.vendor) lines.push(`- **Vendor:** ${app.vendor}`);
  lines.push(`- **Pricing:** ${PRICING_NICE[app.pricing]}`);
  lines.push(`- **Source:** ${LICENSE_LABEL[licenseSignal(app)]}`);
  lines.push(`- **Platforms:** ${app.platforms.map((p) => PLATFORM_LABEL[p]).join(", ")}`);
  if (app.deployment) lines.push(`- **Deployment:** ${DEPLOYMENT_LABEL[app.deployment]}`);
  if (app.modelSupport) {
    const models = app.modelSupport.models?.length
      ? ` — ${app.modelSupport.models.join(", ")}`
      : "";
    lines.push(`- **Model support:** ${MODEL_KIND_LABEL[app.modelSupport.kind]}${models}`);
  }
  if (app.status === "archived") lines.push(`- **Status:** Archived`);
  lines.push("");

  if (app.pros?.length) {
    lines.push("## Pros", "", ...app.pros.map((p) => `- ${p}`), "");
  }
  if (app.cons?.length) {
    lines.push("## Cons", "", ...app.cons.map((c) => `- ${c}`), "");
  }
  if (app.bestFor?.length) {
    lines.push("## Best for", "", ...app.bestFor.map((b) => `- ${b}`), "");
  }

  if (app.links.length > 0) {
    lines.push("## Links", "");
    for (const link of app.links) {
      const label = link.label ?? link.kind;
      lines.push(`- ${label}${link.primary ? " (primary)" : ""}: ${link.url}`);
    }
    lines.push("");
  }

  lines.push("---", "");
  const verified = app.lastVerifiedAt ? ` Data last verified ${app.lastVerifiedAt}.` : "";
  lines.push(`Exported from [Ignaite](${url}) — an AI-managed directory of AI apps.${verified}`);

  return lines.join("\n");
}

export function buildAppJson(app: App, url: string): string {
  return JSON.stringify({ source: url, app }, null, 2);
}
