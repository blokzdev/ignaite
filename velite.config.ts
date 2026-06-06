import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineCollection, defineConfig } from "velite";
import { appSchema } from "./lib/apps-schema";
import { sponsoredSchema } from "./lib/sponsored-schema";

// One JSON file per listing under data/apps/*.json, validated against the zod
// schema (the source of truth). Velite generates the typed, aggregated data
// into `.velite/` (gitignored, regenerated on every dev/build/typecheck).
const apps = defineCollection({
  name: "App", // the generated record type name
  pattern: "apps/*.json",
  schema: appSchema,
});

// One JSON file per sponsored slot under data/sponsored/*.json — same per-file
// pattern as apps, just a much smaller pool. No slim index needed; the client
// browser imports the full generated array from `@/.velite`.
const sponsored = defineCollection({
  name: "Sponsored",
  pattern: "sponsored/*.json",
  schema: sponsoredSchema,
});

export default defineConfig({
  root: "data",
  output: { data: ".velite", clean: true },
  collections: { apps, sponsored },
  // `--strict` (set on the velite invocations in package.json) turns per-file
  // schema violations into a non-zero exit so CI / pre-push catch bad data from
  // the weekly authoring routines instead of silently dropping the entry. The
  // guard below covers what per-file validation structurally can't: two files
  // sharing a slug/id collide on output. Throwing here also fails the build.
  complete: ({ apps, sponsored }) => {
    const dupes = (values: ReadonlyArray<string>) => [
      ...new Set(values.filter((v, i) => values.indexOf(v) !== i)),
    ];
    const dupSlugs = dupes(apps.map((a) => a.slug));
    if (dupSlugs.length) {
      throw new Error(`Duplicate app slug(s) across data/apps/*.json: ${dupSlugs.join(", ")}`);
    }
    const dupIds = dupes(sponsored.map((s) => s.id));
    if (dupIds.length) {
      throw new Error(
        `Duplicate sponsored id(s) across data/sponsored/*.json: ${dupIds.join(", ")}`,
      );
    }
    // After the full collection is written, derive a SLIM search index for the
    // client command palette so it ships only the 5 fields it renders — not all
    // ~125 full records. The palette imports `@/.velite/apps-search.json`.
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
