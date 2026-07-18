# Backlog

Single source of truth for "tracked but deferred" work. Distinct from the implementation plan and from the `CLAUDE.md` contract.

## Conventions

Tag every item with a category:

- **[user]** — needs your input, decision, or asset
- **[polish]** — deferred refinement; safe to ship without
- **[debt]** — workaround that should be unwound when adjacent code is next touched
- **[verify]** — sanity check / external confirmation before launch
- **[future]** — explicitly post-v2

Mark done with `- [x]` and move to the **Resolved** section. Inline `// TODO(category): <message>` comments in code should mirror an entry here when the action isn't purely code-local.

---

## Pre-launch blockers (user action required)

These gate a clean v2 launch. Everything else can ship without.

- [ ] **[user]** Set Vercel env vars (Production + Preview): `RESEND_API_KEY`, `CONTACT_TO_EMAIL=team@ignaite.app`, optional `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL=https://ignaite.app`. Without `RESEND_API_KEY` the contact form returns an "Email is offline" notice instead of submitting.
- [ ] **[user]** Verify the `ignaite.app` domain inside Resend (Settings → Domains) so the contact form can send from `Ignaite <hello@ignaite.app>`. Until verified, leave `CONTACT_FROM_EMAIL` unset and the form falls back to `onboarding@resend.dev`.
- [ ] **[user]** Confirm `team@ignaite.app` is actively monitored (the destination for every form submission). Optionally mirror submissions to a Telegram/Discord webhook on submit.
- [ ] **[user]** Swap the remaining `@blokzdev` links + displays for Ignaite-branded accounts once they exist. **Done:** X → `@ignaitelabs` (`data/brand.ts` `social.twitter` + the `&via=` share-attribution in `components/detail/use-share-model.ts`). **Remaining:** Telegram, LinkedIn, and `flow.page` in `data/brand.ts`/`app/(marketing)/contact/page.tsx`; the structural ones (`github.com/blokzdev` org, `g.dev/blokz`, the Play Store dev account) need real account migration, not just a URL edit. Internal `blokz:*` event/storage keys are non-user-facing and can stay.
- [ ] **[future]** Rebrand cutover leftovers — the operator is now **Ignaite Labs** and the dormant `/workflow` Blokz references were rebranded in the Ignaite Labs pass. Remaining when `/portfolio` is revived: rebrand `data/projects.ts` (portfolio) and the `next.config.ts` legacy slugs `blokz-oss`/`blokz-ai-incoming`. Internal event/storage keys `blokz:*` are non-user-facing and can stay; the `blokz.dev` inbound redirect is a real structural domain and stays.
- [ ] **[verify]** Confirm `public/app-ads.txt` is still required by Play Store ad SDKs (preserved verbatim from the legacy site).

## Pre-launch polish (optional, can ship without)

Things that would make the site feel more "us" before the world sees it.

- [ ] **[user]** Provide a vector SVG Ignaite logo (wordmark + monogram). Replace the legacy `cdn.glitch.global` PNG referenced in `data/brand.ts` with `/public/brand/logo.svg`. Affects nav, footer, manifest icon, OG.
- [ ] **[user]** Rewrite manifesto principles in `content/manifesto/principles.ts` to your voice. Five-card grid; ≤ 2 short sentences per principle.
- [ ] **[user]** Rewrite the hero headline block in `data/brand.ts` (`brand.headline.eyebrow / title / titleAccent / sub`) if the current copy doesn't ring true.
- [ ] **[user]** Workflow **artifact** copy — voice/tone polish. The narrative transcripts in `content/workflow/stages.ts` were revoiced to the founder register in K-3 (see Resolved); the 12 MDX artifacts under `content/workflow/artifacts/<product>/<type>.mdx` are still in their first-draft voice. Read them through and tune to your personal voice before launch (the structure + depth are done).
- [ ] **[user]** Decide on a real Cal.com (or alternative) scheduling URL and set the `SCHEDULE_URL` constant in `components/contact/contact-success.tsx` to render the "Book a call" button on form-success.
- [ ] **[future]** _(Portfolio dormant — these three are deferred while the blockchain heritage is unpublished; they only matter if/when the portfolio is revived.)_ Replace the blanket Play-Store developer-page URL in `data/projects.ts` with per-app deep links (`details?id=<packageId>`). Only `blockscan` carries a verified package id (`com.bdc.blockscan.app`).
- [ ] **[future]** Provide per-app download / review counts beyond Blockchair's confirmed 10K+ (portfolio-dormant).
- [ ] **[future]** Drop real 512×512 app icons under `public/projects/<slug>/icon.png` (portfolio-dormant). Also: confirm **WebSight**'s tagline/description + add real stars/forks stats in `data/projects.ts` before reviving the portfolio.

## Post-launch enhancements

Anything in this section is explicitly safe to defer to after v2 goes live.

### Platform: accounts, user layer & admin (Iteration 12)

> Design of record: `docs/architecture-supabase-user-layer.md`. Git stays the source of truth;
> Supabase adds the user-native layer + a derived read model. These **[user]** items gate Phase 1
> (auth + bookmarks) implementation — hand them back and Phase 1 ships end-to-end.

- [ ] **[user]** Sign off on the dependency add: `@supabase/supabase-js` (~53.5 KB gz) +
      `@supabase/ssr` (~5.6 KB gz) — **~59 KB gz combined, server-side only**, stays out of the `/`
      and `/apps/*` client chunks (CLAUDE.md §11). Nothing else added (no NextAuth, no realtime).
- [ ] **[user]** Create a Supabase project in the **Blokz Team** org (a new project is **$0/mo**;
      us-east-1 to match the org). Hand back `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. _(I can create it via the Supabase
      MCP on your say-so.)_
- [ ] **[user] [verify]** Confirm the project's JWT signing key is **asymmetric** (RS256/ES256) so
      middleware `getClaims()` verifies locally (network-free). Projects created after 2025-10-01
      default to this; older ones migrate under Auth → JWT Keys. Symmetric still works (one verify
      round-trip per protected request) — migrate before launch.
- [ ] **[user]** Create a Google Cloud OAuth **Web** client. Authorized redirect URI = **Supabase's**
      `https://<ref>.supabase.co/auth/v1/callback` (NOT the app's `/auth/callback` — the #1 "login does
      nothing" bug). Paste Client ID + Secret into Supabase → Auth → Providers → Google; set Site URL +
      the redirect allow-list (incl. the `*-<team>.vercel.app/auth/callback` preview wildcard); publish
      the consent screen.
- [ ] **[user]** Add the three Supabase env vars to `.env.local` + Vercel (prod + preview) — editing
      `.env*` is a §11 action. `SUPABASE_SECRET_KEY` is server-only, never `NEXT_PUBLIC_`.
- [ ] **[user]** After first sign-in, run the one-line `admins` seed for `ganesh575@gmail.com` (UID from
      `auth.users`) so the admin lock resolves.
- [ ] **[verify]** Phase-2 CSP: only if a **browser** Supabase client is ever introduced, extend
      `next.config.ts` `connect-src` with `https://<ref>.supabase.co` (+ `wss://…` for realtime) or
      auth/data calls fail **silently**. Phase 1 is server→Supabase only, so CSP stays untouched.
- [ ] **[user] [future]** Phase 5: Stripe account + credits-vs-one-off pricing decision + price points.

### Directory expansion — Comparisons / Recipes / Insights (Iteration 11)

> The approved program plan reframes the directory into a verified graph (Comparisons · Recipes ·
> Insights) over one capability substrate. Chunk X (the Comparisons engine — `lib/tools/comparisons.ts`
> and the `/compare` routes) shipped the indexed curated-`alternatives` cohort; Chunk Z (Insights v1 —
> `lib/stats.ts` + `components/insights/*` + `/insights`) shipped the coverage-honest dense core. These
> are the tracked follow-ons.

