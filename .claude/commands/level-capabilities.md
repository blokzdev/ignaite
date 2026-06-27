---
description: Backfill capability `level` (primary/secondary) across a category, one PR per category
argument-hint: [category] (default — the category with the most unleveled capabilities)
---

You are running the **capability-leveling campaign** (Chunk AF-2) for the Ignaite directory. Every
listing's task axis is `capabilities: [{ id, level?, note? }]` (the controlled `AppCapability` enum in
`types/app.ts`). The `id`s are populated directory-wide; the **`level`** — `primary` vs `secondary` —
is being backfilled by this routine. The substitution engine (AF-1) and the detail/compare surfaces
read `level`, so leveling sharpens "what this app is FOR" vs "what it can also do" across the catalog.

This is a **finite campaign**, not perpetual maintenance: it processes one **category** per run and
**no-ops once every active listing's capabilities are leveled**. (Going forward, `/add-app` authors
levels at creation and `/audit-directory` re-verifies them, so the axis stays leveled without this
routine.) **Never fabricate** — a level reflects real, web-verified vendor positioning, or it defaults
to `secondary`.

Scope: **$ARGUMENTS**

- a `category` (e.g. `legal`, `image-gen`, `inference`) → level that category's unleveled listings.
- no arg → pick the category with the **most fully-unleveled capabilities remaining** (max progress
  per run), skipping any category already fully leveled. If none remain, **do nothing** — the campaign
  is complete.

## 1. Select the batch

Survey leveling state and pick the category, then collect its **active** listings that still have **any
unleveled capability** (an entry whose `level` is unset). Skip `status:"archived"` listings and any cap
that already carries a `level` (overlapping runs no-op on already-leveled entries).

```bash
node -e '
const fs=require("fs"),p="data/apps";
const arg=process.argv[1]||"";
const apps=fs.readdirSync(p).filter(f=>f.endsWith(".json")).map(f=>JSON.parse(fs.readFileSync(p+"/"+f,"utf8")))
  .filter(a=>(a.status??"active")==="active" && (a.capabilities??[]).length);
const byCat={};
for(const a of apps){const c=a.category??"(none)";(byCat[c]??=[]).push(a);}
const stat=c=>{let t=0,u=0;for(const a of byCat[c])for(const k of a.capabilities){t++;if(!k.level)u++;}return{t,u};};
let cat=arg;
if(!cat){const ranked=Object.keys(byCat).map(c=>({c,...stat(c)})).filter(x=>x.u>0).sort((a,b)=>b.u-a.u);
  if(!ranked.length){console.log("DONE — every active listing is fully leveled. No-op.");process.exit(0);}
  cat=ranked[0].c;console.log("AUTO-PICK:",cat,"("+ranked[0].u+" unleveled caps)");}
const todo=(byCat[cat]||[]).filter(a=>a.capabilities.some(k=>!k.level));
console.log("CATEGORY:",cat,"| listings to level:",todo.length);
for(const a of todo)console.log("  "+a.slug+"  ["+a.capabilities.map(k=>k.id+(k.level?"="+k.level:"")).join(", ")+"]");
' "$ARGUMENTS"
```

## 2. Level each listing (web-verified) — fan out in Ultracode

This is an **Ultracode** routine: author a Workflow that **fans out across the batch's listings in
parallel**, each agent handling a slice and returning a structured patch. Give each leveling agent the
`Explore` agent type (read-only + WebSearch/WebFetch) and this contract:

For each listing, **web-verify the vendor's positioning** (homepage hero, the primary use case in
docs/pricing, how third-party coverage frames it), then assign every capability a `level`:

- **`primary`** = what the app is **built around** — its headline job, the thing it leads with and is
  bought for. Usually **1–2** capabilities, occasionally 3. The reason someone picks this app.
- **`secondary`** = a real but **supporting / peripheral** capability — something it also does, an
  adjacent feature, a means-to-the-end rather than the end.
- **Default `secondary` when uncertain.** The failure mode to avoid is **primary inflation** — marking
  every capability primary, which makes the signal meaningless. If you're tempted to mark 4+ of an app's
  capabilities primary, you're almost certainly wrong: step back to what it's _for_.
- Levels are **per-listing relative** — judged against that app's own focus, not the whole catalog. A
  general assistant and a specialist tool can share a leaf at different levels.

**Optional expansion (conservative).** While verifying, an agent MAY add a **genuinely-missing,
web-confirmed** capability the listing should already carry (same verify-or-omit bar as `/add-app`:
confirmed shipping feature on the vendor's own surface, never inferred from name/category/our prose;
keep the listing ≤6 caps total). Adds are the **exception**, each justified with a one-line `why` +
source. New caps are returned **unleveled** (the apply step leaves them for a follow pass) **unless** the
agent is confident — then include the level. Do **not** silently split a compound leaf here — the
granularity split was Chunk AH; if you spot a stray compound leaf, flag it in the report instead.

Each agent returns a patch array (StructuredOutput): one object per listing —

```
{ slug, levels: [{ id, level }], add?: [{ id, level?, why }] }
```

