import type { AppCategory } from "@/types/app";

// The 5-cluster grouping of the category taxonomy — mirrors the comment
// structure of APP_CATEGORIES in types/app.ts (order within each cluster =
// enum order). Shared by SERVER surfaces (the /categories hub) and CLIENT ones
// (the directory's category picker + clustered strip), so it lives apart from
// category-meta.ts, whose descriptions are server-only copy that must not ride
// into client bundles (same split rationale as category-labels.ts).
export const CATEGORY_CLUSTERS = [
  {
    label: "Build",
    blurb: "Developer & infra tooling",
    categories: [
      "ide",
      "agent",
      "orchestration",
      "mcp",
      "eval",
      "observability",
      "inference",
      "fine-tuning",
      "infra",
      "vector-db",
      "memory",
      "data-ops",
      "security",
    ],
  },
  {
    label: "Create",
    blurb: "Media & design",
    categories: ["image-gen", "video", "audio", "music", "voice", "vision", "3d", "design"],
  },
  {
    label: "Work",
    blurb: "Knowledge, ops & go-to-market",
    categories: [
      "assistant",
      "writing",
      "productivity",
      "search",
      "research-platform",
      "analytics",
      "automation",
      "browser-extension",
      "translation",
      "meeting",
      "marketing",
      "support",
    ],
  },
  {
    label: "Verticals",
    blurb: "Domain-specific AI",
    categories: ["companion", "healthcare", "legal", "finance", "education"],
  },
  {
    label: "Frontier",
    blurb: "Embodied & emerging",
    categories: ["robotics"],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  blurb: string;
  categories: ReadonlyArray<AppCategory>;
}>;

type Clustered = (typeof CATEGORY_CLUSTERS)[number]["categories"][number];
// Compile-time guard: a category added to APP_CATEGORIES but homed in no
// cluster would silently vanish from /categories and the filter picker — this
// assignment fails ("false is not assignable to true") until it's clustered.
const allClustered: [Exclude<AppCategory, Clustered>] extends [never] ? true : false = true;
void allClustered;