- [ ] **[future]** **Chunk Y — Comparison OG + in-product discovery.** Per-pair Satori share card via
      `app/(marketing)/compare/[pair]/opengraph-image.tsx` (MUST guard with the same `getComparison()`
      Set check + `notFound()` as the page, then drop the page's `ogImage: "/opengraph-image"` override);
      an `/apps/[slug]` "Compare {name} with…" rail (use `comparisonsForApp(slug)`); a `/compare` entry in
      nav + the ⌘K palette (`command-palette-body.tsx` `PAGES`); a `popular-comparisons.json` slim index;
      and a `comparisons` section in `llms-full.txt`.
- [ ] **[future]** **Mechanical same-category long-tail cohort** — render (not just curate) the
      same-category top-N cross-product as `noindex,follow`, and promote individual pages to indexed only
      on proven Search Console impressions. Deliberately excluded from Chunk X (doorway-page risk); needs
      the GSC feedback loop + a measurement contract first.
- [ ] **[verify]** **Comparison archive-redirect + `-vs-` reverse-order redirect — needs `next.config.ts`
      sign-off (CLAUDE.md §11).** Today an archived app's pairs simply drop out of `generateStaticParams`
      (→ 404 under `dynamicParams=false`), and the non-canonical `B-vs-A` order 404s. Both should instead
      **redirect** (308 archived→surviving `/apps`|`/category`; 301 reverse-order→canonical) to preserve
      inbound link equity — but redirects need a `next.config.ts`/middleware change. Batch both into the
      one §11 config sign-off. Until then: commit a build-time eligible-pair manifest so a future diff can
      drive the archived-pair redirects.
- [ ] **[future]** **Synthesized "when to pick A vs B" prose verdict** on `/compare` — deferred until the
      capability model (Chunk AA) lands; templating off audience-noun `bestFor` produces broken grammar.
      Chunk AC adds it once `capabilities` provides a templatable field.
- [ ] **[verify]** **Chunk Z-2 — Insights embeds + per-metric pages — needs a `headers()` sign-off (§11).**
      The shareable backlink engine: an `/embed/<metric>` iframe surface (`frame-ancestors *`,
      `rel=canonical`→parent) so other sites can embed a self-updating Ignaite chart — requires a
      `next.config.ts` headers change (batch with the comparison-redirect §11 sign-off). Alongside it:
      indexable `/insights/<metric>` pages gated on a curated framing paragraph + an editorial value gate
      (don't spawn thin pages), per-chart Satori OG (spike donut/segmented through `next/og` first — the
      repo's Satori usage is flexbox-only), and an `insights` section in `llms.txt`/`feed.json`.
- [ ] **[future]** **Insights time-series charts (growth / "what's new this quarter") + behavioral
      "most-compared" chart.** Growth/archive-trend deferred until the corpus spans ≥2 `addedAt` quarters
      with real archive history (today it's a single ~6-week window → a one-bar non-chart). The
      "most-compared / most-viewed apps" chart needs a measurement contract (`@vercel/analytics` event
      whitelist) first — which also feeds the "promote long-tail comparisons on GSC/usage demand" gate.
- [x] **[future]** **Chunk AB / AB-2 — capability backfill — ✅ DONE** (#335 Build-cluster pilot →
      #336–#346 eight-cluster fan-out + straggler sweep). Authored web-verified `capabilities` (id-only) + re-scoped `bestFor` to persona across the corpus via the parallel-agent campaign (per cluster:
      web-verify-or-omit author agents → adversarial audit wave → patch-file central merge; mechanically
      verified that **only `capabilities`+`bestFor` changed and `lastVerifiedAt` was never bumped**).
      **100% active coverage — 1,015/1,017** (brain-fm + songscription correctly omitted: no verifiable
      leaf). The routines now author + maintain capabilities so the gap can't regrow:
      `add-app.md`/`discover-apps.md` author them at creation (id-only, web-verify-or-omit, `bestFor`
      persona-only) and `audit-directory.md` re-verifies/backfills them + logs a `changelog` entry on a
      substantive change. _(Two cap interruptions — a per-session then a weekly limit — were fully
      recovered via `resumeFromRunId` / fresh re-runs with zero data loss; nothing degraded reached `main`.)_
- [x] **[future]** **Chunk AC — capability-aware comparisons + insights + UI — ✅ DONE**, split into
      three reviewable PRs: **AC-1** (#349) — the `CapabilityFamily` map (deferred from AA) + the
      grouped, tone-coded **Capabilities** section on `/apps/[slug]`; **AC-2** (#350) — the
      `computeCapabilityOverlap` helper, the capability-overlap row on `/compare`, and the
      deterministic, non-directive "when to pick which" **verdict** (`lib/tools/verdict.ts`, consumes
      the structured field with a strict enrichment-parity gate so a coverage gap is never rendered as a
      differentiator); **AC-3** (this chunk) — the family-level capability-distribution Insights chart,
      the shared `lib/tools/capability-stats.ts`, the `capability → [slug]` index in
      `llms.txt`/`llms-full.txt`/`feed.json`, and the soft `console.warn` coverage advisory in
      `velite.config.ts` (never a build-fail).
- [ ] **[future]** **Clickable capability bars / leaf drill-down on `/insights`** — the AC-3 family
      bars render as plain labels (no `href`) because there's no `capability` facet param/route yet.
      Wire `href` in `lib/stats.ts` `capabilityMix()` (and a leaf-level view) once a `capability`
      member lands in `FacetKey`/`directoryFilterParsers` + a `/capability/<leaf>` route or `?capability=`
      filter. Both depend on the same prerequisite — do them together.
- [ ] **[polish]** **Per-family tone on the Insights capability bars** — they currently paint the
      standard accent like every other chart (the base `BarChart` contract). Tinting each family bar to
      its `CAPABILITY_FAMILY_TONE` would tie the chart to the detail-page chips, but needs a new optional
      `BarChart` prop; deferred to keep the shared component untouched in AC-3.
- [x] **[future]** **Chunk AF-1 — substitution engine + recipe routines — ✅ DONE** (#357). Founder
      chose **engine-first** (the engine ranks on 4 signals — capability `level`, license, cost, platform
      count — and 3 are already 100% populated, so it degrades gracefully + ships useful day one; `level`
      sharpens it as the backfill lands). `lib/tools/recipe-substitution.ts` `substitutesForStep()` — a
      deterministic, build-time, **lexicographic** ranker (fit → license → cost → fewer platforms →
      addedSeq), returns only real active apps that genuinely carry the capability (no fabrication, no
      request-time model). Rendered as a collapsed "Swap this step (N)" `<details>` rail per step on
      `/recipes/[slug]` (0 B route JS; secondary-fit flagged "can also do this", primary "best for this",
      unspecified shows reasons only). Plus the `author-recipes` (human-review PR) + `audit-recipes`
      (auto-merge) routines. **Don't market "fewer signups / swap for free" until the rail is live** — it
      now is, framed honestly as "ranked by license, cost, and platform footprint" (capability-fit added
      to the framing once leveling coverage climbs).
- [x] **[future]** **Chunk AF-2 — the `level` backfill campaign — ✅ COMPLETE** (#359–362, #364)
      (founder-directed: full web-verify, via Ultracode parallel workflows). Populated `capabilities[].level`
      (primary = the 1–2 headline jobs the app is built around / secondary = supporting) across the **whole
      corpus: 1015/1015 capped active listings, 0 unleveled**, ~45% primary (1637 / 2029). Enrichment only —
      **no `lastVerifiedAt` bump, no `changelog`** (AB precedent). **Mechanism:** the **`/level-capabilities
[category]` routine** — fan-out leveling agents → adversarial **primary-inflation** audit → `apply-levels`
      → PR. Shipped as: `agent` pilot that locked the rubric (#359, ~63% primary), three calibration categories
      (#360 assistant 34%, #361 voice 42%, #362 inference 41%), then **one resumable bulk workflow** that
      leveled the remaining 35 categories (799 apps) + a focused re-run of 4 audit-failed categories (63 apps),
      landed in #364. The routine **now no-ops** ("DONE — every active listing is fully leveled"); `/add-app`
      (authors `level` at creation) + `/audit-directory` (re-verifies it) are level-aware and keep the axis
      current going forward — so the campaign cron can be disabled. Audit caught real inflation across the run
      (e.g. surge-ai red-teaming→secondary; rejected a hallucinated labelbox RL add).
- [x] **[future]** **Chunk AH — capability-leaf granularity split — ✅ DONE** (#358). Founder-directed
      first cut: split the 2 highest-confidence compound leaves — **`document-extraction` → `ocr-extraction` + `document-parsing`** and **`workflow-automation` → `workflow-orchestration` + `automation-trigger`**
      — additively (enum + label + family, all completeness-compile-checked; synonym aliases re-pointed),
      then **re-mapped all 174 affected apps** (61 + 113) via an Ultracode parallel campaign (13 hybrid
      author agents → adversarial audit: completeness + no-fabrication + ≤6-cap + marquee spot-checks —
      n8n/Make/Zapier→orchestration, mathpix/photomath→OCR). Distribution: doc 39 parsing / 9 OCR / 13 both;
      wf 44 orchestration / 69 trigger. Old leaves **retired cleanly** (founder's call — no back-compat
      cruft; the enum removal then **hard-fails** any app left behind, so it's the completeness guard for
      free). 0 recipe steps used the split leaves. The free-form `tags` "workflow-automation"/"document-
      extraction" were left (valid search terms, not capability ids). **Deferred** (red-team cut): `speech-
to-text`/`summarization`/`document-qa`/`eval-suite` (axes already covered by existing leaves), and
      `app-builder` (medium-confidence fast-follow). AH landed **before AF-2**, so leveling operates on the
      final vocabulary.
- [ ] **[future]** **AH-bis — `app-builder` split (fast-follow, optional).** The deferred close-call from
      AH: visual/no-code app builders vs code-emitting (v0/Lovable). ~67 apps. `code-generation` (55) +
      `app-deployment` (46) already partly express the boundary, so medium confidence — revisit if the
      substitution engine or a recipe surfaces a real confusion. Same migration machinery as AH (now proven).
- [~] **[future]** **AF-3 — `level`-aware detail/compare polish.** **Detail page DONE (#363):** primary
  ("built for") chips read filled + tone-coloured and lead each family row; secondary ("can also do")
  recede as ghost outline chips, with a filled-vs-hollow dot + legend + `sr-only` level as non-colour
  cues, `note` qualifiers inline, and primary-first ordering (`groupCapabilityEntriesByFamily`).
  **Still deferred:** the `/compare` overlap row + verdict are intentionally **level-blind** (they're
  about leaf-set parity / shared-vs-unique, and `shared` styling would conflict with the ghost
  treatment). Revisit if a "favour primary capabilities in the verdict" framing is wanted — a clean
  follow-up now that detail proves the chip variants. Pure additive.
- [ ] **[future]** **"Fewer signups" substitution tier.** The engine's objective deliberately omits a
      signup-count / onboarding-friction tier — no such data field exists. If a `signupFriction`-style
      signal is ever added (verifiable), slot it into the lexicographic order so the engine can prefer
      lower-friction swaps (the literal "fewer signups" promise). Until then the engine ranks on
      license/cost/platform/fit only.
- [x] **[future]** **Chunk AG — multi-dimensional recipes (parallel + iterative) — ✅ DONE** (#355).
      Extended the linear Recipe to an **optional DAG**, fully additively (the 4 pre-AG recipes validate + render byte-identical): each step may carry `id`, `dependsOn: id[]` (parallel branches + fan-in),
      and `loop: { backTo, until }` (iteration). Founder sign-off picked: **step-level `loop`** (not a
      group `mode` wrapper — would break the flat `steps[]` every consumer iterates); **free-prose
      `until`**; **no new dep** (pure-CSS flow view, 0 B route JS); **authored-graph errors hard-fail
      in-PR** (dup id / dangling ref / cycle / forward-loop), archived-app stays a **soft** stale-demote.
      `lib/tools/recipe-graph.ts` `recipeExecutionOrder()` (Kahn + array-index tie-break) is the single
      deterministic source for the flow `<ol>`, the HowTo linearization, the rank lanes, and the machine
      surfaces. `HowTo` JSON-LD stays linearized (loop → an exit-condition on its step, never a
      duplicated step); the **true graph** rides `feed.json` `_ignaite.recipes` + annotated
      `llms-full.txt`. Shipped with **2 web-verified pilots** — `source-video-to-multilingual-cuts`
      (parallel+fan-in: descript → rask-ai ‖ captions → veed) and `design-spec-to-signed-ui-component`
      (iterative loop: figma-ai → claude → figma-ai ⟲ → claude-code). The substance gate dropped **3
      competitor-marketing refs** (RWS/UXPin/RapidNative — the AD failure mode) and re-sourced
      independent ones. NOTE: _arbitrary_ on-the-fly graph synthesis is the **Recipe Spider's** job
      (below); the stored Recipe entity stays curated + mostly-linear-plus-optional-branches.
- [ ] **[future]** **Interactive flow/graph visualization for recipes (and beyond) — `react-flow` / `mermaid` exploration (founder-requested).** Chunk AG ships the recipe flow view as **pure CSS, 0 B route JS** (rank-grouped lanes + fan-in/loop annotations) — deliberately no dep, per the §11 bar. As a follow-up, evaluate a real graph lib (`@xyflow/react` aka React Flow, or `mermaid`) for a **richer, possibly-interactive** rendering — draggable/zoomable DAGs, animated edges, collapsible branches — and assess where else it earns its weight across the app (e.g. the capability **family map** on `/apps/[slug]`, a `/compare` capability-overlap diagram, an `/insights` relationship graph, and the future **Recipe Spider's** synthesized-path preview). Gated by CLAUDE.md §11 (new dep + bundle cost): it MUST stay a lazy-loaded client island with a reduced-motion + no-JS fallback (the current CSS flow view is exactly that fallback), and must not regress the 0-B-route-JS posture of the static pages — so scope it as an opt-in enhancement layer, not a replacement. Decide React Flow (interactive, heavier, MIT) vs Mermaid (declarative text→SVG, lighter, can pre-render at build) per surface; a build-time Mermaid→SVG render could even keep some surfaces 0-JS.

### The "Recipe Spider" — recipe synthesis over the capability graph (capstone vision)

> The long-horizon endpoint the capability keystone (AA–AF) is built toward: turn the verified
> capability graph into a system that connects apps into multi-app workflows on the fly from a user's
> intent. **Core principle — the graph connects the dots; the model only reads intent** (the model is
> the _lens_, not the _database_). Every proposed recipe is a path through _verified_ capability nodes,
> so the spider inherits the no-fabrication moat: the model selects from the closed `AppCapability` key
> space and can never invent an app. Three tiers, default on-device → escalate to cloud only for the
> hard cases:

- [ ] **[future]** **Tier 0 — deterministic (no model).** Intent→capability via `capability-aliases.ts` + a small keyword classifier, then graph path-finding over the capability index. Offline, zero
      inference cost. This is effectively the Recipes engine (AD/AE) itself — ships first, works alone.
- [ ] **[future]** **Tier 1 — small in-browser model.** An off-the-shelf **embedding model**
      (`transformers.js` / WebGPU) for semantic intent→capability matching over the controlled vocab;
      optionally a tiny generative model (WebLLM) for on-device recipe narration. **Do NOT train from
      scratch** — use stock permissively-licensed weights, optionally distill/fine-tune on our vocab.
      Private, offline, zero marginal cost. Model choice informed by the edge-model survey below.
- [ ] **[future]** **Tier 2 — cloud frontier (Claude), graph-grounded.** For novel / multi-constraint
      requests. Default **Claude Opus 4.8** (`claude-opus-4-8`) for synthesis, **Haiku 4.5** for cheap
      high-volume intent parsing. Three levers that keep it cheap + truthful: **prompt-cache the static
      capability-graph prefix** (~0.1× read cost — the key cost lever); **structured outputs**
      (`output_config.format`) so synthesized recipes validate against the _same_ recipe schema as
      hand-authored ones; **tool-use / MCP** exposing `capability → [slug]` / `alternatives` so Claude
      _traverses the real graph_ instead of recalling apps (eliminates hallucination at the source).
      Nearly free day-one once the machine surface (`capabilities.json` / llms.txt / function-calling,
      Chunk AC) ships — any LLM can already traverse the graph.
- [ ] **[verify]** **Edge-model survey for the Tier-1 browser model — survey DONE; A/B before committing.**
      Deep-research (this session: 20 verified primary sources) + direct re-verification of licenses/specs.
      Picks for the two Spider slots, strict-permissive (Apache-2.0 / MIT) tier:
  - **Embedding (intent → 155 capability labels):** start with **`bge-small-en-v1.5`** (MIT · 33M · 384d ·
    ~35MB · `transformers.js`-native) — ample for matching short intent to the 155 _precomputed_ label
    vectors (you only embed the query at runtime). Upgrade to **`Qwen3-Embedding-0.6B`** (Apache-2.0 ·
    MTEB Eng-v2 **70.70** / multiling **64.33** · MRL 32–1024d · 32K ctx · ONNX port) if multilingual
    intent or more headroom is wanted. `all-MiniLM-L6-v2` is the superseded old default — don't start there.
  - **Generative (recipe narration):** **`SmolLM2-360M-Instruct`** (Apache-2.0 · IFEval 41 ·
    `transformers.js`-native · 95 quantized variants) — smallest viable narrator. Step up to
    **`Qwen2.5-0.5B-Instruct`** (Apache-2.0) if narration reads thin.
  - **License traps flagged (avoid if strict OSI/Apache required):** **EmbeddingGemma-300M** is the best
    quality-per-byte on-device embedder (QAT + MRL→128d) **but is Gemma license, not Apache**, _and_ has no
    fp16 (WebGPU must run f32 → bigger/slower); **Gemma-3-270M** = Gemma terms; **Llama-3.2-1B** = Llama
    Community License _and_ >1B. (The research panel correctly killed a circulating "EmbeddingGemma = Apache-2.0" claim.)
  - **Before committing:** (1) measure the real INT4/INT8 ONNX **download sizes** (model cards omit MB) to set
    the browser first-load budget; (2) **A/B `bge-small` vs `Qwen3-Embedding-0.6B` on the actual 155-label set** —
    if bge-small clears the accuracy bar, the ~10× smaller download wins. Full report in this session's transcript.

### PWA

> The PWA ships with a hand-rolled, **build-stamped** service worker (`app/sw.js/route.ts` — a
> force-static route handler whose cache name embeds the deploy's build id), a custom bottom
> install prompt (`components/pwa/*`, `hooks/use-install-prompt.ts`), manifest
> shortcuts/screenshots, and an `/offline` fallback. These extend it further.

- [ ] **[future]** Revisit **Serwist / Workbox** (`@serwist/next`) if caching needs outgrow the hand-rolled shell SW (precise revisioning, richer runtime strategies, background sync). Gated by CLAUDE.md §11 — requires a new dependency **and** a `next.config.ts` change, so it needs explicit sign-off.
- [ ] **[future]** Aggressive offline — runtime-cache visited `/apps/<slug>` pages + the slim directory search JSON (`@/.velite` `apps-search.json`) so installed users can browse listings offline. More cache-invalidation surface; pair with a SW version bump strategy.

### Workflow

> **Status: `/workflow` is DORMANT (unpublished).** Iteration 5, out-of-sequence product-direction
> change: the section was taken off the live site to keep the homepage directory-focused and the
> detailed agentic-engineering process semi-proprietary. **Nothing was deleted** — the route was
> moved into the Next private folder `app/(marketing)/_workflow/` (underscore = excluded from
> routing), and `components/workflow/*`, `components/claude-chat/*`, `content/workflow/*` (stages +
> 12 artifacts), `hooks/use-workflow-*`, and `types/workflow.ts` all remain in the tree (unreferenced
> by any live route, so excluded from every shipped bundle). The polish items below only matter if/when
> it's republished.
>
> **To republish `/workflow`:**
>
> 1. `git mv "app/(marketing)/_workflow" "app/(marketing)/workflow"`.
> 2. `data/brand.ts` → re-add `{ href: "/workflow", label: "Workflow" }` to `nav` (this restores it in
>    site-nav, the mobile sheet, and the footer Sitemap list).
> 3. `components/command/command-palette-body.tsx` → re-add the `{ label: "Workflow", href: "/workflow" }`
>    entry to `PAGES`.
> 4. `app/sitemap.ts` → re-add the `/workflow` static route entry.
> 5. `components/effects/lenis-provider.tsx` → add `"/workflow"` back to `SMOOTH_ROUTES`.
> 6. Repoint the CTAs if desired: hero (`components/hero/hero-copy.tsx`) and Now/Next
>    (`components/home/now-next-band.tsx`) currently link to `#how-we-work` on `/about`; the footer
>    badge (`components/footer/site-footer.tsx`) links to `/about#how-we-work`. Consider whether the
>    new `components/home/how-we-work.tsx` `/about` band should stay alongside a republished `/workflow`.
>
> - [ ] **[future]** Build one or more of the three sample products for real — **Ignaite Brief** (arxiv →
>       paper digest), **Eval Forge** (spec → eval suite), **Edge Memo** (on-device meeting capture) — as
>       actual shipped apps and/or directory entries, rather than illustrative-only workflow narratives.
> - [ ] **[future]** **Remove the dormant `_workflow` tree entirely** (the end-state, _not_ a Velite
>       migration — keep it for reference only, then delete once we've extracted what we need from the
>       artifacts/transcripts). When pulled, delete `app/(marketing)/_workflow/`, `components/workflow/*`,
>       `components/claude-chat/*`, `content/workflow/*`, `hooks/use-workflow-{product,platform}.ts`, and
>       `types/workflow.ts`; drop the now-dead bits (`lenis` is already route-gated off `/workflow`, the
>       `nav`/`PAGES`/`sitemap`/`SMOOTH_ROUTES` entries are already removed — see the republish list above,
>       which becomes the deletion checklist in reverse). **First** grep that nothing live still imports
>       from those paths (the tree is currently unreferenced by any routed page, so this should be clean),
>       and decide whether the `/about` `how-we-work.tsx` band fully supersedes it. Supersedes the
>       republish path above — pick one.

- [ ] **[polish]** Code-reveal Shiki typing animation for inline beat content (the MDX artifact pages already syntax-highlight via `rehype-pretty-code`; this extends it to typing-animation reveals on scroll inside chapter beats).
- [ ] **[polish]** Keyboard navigation between beats + `?` shortcut help dialog.
- [ ] **[polish]** Evaluate GSAP-pinned scrolly chapters. The current sticky-column layout reads well; revisit if the cinematic pinning genuinely adds something.
- [ ] **[polish]** Chapter-1 chat-window streaming animation (currently the 6 messages reveal-via-stagger, not character-by-character).
- [ ] **[polish]** Chapter-2 document-stack hover Flip expansion (currently a simple grid of linked tiles).

### Hero

- [ ] **[polish]** Add ~200 instanced "packet" particles drifting along the flow-field gradient. Plan called for this; deferred so chunk 1 shipped clean.
- [x] **[polish]** Add a faint procedural dot-grid overlay to the hero shader to evoke block structure — landed in Iteration 2 as a 60-cell mask in `components/hero/shaders.ts` (Iteration 2, see Resolved).
- [ ] **[debt]** Migrate hero shaders from inline template literals in `components/hero/shaders.ts` to `shaders/*.glsl` files imported as raw strings (verify Turbopack's `?raw` path or add a loader). Marker: `TODO(debt)` in the file.

### Performance + ops

- [ ] **[polish]** Residual bundle gap after the chunk-2 trim sprint. `/apps` 146 KB, `/apps/[slug]` 134 KB, `/workflow/artifacts/[slug]` 134 KB, `/_not-found` 118 KB. The remaining mass is React 19 + Next 15 runtime + motion library — roughly the modern-Next floor. Further wins would require lazy-loading `motion/react` per feature (large refactor). CLAUDE.md §10 ceilings already updated to reflect realistic targets.
- [ ] **[polish]** Swap the in-memory IP rate limiter (`lib/rate-limit.ts`) for `@upstash/ratelimit` once we want hardened protection against sustained abuse. Today it resets on cold start and doesn't share state across regions — fine for expected volume.
- [ ] **[polish]** Playwright smoke suite for the hero, apps directory filter, workflow, and contact-form happy path. The CI workflow (`.github/workflows/ci.yml`) is ready to host a `test` job once the suite + `@playwright/test` land.
- [ ] **[polish]** **Browse projection** for the homepage's RSC props: `ToolsBrowser` receives all 459 full `App` records (~759 KB raw in the flight payload) but the browse surface only consumes ~480 KB of it (cards + search predicate + sort) — `changelog`/`references`/`pros`/`cons`/`longDescription`/`edge`/`bestFor`/`alternatives` are detail-only. A `BrowseApp = Pick<App, …>` projection passed from `page.tsx` would cut ~80 KB gz off `/`, but ripples prop types across ToolCard / ToolsBrowser / FeaturedCarousel / DirectoryEmpty / RevealToolGrid — its own focused PR. (Measured in Chunk V-1, deferred from #161.)
- [ ] **[debt]** **`recipes.json` co-bundles into the homepage client chunk via the `@/.velite` barrel.** The two homepage client components — `tools-browser.tsx` (imports `sponsored`) and `directory-console.tsx` (imports `apps`) — import the **barrel** `@/.velite`, whose `index.js` re-exports `apps` + `sponsored` + `recipes`. Turbopack does **not** tree-shake the generated barrel, so the full `recipes.json` (incl. the heavy `longSummary` + every `rationale`/`references`) rides into `/`'s ~2 MB apps data chunk even though no client component renders a recipe. Introduced by **AD (#352)** when the `recipes` collection was added to Velite — verified on `main` (it predates the AE routes; AE's own client surface — the ⌘K palette — is clean, importing only the slim `recipes-search.json`). Negligible today (4 recipes) but grows unbounded with the recipe count, which the roadmap intends to scale. **Unwind** (batch with the Browse-projection PR above — same homepage client-data path): have the two client components import the specific generated JSON directly (`@/.velite/apps.json`, `@/.velite/sponsored.json`) with a typed cast, OR emit a slim `apps`/`sponsored` client index in `velite.config.ts` (mirroring `apps-search.json`/`recipes-search.json`) and import that. Either stops `recipes.json` (and the unused sibling dataset) from shipping to every `/` visitor.
- [ ] **[debt]** The `/` **and `/apps/[slug]`** segments have **no route-level `loading.tsx`** — a deliberate workaround for [vercel/next.js#86151](https://github.com/vercel/next.js/issues/86151) (`loading.js` can leave a soft navigation stuck on the fallback forever; repro'd deterministically on prod builds at Fast-4G timing when navigating to `/?category=…` after the query was only ever set shallowly via nuqs `replaceState` — detail-page back-crumb and command-palette category jumps both hit it). The old group-level `app/(marketing)/loading.tsx` was split into per-route `about/loading.tsx` + `contact/loading.tsx`; `/` relies on its page-level `<Suspense>` fallback (real cards) instead, which is LCP-equivalent. The detail segment's `loading.tsx` was removed as the same bug class (couldn't be repro'd locally — 20+ throttled prefetch-blocked detail navs all committed — but the mechanism is identical and prefetched navs never showed that skeleton anyway); `components/detail/app-detail-skeleton.tsx` is retained unreferenced as the restore target. **Unwind**: once the upstream issue is fixed in our Next version, a group-root `loading.tsx` + the detail `loading.tsx` are safe again (drop the comments in `page.tsx` / `about/loading.tsx` / `contact/loading.tsx` / `app-detail-skeleton.tsx` with it). Marker: `vercel/next.js#86151` in those files.
- [ ] **[polish]** Native browser-back to a **deep** grid position clamps short (pre-existing, measured Δ≈3800px on prod main at ~72 cards): on popstate the grid remounts at the first `BATCH_SIZE` batch, so the page is too short when the browser applies its stored offset. The crumb's own restore (per-tab return record in `lib/tools/directory-session.ts`, applied by `tools-browser.tsx`) is exact and is the primary back path. Possible fix if native back ever matters: seed `visibleCount` from the (un-armed) return record whenever its query matches the mount — costs extra cards rendered on some fresh visits; needs a popstate-detection think-through first.

### Directory UX

- [ ] **[polish]** Category cluster picker (`components/tools/category-cluster-picker.tsx`): while a type-ahead query is active, an already-selected category can be filtered out of view. Selection stays visible via the console's active-filter pills + counts, but pinning selected chips above the cluster sections would make it self-evident.
- [ ] **[polish]** The `/contact` compare picker still renders the flat `POPULATED_CATEGORIES` list — adopt `CategoryClusterPicker` (or at least the cluster grouping from `lib/tools/category-clusters.ts`) there for the same scannability win.

### Tooling

- [ ] **[polish]** ESLint flat config doesn't yet enforce import order. Add `eslint-plugin-import` with `import/order` if import churn becomes painful in PR reviews.
- [ ] **[debt]** `lucide-react@1.x` dropped branded icons (Github, Discord, etc.) for trademark reasons — the footer ships hand-rolled inline SVG brand glyphs (`components/footer/site-footer.tsx`); anywhere else falls back to generic icons. Acceptable; could swap to dedicated brand-icon SVGs later if precision matters. (The old `components/apps/card-bits.tsx` glyph set went with the portfolio removal.)
- [ ] **[future]** JSON Schema for editor autocomplete on `data/apps/*.json`. Generate `data/apps/schema.json` from the zod `appSchema` (`lib/apps-schema.ts`) via `zod-to-json-schema` and add a `"$schema"` key per listing so VS Code offers field/enum completion + inline validation while a routine authors an entry. Needs a new dev dep → its own small PR.
- [ ] **[future]** **Portfolio revival path** — the dormant PORTFOLIO (Project) track was **fully removed in Chunk V (#163)**: `app/(marketing)/_portfolio/`, `components/apps/*`, `components/home/stats-strip.tsx`, `data/{projects,chains}.ts`, `lib/projects.ts`, `types/project.ts`. **Archive = git commit `12c3978`** (last commit containing the tree; WebSight OSS seed included). Inbound redirects (`/portfolio/*`, legacy `/apps/<slug>` explorers) remain in `next.config.ts`, and the removed `images.remotePatterns` (glitch/play-lh hosts) + CSP `img-src` entries must be re-added with it. If revived: restore from the archive commit, then migrate `data/projects.ts` → per-file `data/projects/<slug>.json` + a zod `projectSchema` under Velite (mirroring the apps + sponsored data layers) rather than resurrecting the monolith as-is.
- [ ] **[future]** **Revisit / repurpose the retained `_workflow` tree** — `app/(marketing)/_workflow/`, `components/workflow/*`, `components/claude-chat/*`, `content/workflow/*`, `hooks/use-workflow-*`, `types/workflow.ts` are deliberately KEPT in-repo (owner decision, Chunk V) as raw material for a possible future feature (e.g. a "how this directory is managed" interactive, or a new narrative surface). Periodically reassess: republish, repurpose, or — if a year passes untouched — remove like the portfolio (git history archives it either way).
- [ ] **[future]** **Curated tag landing pages** — tag chips on detail pages deep-link to `/?q=<tag>` (Chunk V-2); real `/tag/<slug>` pages were deliberately skipped: 793 distinct free-form tags, 59% used by exactly one app (thin-page risk), top tags duplicating facets (`open-source` = license, `agents`/`mcp` = categories). Precondition for pages: tag taxonomy curation — synonym cleanup, drop facet-duplicates, ≥5-app threshold, an allowlist map (mirroring `category-meta.ts`).
- [ ] **[polish]** Optional `slug === filename` guard in the Velite `complete()` hook (`velite.config.ts`) — catch a listing whose `slug` drifts from its `data/apps/<slug>.json` filename. The hook already throws on **duplicate** slugs/ids (see Resolved); this is the remaining **drift** case. Marginal: the kebab-case slug regex + unique filenames already prevent most drift, and a mismatch is harmless (Velite reads `slug` from content), just confusing. (Velite's `complete` records don't carry the source filename, so this needs a small custom loader or a glob read.)
- [ ] **[future]** **Auto-merge for routine PRs (`/discover-apps` + `/audit-directory`) once CI is green — deferred; revisit after watching a few weeks of routine runs.** Today both routines open a PR and **stop** for human review. Tempting to auto-merge so new listings / audit refreshes go live without manual merge, **but** the strict CI gate validates _form, not truth_: schema/typecheck/lint/build/Lighthouse all pass green on a **fabricated** pricing tier, a hallucinated `insight`, a mischaracterized or scammy app, or a 200-but-wrong link. Auto-merge to `main` = auto-deploy to prod with no human eyes, which also cuts against the site's own model (vibecoding = "human as **architect/reviewer**"). Three options on the table when we revisit:
  1. **Tiered (recommended):** auto-merge **only freshness-only `audit-directory` PRs** (just `lastVerifiedAt` bumps, CI green, no "needs human" flags) — the frequent, tedious, genuinely-safe case; keep `discover-apps` + any audit PR that changes a real field (pricing/archive/links) manual. Highest convenience-to-risk ratio.
  2. **Full auto-merge both** on green — max autonomy, but unreviewed net-new AI content (highest fabrication risk) ships to prod; relies on easy revert + periodic spot-checks.
  3. **Keep review, cut the friction** — no content auto-merge; just enable GitHub one-click auto-merge + repo "auto-delete head branches" so approval is one click and branches self-clean.
     **Mechanism** (whichever we pick): prefer GitHub-native auto-merge (`enable_pr_auto_merge`, squash) so the routine enables-and-exits rather than babysitting CI; require the CI checks via branch protection; enable auto-delete-branch-on-merge. Hard guardrail: never auto-merge a PR carrying a "needs human re-verify / needs human decision" flag. Optional stronger gate: an independent AI fact-check pass as a required check before auto-merge (caveat: AI-checking-AI → correlated blind spots, don't rely on it alone for `discover`).

### Future scope (post-v2)

- [ ] **[future]** Seed one real `oss-repo` entry in `data/projects.ts` once the first Blokz OSS repo is published. The OSS card variant already ships exercised via the "coming-soon" placeholder.
- [ ] **[future]** Add the first iOS title to `data/projects.ts` once it ships. The workflow page currently surfaces iOS as an aspirational platform tab.
- [ ] **[future]** Per-page OG image generator on `/workflow/artifacts/[slug]` (dormant — inherits the parent route's OG). _(The `/apps/[slug]` half is done — see Resolved.)_
- [ ] **[future]** Public "build log" page that timestamps each commit to the revamp with a short rationale — meta proof of the vibecoding workflow.
- [ ] **[future]** Surface the `addedSeq` accession number in the UI — e.g. a small mono "№ 217" on the detail page (or card hover), leaning into the catalog/registry identity. The data is already there (every listing carries a unique, never-renumbered seq powering the Newest/Oldest sort); this is purely a presentation decision.
- [ ] **[future]** Category quick-jump chip rail above the featured carousel (deep-links the directory filter). Considered during Chunk I and deferred: three category-jump surfaces already sit near the top (filter-bar category row, empty-state recovery chips, ⌘K Categories group), so a fourth risked clutter. Revisit if discovery analytics show users aren't finding the category filter.
- [ ] **[future]** **Google AdSense / programmatic ads — evaluated and deferred (not recommended now).** The sponsored slots are intentionally **curated direct-sold / affiliate** placements (`data/sponsored/*.json` + `SponsoredCard`), which is on-brand for an AI-managed, neutral directory and keeps the privacy-friendly, fast stack intact. AdSense was considered and rejected for v2 because it conflicts with the core constraints: (a) **perf budget** — `adsbygoogle.js` is a heavy third-party script with layout shift, against CLAUDE.md §10 (LCP <2.5s, CLS <0.05, Lighthouse ≥90 / Best-Practices 100); (b) **brand** — programmatic "around the web" units undercut the curated/editorial positioning; (c) **compliance** — personalized ads need a GDPR/ePrivacy **consent banner + CMP** (IAB TCF) and a **privacy-policy page**, none of which exist today; (d) **overhead** — AdSense account + site approval + a root **`ads.txt`** (note: the existing `public/app-ads.txt` is the unrelated Play Store/AdMob file). **If ever revisited:** add it behind an env-gated, lazy-loaded, consent-gated boundary with reserved ad-slot space (protect CLS); config would live in env vars (`NEXT_PUBLIC_ADSENSE_CLIENT` + per-slot ids) + `ads.txt`; the `SponsoredSlot.tracking` `{ impressionPixel, clickPixel }` fields already cover direct-sold measurement without any network.
- [ ] **[future]** Long-form app pages are a wired-but-unused skeleton: the schema declares `hasLongForm` + `longDescription` (`lib/apps-schema.ts`) and `app-detail.tsx` already renders `longDescription` if present, but 0/125 listings set either, there's no `content/apps/` directory, and no `/apps/[slug]` long-form route. Either build it out (author `content/apps/<slug>.mdx` for a few flagship apps + an MDX viewer) or drop the two fields. No-op as-is; decide when the first app warrants a deep dive.

---

## Resolved (rolling archive)

Iteration 10 — Performance + SEO (Chunk V)

- [x] **[debt]** SW stale-`/offline`-precache across deploys — fixed in #163 by replacing static `public/sw.js` with the build-stamped `app/sw.js/route.ts` (force-static route handler; cache name embeds `VERCEL_GIT_COMMIT_SHA` → every deploy byte-diffs the worker → reinstall → fresh precache, and the activate sweep deletes the prior cache generation).
- [x] **[verify]** Lighthouse-CI Best-Practices "CSP/COOP header pass to reach a real 100" — shipped in #163 (`next.config.ts` `headers()`: CSP + COOP + Referrer-Policy + nosniff + Permissions-Policy). The CI gate stays `warn 0.95` (NOT promoted to error): the `/_vercel/insights/*` 404 console errors persist on non-Vercel runners and cap the CI score independently of headers; prod on Vercel is clean.

Iteration 8 — Ignaite rebrand + directory product polish (chunks P–S)

- [x] **[polish]** Loaded **Geist Sans + Geist Mono** into the OG image template so social-share cards match the live site's display type. `lib/og-image.tsx` now reads the TTFs from `node_modules/geist/dist/fonts` (Satori's default system sans is gone). Landed with the enriched per-app share card (#128).
- [x] **[future]** Per-app OG image generator on **`/apps/[slug]`** — `app/(marketing)/apps/[slug]/opengraph-image.tsx` renders a dedicated, enriched share card instead of inheriting the parent route's OG (#120–#131). _(The `/workflow/artifacts/[slug]` half stays open + dormant — see Future scope.)_
- [x] **[polish]** Full PWA installability shipped — hand-rolled service worker (`public/sw.js`), custom bottom install prompt (`components/pwa/*`, `hooks/use-install-prompt.ts`), manifest shortcuts, and an `/offline` fallback (#116). _(Supersedes the old "add a service worker if install rate becomes a goal" note; the PWA section header above now documents the shipped shell.)_
- [x] **[debt]** Sonner `<Toaster>` is **mounted and live** — `components/tools/tools-browser.tsx` mounts `<Toaster/>` and `hooks/use-directory-filters.ts` fires the "Filters cleared / Undo" toast on clear-all. The old "never mounted → toast() is a no-op" concern no longer holds; the toast is scoped to the one route (the directory) that has a caller.

Iteration 5 Chunk F — Directory data layer + signals/positioning refresh

- [x] **[debt]** Directory data split from the monolithic `data/apps.ts` array (125 entries — a merge-conflict bottleneck for the weekly `/discover-apps` + `/audit-directory` routines, with no semantic validation) into **one JSON file per listing** at `data/apps/<slug>.json`, validated by a zod schema that is now the single source of truth (`lib/apps-schema.ts`; `App = z.infer<…>`, no hand-maintained interface) and aggregated by **Velite** (`velite.config.ts` → gitignored `.velite/`). The schema enforces what `tsc` can't (kebab slug, tagline ≤100, insight ≤140, ≥1 platform, exactly one primary link, hex colour, ISO dates, and **featured ⇒ accentColor**). A Velite `complete` hook emits a slim `apps-search.json` so the command palette (on every page) ships ~5 fields × 125 instead of full records — verified no full data / zod / velite in any client chunk. `velite build` is prepended to dev/build/typecheck/lint; routines + CLAUDE.md + README updated to author/validate per-file JSON.
- [x] **[polish]** Retired the studio-centric `blokzMark` editorial badge in favour of a **derived license signal** (`lib/tools/license.ts`: open-source / open-core / proprietary from `openSource` + `pricing`) on the card, detail, and Source filter. Proprietary is the intentional unbadged default (see comment in `tool-card.tsx`).
- [x] **[polish]** Authored a per-listing `insight` (the directory's signature signal — ≤140-char, non-obvious, verifiable editorial one-liner) across all 125 listings; rendered on card + detail.
- [x] **[debt]** Brought the **sponsored slots** under the same per-file-JSON + zod + Velite pattern as apps: `data/sponsored.ts` → `data/sponsored/<id>.json` validated by `sponsoredSchema` (`lib/sponsored-schema.ts`, now the source of truth; `Sponsored = z.infer<…>`, `types/sponsored.ts` re-exports it type-only as `SponsoredSlot`). Added a second Velite collection (`velite.config.ts`); the client browser imports the generated array from `@/.velite` (no zod/velite in the client chunk). The schema allows the slot link to be a root-relative path (the `/contact?subject=…` self-promo) as well as absolute http(s). Also **jittered the interleave cadence** from a rigid every-12 to a seeded, deterministic 10–15 gap (`lib/interleave.ts` now takes `number | { min, max, seed }`) — varied spacing that still agrees SSR↔client and stays append-stable across infinite-scroll batches.
- [x] **[verify]** Made the Velite data gate **hard** so bad data from the weekly `/discover-apps` + `/audit-directory` routines fails CI instead of silently vanishing. Previously a schema-invalid `data/apps/*.json` / `data/sponsored/*.json` was dropped from output with the build still **green** (exit 0). **Key finding:** the config-level `strict: true` is a **no-op in Velite 0.3.1** — only the **`--strict` CLI flag** sets a non-zero exit. So `--strict` is now appended to the `velite build` invocations on the CI + pre-push paths in `package.json` (`velite`, `build`, `lint`, `typecheck`, `analyze`); `dev` is left lenient so a half-written file mid-edit doesn't kill the dev server (errors still print). Per-file schema validation can't see cross-file collisions, so the Velite `complete()` hook also **throws on duplicate app slugs / sponsored ids** (a thrown error there exits non-zero too — verified). All 125 apps + the sponsored slot re-validated clean against the stricter gate; tested that a malformed entry and a duplicate slug each exit 1.
- [x] **[polish]** Repositioned the site from "vibecoding studio / AI app studio" to an **AI-managed directory** (`data/brand.ts` hub → hero, SEO, OG, footer colophon "Built & operated by Blokz Development Co.", Organization JSON-LD). Stale `~70`/`Blokz-mark` README copy corrected to `~125`/`license`.

Iteration 5 Chunks L–M — About/Portfolio revamp + global chrome + a11y gate

- [x] **[a11y]** Raised the Lighthouse-CI accessibility gate back to **0.98** (`lighthouserc.json`). Contrast offenders fixed across Chunks L + M: introduced `--color-ink-soft`; removed the sub-AA `text-ink-dim/70` labels in `card-bits` `StatLine`, `scroll-cue`, `project-filter-bar` (L), and the `/contact` placeholder + char-count hint `…ink-dim/60` (M-2). All five audited routes now clear AA on the static audit.
- [x] **[polish]** (M-1) Auto-hiding sticky nav + directory filter-bar pin via a shared `--nav-h`; ⌘K palette trigger (desktop pill + mobile sheet item); active-route highlight (`lib/nav.ts`). (M-2) `100dvh` body + `min-h-dvh` hero + global `scroll-padding-top: var(--nav-h)` (replaced per-section `scroll-mt-24`).

Iteration 5 Chunk K — /workflow redesign (chat-transcript narrative)

- [x] **K-1/K-2** `/workflow` rebuilt from the 5-phase R3F/scrolly narrative into a 4-stage Claude Code **session** (`conceptualize → specify → build → ship`), each rendered as a chat transcript via the reusable `components/claude-chat/*` family (`claude-chat` window, `chat-message`, `tool-block`, `harness-bits` DocGraph/PlanChecklist). Data model moved from `content/workflow/phases.ts` (`Phase`) to `content/workflow/stages.ts` (`Stage` + `ChatMessage[]` transcripts). New `workflow-intro.tsx` (agentic-engineering framing + one-time setup + DocGraph) and `stage-segment.tsx` shell. Deleted: `phase-chapter.tsx`, `chapter-{conceptualize,spec,environment,develop,ship}.tsx`, `build-tunnel.tsx` + fallback. **`/workflow` no longer loads `three`/R3F** — R3F is now hero-only. The 12 MDX artifacts are unchanged and still SSG.
- [x] **K-3** Transcripts revoiced to the founder register ("Natural & direct" — the `you` lines read like a real builder talking to their agent), Specify→Build handoff smoothed. **Platform correctness fixed**: `ChatToolBlock` `run` blocks now accept `cmd: string | Record<WorkflowPlatform, string>`, so the Build verify (`pnpm test` / `gradle test` / `cargo test` / `xcodebuild test`) and Ship deploy (Vercel / fastlane / winget / TestFlight) commands flip with the platform tab — not just the `note` lines.
- [x] **K-3** Dropped the unused `canvas-confetti` + `@types/canvas-confetti` deps (the chapter-5 ship-beat confetti was deleted with the redesign; grep-confirmed no source refs). `-1` runtime dep, `-1` dev dep.
- [x] **K-3** Reconciled `CLAUDE.md` to the redesign — folder map, §2 stack note (R3F hero-only), §5/§12 "add a workflow stage" recipes, §8 motion/3D rules (no R3F or confetti on `/workflow`).

CI — continuous integration gate

- [x] Core CI workflow `.github/workflows/ci.yml` — on every PR + push to `main`: `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `build` (Node from `.nvmrc`, pnpm from `packageManager`, store cached). Gives the "CI green" gate the merge workflow depends on.
- [x] **[polish]** Lighthouse-CI job in the same workflow (`lighthouserc.json`) — audits `/`, `/about`, `/workflow`, `/contact`, and a sample `/apps/<slug>` against the production build. Hard gates: accessibility ≥ 0.98, best-practices = 1.0, SEO = 1.0; performance is a warning (CI runners are too noisy to block on). Reports upload to temporary public storage.

Sub-plan B-2 / B-3 — Workflow artifact fill-in

- [x] **B-2** Eval Forge artifacts fleshed out to Blokz Brief depth — `content/workflow/artifacts/forge/{claude-md,prd,spec,prompt-library}.mdx`. Concept banners, `(sketch)` labels, and "lands with Sub-plan" footers removed; full section sets, tables, and code blocks added (web dashboard + Rust `clap` CLI + emitted Vitest harness + GitHub Action gate; `EvalKind` / `GoldCase` / `RunResult` shapes; meta-eval scorer).
- [x] **B-3** Edge Memo artifacts fleshed out to Blokz Brief depth — `content/workflow/artifacts/memo/{claude-md,prd,spec,prompt-library}.mdx`. Same scaffolding removed; on-device iOS-first pipeline (three quantized Core ML models — transcribe / summarise / extract), privacy-first guardrails (offline by construction, opt-in self-hosted E2EE sync), goldset scored on WER + action-item recall.
- [x] `content/workflow/phases.ts` header comment updated — all three products now carry full beats + artifacts; only voice/tone polish remains (now an active **Pre-launch polish** item).

Iteration 2 — Home page refinement + apps lifecycle (this branch)

- [x] Hero copy refreshed in `data/brand.ts` — title `"AI apps."` / titleAccent `"Built by AI."` / sub leads with research areas (multi-agent, edge inference, memory) and closes on Claude Code. Owns the meta-loop framing (AI building AI) as the brand's distinctive claim; replaces the four-fragment buzzword stack and does not lean on the legacy Android portfolio as identity.
- [x] Hero typography rebalanced in `components/hero/hero-copy.tsx` — title line now Geist Sans medium with tight tracking; accent line keeps Instrument Serif italic. Honors CLAUDE.md §10 "serif for display accents."
- [x] Hero capability strip added — mono `MULTI-AGENT · EDGE INFERENCE · MEMORY ARCHITECTURES · BUILT WITH CLAUDE CODE` between sub and CTAs.
- [x] Hero shader refined in `components/hero/shaders.ts` — saturation knocked down (accent mix `0.85→0.55`, hot `0.55→0.30`, glow `0.12→0.08`) and a 60-cell procedural dot-grid added to evoke block structure. Closes the long-standing BACKLOG hex-lattice item.
- [x] New `components/home/now-next-band.tsx` — a two-column glass band between hero and manifesto framing the studio's pivot: NOW (production Android apps, runway) / NEXT (AI for B2B + B2C, agentic engineering, link to `/workflow`).
- [x] Scroll cue redesigned in `components/hero/scroll-cue.tsx` — replaced the rotated "SCROLL" + vertical line with a "Now · Next" preview label and a small bobbing chevron-down.
- [x] Manifesto header tightened in `components/manifesto/manifesto.tsx` — "Five things we believe." → "What we believe."
- [x] `types/project.ts` `ProjectStatus` union extended with `"deprecated"` (between `coming-soon` and `archived`).
- [x] `components/apps/card-bits.tsx` `STATUS_MAP` extended with a `DEPRECATED` pill (neutral grey variant, dot at 0.7 opacity — same treatment as archived).
- [x] `lib/projects.ts` `statusOrder` extended so deprecated sorts after coming-soon, before archived.
- [x] `data/projects.ts` — **Blockscan** and **SlyFox** marked `status: "deprecated"` and dropped from `featured`. **Etherscan** and **TRON Explorer** flagged `featured: true` so the home-page apps preview keeps three live cards covering distinct chains (Blockchair / Etherscan / TRON Explorer).

Iteration 1 — Brand pivot to the AI frontier (Sub-plan A)

- [x] **[user]** LinkedIn URL fixed — `data/brand.ts` now `linkedin.com/company/blokzdev/`.
- [x] Brand positioning sweep — `data/brand.ts` tagline + positioning + headline (eyebrow + titleAccent + sub) refreshed to lead with AI as the frontier, anchored on shipped work, gesturing at web3/edge/multi-agent as stacks chosen by user pain.
- [x] Manifesto principle 02 — replaced "Decentralization is a UX problem" with "Research-rooted. User-driven." Principle 05 body tweaked to acknowledge AI assistants alongside chain explorers.
- [x] `/apps`, `/contact` page sub-copy refreshed to match new positioning.
- [x] Root OG image — eyebrow `// AI APP STUDIO`, titleB `AI at the frontier.`
- [x] `lib/seo.ts` keywords — dropped web3 emphasis, added AI app studio / applied AI / edge AI / multi-agent systems / memory architectures / B2B AI / B2C AI; kept blockchain + block explorer (real shipped products).
- [x] `data/projects.ts` — seeded an additional `type: "web-app"` `coming-soon` placeholder ("AI app in motion") so the Web card variant also ships exercised.

Sub-plan B (workflow narrative migration) is now an active **Pre-launch polish** item — see below.

Phase 5 chunk 3 (commit `d15a086`)

- [x] **[polish]** `app/icon.tsx` and `app/apple-icon.tsx` — dynamic favicons via `next/og` `ImageResponse`.
- [x] **[future]** Per-page OG image generators on `/`, `/apps`, `/workflow`, `/contact` via the shared `lib/og-image.tsx` template.
- [x] Site-wide `Organization` JSON-LD in `app/layout.tsx`.
- [x] A11y — `aria-hidden` on decorative R3F canvases (hero + build-tunnel).

Phase 5 chunk 2 (commit `4b3134f`)

- [x] **[polish]** Bundle trim — lazy `MobileSheet` (Radix Dialog deferred), scoped `NuqsAdapter` to `/apps`, gated `LenisProvider` to `/` + `/workflow`. ~20 KB off every route's First Load JS; ~10 KB off shared chunks.

Phase 4

- [x] **[polish]** Chapter 1 visual treatment — Mac-style chat window with 6 staggered messages.
- [x] **[polish]** Chapter 2 visual treatment — 3 doc tiles linking to live artifact pages.
- [x] **[polish]** Chapter 3 visual treatment — faux zsh terminal, AnimatePresence-keyed swap per platform tab.
- [x] **[polish]** Chapter 4 visual treatment — R3F build-pipeline tunnel with scroll-driven camera dolly, ring-glow lerp, and reduced-motion SVG fallback.
- [x] **[polish]** Chapter 5 visual treatment — release-train station strip with canvas-confetti burst on the Shipped station.
- [x] **[polish]** MDX pipeline + `/workflow/artifacts/[slug]` route + 4 sample artifacts.

Phase 5 chunk 4 (this commit)

- [x] **[debt]** `README.md` rewritten — project intro, stack, quick start, common commands, what's in the box, project structure pointer, adding a project recipe, deploy notes, license link.
- [x] **[user]** `.env.example` authored with inline comments for `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
- [x] `CLAUDE.md` §10 perf budget refreshed — ceilings updated to realistic numbers; framework-floor explainer added.

Phase 1–3 (rolling)

- [x] **[debt]** `lucide-react@1.14.0` characterised — confirmed canonical package; brand icons removed by upstream and mitigated with inline GitHub/GitLab SVG.
- [x] **[polish]** Seed an `oss-repo` placeholder card in `data/projects.ts` (status `coming-soon`) so the OSS card variant ships exercised.