with **`levels` covering every existing capability id** on that listing (the apply step errors on a
missing or phantom id, so completeness is enforced mechanically).

## 3. Adversarial audit (one pass over the whole patch)

Before applying, run a single **audit agent** over the merged patch (a skeptic, not a rubber stamp):

- **Coverage** — every batch listing present exactly once; every existing capability id has a level; no
  phantom id (a level for a cap the listing doesn't carry); no id duplicated within a listing.
- **Primary-inflation check** — flag any listing where **more than ~60%** of caps are `primary`, or any
  with **4+** primaries, and re-judge it: is each marked-primary cap genuinely a headline job, or is it
  supporting? Downgrade the over-marked ones. (The pilot ran ~63% primary overall with most apps at 1–2
  primaries — treat that as the sane baseline, not a target.)
- **Adds** — each `add` is a real, web-confirmed shipping feature with a source, not a category guess;
  reject any that don't clear the `/add-app` bar.
- Record the audit's downgrades/rejections in the run report.

## 4. Apply, validate

Write the audited patch to the scratchpad and apply it with this script (sets `level` on each existing
cap; appends any approved `add`s; errors loudly on a missing/phantom level or an over-6 listing):

```bash
cat > /tmp/apply-levels.mjs <<'EOF'
import { readFileSync, writeFileSync } from "node:fs";
const patch = JSON.parse(readFileSync(process.argv[2], "utf8"));
const apps = Array.isArray(patch) ? patch : patch.apps;
let changed = 0; const problems = [];
for (const p of apps) {
  const path = `data/apps/${p.slug}.json`;
  let app; try { app = JSON.parse(readFileSync(path, "utf8")); }
  catch { problems.push(`MISSING FILE ${p.slug}`); continue; }
  const caps = app.capabilities ?? [];
  const lvl = new Map((p.levels ?? []).map((l) => [l.id, l.level]));
  for (const c of caps) {
    const v = lvl.get(c.id);
    if (v === "primary" || v === "secondary") c.level = v;
    else if (!c.level) problems.push(`NO LEVEL ${p.slug}.${c.id}`);
  }
  for (const l of p.levels ?? [])
    if (!caps.some((c) => c.id === l.id)) problems.push(`PHANTOM ${p.slug}.${l.id}`);
  const have = new Set(caps.map((c) => c.id));
  for (const a of p.add ?? [])
    if (!have.has(a.id)) { caps.push(a.level ? { id: a.id, level: a.level } : { id: a.id }); have.add(a.id); }
  if (caps.length > 6) problems.push(`OVER-6 ${p.slug} (${caps.length})`);
  app.capabilities = caps;
  writeFileSync(path, JSON.stringify(app, null, 2) + "\n");
  changed++;
}
console.log(`applied ${changed} listings`);
if (problems.length) { console.log("PROBLEMS:\n" + problems.join("\n")); process.exit(1); }
EOF
node /tmp/apply-levels.mjs <your-patch.json>
```

Then run the same gates CI runs — **fix until clean**:

```bash
pnpm velite && pnpm typecheck && pnpm lint && pnpm build
```

(`velite build --strict` re-validates the schema + the duplicate-id / over-6 guards; a bad patch
hard-fails here rather than landing.)

## 5. Enrichment-only contract — what NOT to touch

Leveling **refines existing verified data** (it doesn't re-verify the listing), so — exactly like the
Chunk AB capability-population precedent:

- **Do NOT bump `lastVerifiedAt`.** (That's `/audit-directory`'s signal.)
- **Do NOT append a `changelog` entry.** (Leveling isn't a substantive listing change; logging it would
  flood every Change history. The PR + git history is the audit trail.)
- Touch **only** the `capabilities[].level` field (+ the rare approved `add`). Never edit factual fields
  (pricing, platforms, links, description, …) — a factual correction spotted in passing belongs in
  `/audit-directory`, not here; note it in the PR body instead.

## 6. Open a PR (auto-merge — fire-and-forget)

- Branch `claude/level-capabilities-<category>-<date>`, commit (subject e.g. `feat(AF-2): level
capability axis for <category> (<n> listings)`), push, open a PR into `main`. Body: category, listings
  leveled, primary/secondary tally + primary%, any `add`s (with sources), the audit's downgrades, and a
  **"needs human"** section for anything flagged (a stray compound leaf, a factual drift for
  `/audit-directory`, an app whose positioning was genuinely ambiguous).
- **Enable squash auto-merge and END** — do not subscribe, watch CI, sleep, or schedule a check-in.
  Like `/audit-directory`, this enriches **trusted data** under a strict rubric + an adversarial audit +
  `git revert` as the undo, so the local gate + CI are the guard rather than a pre-merge human review.
  Auto-merge fires only on green, so GitHub lands it server-side.
- If the batch came back empty (campaign complete, or the named category was already fully leveled):
  **do nothing** — no branch, no empty PR. Say so.

Cadence: run on a schedule until the campaign drains (~42 categories). Each run is one small, reversible
PR; `git revert` cleanly undoes a category if a rubric call needs rethinking.
