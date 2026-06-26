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
    // Accession numbers must be unique (per-file validation can't see across
    // files). The realistic collision: two discovery PRs authored before either
    // merges, both taking "highest + 1" — the routines cross-check open PRs to
    // avoid it, and this is the hard backstop.
    const dupSeqs = dupes(apps.map((a) => String(a.addedSeq)));
    if (dupSeqs.length) {
      throw new Error(`Duplicate addedSeq across data/apps/*.json: ${dupSeqs.join(", ")}`);
    }
    // The seq is the fine-grained chronology UNDER the day-granular addedAt, so
    // the two must tell the same story: walked in seq order, addedAt may never
    // step backwards. Catches a routine assigning a seq that contradicts dates.
    const bySeq = [...apps].sort((a, b) => a.addedSeq - b.addedSeq);
    let prevDated: (typeof bySeq)[number] | undefined;
    for (const a of bySeq) {
      if (!a.addedAt) continue;
      if (prevDated && a.addedAt < prevDated.addedAt!) {
        throw new Error(
          `addedSeq order contradicts addedAt: "${a.slug}" (seq ${a.addedSeq}, ${a.addedAt}) ` +
            `is dated before "${prevDated.slug}" (seq ${prevDated.addedSeq}, ${prevDated.addedAt})`,
        );
      }
      prevDated = a;
    }
    // Curated `alternatives` reference other listings by slug — per-file schema
    // validation can't see across files, so verify here that every referenced
    // slug exists and isn't a self-reference. A typo'd/stale slug fails the build.
    const slugSet = new Set(apps.map((a) => a.slug));
    for (const a of apps) {
      const bad = (a.alternatives ?? []).filter((s) => s === a.slug || !slugSet.has(s));
      if (bad.length) {
        throw new Error(
          `App "${a.slug}": alternatives reference missing/self slug(s): ${bad.join(", ")}`,
        );
      }
    }
    // Within one listing a capability id must not repeat — a pure data error (the
    // same task listed twice). zod validates each id against the enum but doesn't
    // dedupe the array, so catch it here. (The leaf↔persona split + per-app cap
    // are authoring-time concerns; this is the structural guard.)
    for (const a of apps) {
      const ids = (a.capabilities ?? []).map((c) => c.id);
      const dupCaps = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
      if (dupCaps.length) {
        throw new Error(`App "${a.slug}": duplicate capability id(s): ${dupCaps.join(", ")}`);
      }
    }
    // A listing is a near-certain DUPLICATE of an existing one when they share
    // the same primary-link host (www-stripped) AND the same normalized name.
    // Distinct products on a shared company domain differ in name
    // (langchain/langgraph, adobe-express/adobe-firefly), so this signature has
    // ~no false positives — but it catches the same app RE-ADDED under a new
    // slug (e.g. "bland" beside "bland-ai"), which the unique-slug guard above
    // structurally cannot. The authoring routines also scan name+domain before
    // adding (see .claude/commands/{add-app,discover-apps}.md); this is the
    // hard backstop for what slips through (e.g. two PRs racing).
    const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const primaryHost = (a: (typeof apps)[number]) => {
      const url = a.links.find((l) => l.primary)?.url ?? a.links[0]?.url;
      try {
        return new URL(url!).host.replace(/^www\./, "").toLowerCase();
      } catch {
        return "";
      }
    };
    const seenIdentity = new Map<string, string>();
    for (const a of apps) {
      const host = primaryHost(a);
      if (!host) continue;
      const sig = `${normName(a.name)}@${host}`;
      const prior = seenIdentity.get(sig);
      if (prior) {
        throw new Error(
          `Duplicate listing: "${a.slug}" and "${prior}" share name "${a.name}" + primary domain ` +
            `"${host}" — the same app listed twice. Keep one canonical entry and redirect the other ` +
            `/apps/<slug> in next.config.ts (see the dedup step in .claude/commands/add-app.md).`,
        );
      }
      seenIdentity.set(sig, a.slug);
    }
    // SOFT ADVISORY — console.warn only, NEVER throws (a throw would deadlock the
    // unattended auto-merge pipeline). Flags active listings with no capabilities
    // so /audit-directory can fill them: capabilities power the task axis
    // (/insights chart, llms-full.txt, /compare verdict), so a gap degrades those
    // surfaces, but a missing optional field is not a data error.
    const activeApps = apps.filter((a) => (a.status ?? "active") !== "archived");
    const missingCaps = activeApps.filter((a) => !a.capabilities || a.capabilities.length === 0);
    if (missingCaps.length > 0) {
      const pct = Math.round((missingCaps.length / activeApps.length) * 100);
      const sample = missingCaps
        .slice(0, 20)
        .map((a) => a.slug)
        .join(", ");
      console.warn(
        `[velite] capability coverage: ${missingCaps.length} of ${activeApps.length} active ` +
          `listing(s) (${pct}%) carry no capabilities — ${sample}` +
          (missingCaps.length > 20 ? `, …(+${missingCaps.length - 20})` : "") +
          `. They power the task axis (/insights, llms-full.txt, /compare); add 1–6 via ` +
          `/audit-directory. (advisory — not blocking)`,
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
      // Always emit the key (empty when none) so the JSON-inferred type stays a
      // uniform string[] for the populated-categories + palette consumers.
      secondaryCategories: a.secondaryCategories ?? [],
      tags: a.tags,
    }));
    const dir = join(process.cwd(), ".velite");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "apps-search.json"), JSON.stringify(slim));
  },
});
