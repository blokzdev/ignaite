import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineCollection, defineConfig } from "velite";
import { appSchema } from "./lib/apps-schema";

// One JSON file per listing under data/apps/*.json, validated against the zod
// schema (the source of truth). Velite generates the typed, aggregated data
// into `.velite/` (gitignored, regenerated on every dev/build/typecheck).
const apps = defineCollection({
  name: "App", // the generated record type name
  pattern: "apps/*.json",
  schema: appSchema,
});

export default defineConfig({
  root: "data",
  output: { data: ".velite", clean: true },
  collections: { apps },
  // After the full collection is written, derive a SLIM search index for the
  // client command palette so it ships only the 5 fields it renders — not all
  // ~125 full records. The palette imports `@/.velite/apps-search.json`.
  complete: ({ apps }) => {
    const slim = apps.map((a) => ({
      slug: a.slug,
      name: a.name,
      vendor: a.vendor,
      category: a.category,
      tags: a.tags,
    }));
    const dir = join(process.cwd(), ".velite");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "apps-search.json"), JSON.stringify(slim));
  },
});
