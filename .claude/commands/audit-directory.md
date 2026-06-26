---
description: Review existing directory listings — verify links, pricing, status; refresh lastVerifiedAt
argument-hint: [--category <c>] [--stale-since <YYYY-MM-DD>] [--min-age <days>] [slug ...]
---

You are auditing existing entries in the Ignaite **AI-apps directory** — one JSON file per listing
at `data/apps/<slug>.json`, validated by the zod schema in `lib/apps-schema.ts`. The goal is a
trustworthy, current directory. **Never fabricate** — if you can't verify a change, leave the data
and flag it.

Scope: **$ARGUMENTS**

- No args → review the entries with the **oldest `lastVerifiedAt`** first (grep `data/apps/*.json`
  for `lastVerifiedAt`, sort oldest-first). **Then apply the freshness floor:** drop any entry whose
  `lastVerifiedAt` is **within the last `--min-age` days (default 14)** and take a manageable batch from
  what remains — e.g. 10–15, not all 125 at once. The floor avoids needlessly re-checking still-fresh
  entries and stops two overlapping/too-frequent runs from both grabbing the same stale tail (the second
  run finds the first's just-stamped entries inside the floor). If **every** remaining entry is inside
  the floor (the directory is fresh), the batch is empty → **do nothing** (no PR).
- `--category <c>` → only that `AppCategory` (freshness floor still applies — oldest-first within it).
- `--stale-since <date>` → only entries with `lastVerifiedAt` older than that date (a more explicit
  floor; the default `--min-age` floor still applies on top unless you pass `--min-age 0`).
- `--min-age <days>` → override the 14-day skip floor (e.g. `--min-age 7` for a tighter cycle;
  `--min-age 0` disables it entirely). Applies to batch selection (no-args / `--category` /
  `--stale-since`) — **never** to explicit `slug`s.
- explicit `slug`s → just those, **regardless of freshness** (naming a slug forces a re-verify; the
  floor is skipped for them).

For each entry in scope:

## 1. Verify it's alive + correct (web)

- WebSearch/WebFetch the official site + pricing page. Check:
  - **Links resolve** (primary + secondaries). An anti-bot block (`403`/`429`/`503`) on a
    **demonstrably live** site is OK — corroborate liveness via independent current sources;
    a `404`, dead domain, or redirect to a parked/acquired page is not.
  - **Pricing tier** still matches (`free`/`freemium`/`paid`/`byo-key` — cost only).
  - **`openSource`** correct (true when the app's own source is open; separate from price) and
    **`deployment`** correct (`cloud`/`self-host`/`local`/`hybrid`, where it's a real axis).
  - **Platforms** + **model support** still accurate (new mobile app? dropped a platform? model rename?).
  - **`capabilities` still accurate** — each listed leaf `id` is still a _confirmed shipping feature_
    (vendor dropped one? a genuinely new shipping feature to add?). ids only; web-verify-or-omit, the same
    bar as `insight` — never inferred from the name/category/our prose; if no leaf fits a real feature,
    omit rather than near-miss-map. Cap 6; dup ids hard-fail the build.
  - **`bestFor` is persona/audience only** — WHO it's for, not WHAT it does. If an older entry still
    carries task phrases ("Contract review"), move them into `capabilities` and leave only the audience.
  - **Still operating** — not shut down, sunset, or fully absorbed into another product.
  - **`insight` ("Worth knowing") still true** — the fact hasn't gone stale (the acquisition closed,
    the rename completed, a "first" no longer holds). Rewrite if reality moved; if it has drifted into a
    description paraphrase or a re-statement of `edge`, sharpen it to a real fact or drop it.
  - **No cross-field redundancy** (the rule in `add-app.md`) — re-read `tagline`, `description`,
    `insight`, `edge`, `pros` together: the `tagline` should _describe_, not sell (no stats/superlatives/
    comparison), and a distinctive stat/phrase should appear in `description` once + at most one of
    {`edge`, `pros`}, never stacked across tagline + edge + pros. If a point echoes, give it one home
    (comparative → `edge`; fact → `insight`; one strength among several → `pros`) and strip the rest;
    rework a tagline that sells into one that describes. Editorial-only fixes like this still get a
    `changelog` entry only if they ride along with a substantive change — a pure wording dedup does not.
  - **`references` resolve** — if present, link-check each third-party reference URL (an anti-bot
    `403`/`429`/`503` on a live source is OK; 404/dead → drop or replace). Confirm an `edge`/`cons` claim hasn't gone stale (a gap the app has
    since closed, a differentiator a competitor matched).
- **Backfill:** if an entry is missing `openSource`/`deployment` and the value is verifiable, add it
  (this is how full coverage of those facets completes itself over the weekly cycle). Leave
  `deployment` unset for pure libraries/SDKs/extensions. Likewise, if an entry has no `insight` and a
  sharp fact verifies, author the "Worth knowing" fact (≤140 chars — see `add-app.md`); otherwise leave
  it unset (coverage is intentionally partial — a real fact or nothing). **Also backfill
  the "honest brief" fields** — `edge`, `pros`, `cons`, `bestFor`, `capabilities`, `alternatives`, `references`
  (specs in `add-app.md`) — where research surfaces verifiable content. Same no-fabrication bar: `references` are
  verify-or-omit (real third-party URLs only); `alternatives` must be existing slugs; `capabilities` are leaf `id`s
  for **confirmed shipping features only** (web-verify-or-omit, ≤6, no near-miss mapping); never invent a
  `con` or a differentiator. (This backfill is how full `capabilities` coverage of any apps added before the
  routine authored them — or added by a discovery run that predates it — completes itself over the cycle.) **Also curate `secondaryCategories`** (≤2; spec in `add-app.md`): if the
  listing clearly has a genuine **second home** category it isn't tagged with, add it; if a tagged
  secondary no longer fits, drop it. Strict bar — a real second home a user would also look under, never
  the primary, never a tag-mention. Most entries have none; this is how full multi-category coverage
  completes itself over the cycle.

## 2. Apply fixes

- Update changed `pricing`, `platforms`, `modelSupport`, `tags`, `vendor`, `links` (fix/replace dead
  URLs), the `category`/`secondaryCategories` classification, or any stale enrichment field (`edge`,
  `pros`, `cons`, `bestFor`, `capabilities`, `alternatives`, `references`).
- If an app is **discontinued / shut down**, set `status: "archived"` in its JSON (the file stays as
  record, hidden from the default browse) — don't delete the file.
- If a featured app is no longer a standout, consider dropping `featured`.
- **Bump `lastVerifiedAt` to today** on every entry you actually re-verified (whether or not it changed).
- Keep edits minimal + within the schema (`lib/apps-schema.ts`; types in `types/app.ts`). Editing
  separate per-slug files means a multi-entry audit won't conflict with a parallel discovery run.

## 2.5 Record the change (`changelog`) — only when something actually changed

Whenever you apply a **substantive** edit above (pricing, platforms, modelSupport, links, `openSource`,
`deployment`, `status`, `insight`, `vendor`, `tags`, `featured`, a **`category` change or `secondaryCategories`
recategorization**, or an `edge`/`capabilities`/`alternatives` change — but **not** a pure first-time
`capabilities` backfill, which is like initial authoring), **append an entry** to that listing's `changelog`
array — this is the visible audit trail on the app detail page. (A pure first-time backfill of enrichment
fields — including first-time **adding** `secondaryCategories` to an unclassified entry — needn't log a
changelog entry; it's like the initial authoring. Only log when you _change_ an existing value or correct
one — e.g. moving the primary `category`, or removing/swapping a secondary that no longer fits.) Shape (schema:
`changeEntrySchema` in `lib/apps-schema.ts`):

```json
{
  "date": "<today, YYYY-MM-DD>",
  "kind": "updated",
  "summary": "One sentence (≤200 chars): what changed, and why for a correction.",
  "asOf": "<YYYY-MM-DD>",
  "source": "https://…"
}
```

- **`kind`** — `updated` (the app itself changed upstream) · `fixed` (our data was wrong and you
  corrected it) · `archived` (discontinued/sunset) · `relisted` (brought back after archival).
  (`added` is reserved for `/add-app`; the detail page derives the origin node from `addedAt`.)
  Never touch `addedAt` or `addedSeq` (the accession number) — they record when the listing entered
  the directory, which an audit can't change; archived/relisted entries keep theirs.
- **`summary`** — concrete and specific ("Pricing moved from free to freemium — added a $20/mo Pro
  tier", not "updated pricing").
- **`asOf`** — the real-world date the change happened upstream, **only if you can source it** (a
  changelog, release note, dated blog/commit). Omit if you can't pin it — never guess.
- **`source`** — the URL you verified the change against (the pricing page, the LICENSE file, the
  shutdown notice). Strongly preferred; omit only if there's genuinely no linkable source.
- **Do NOT** add an entry for a plain re-verification with no change — that's just the `lastVerifiedAt`
  bump. The `changelog` is for real changes only, so it stays meaningful. Append (newest end is fine —
  the page sorts by date); keep prior entries intact (append-only).

## 3. Validate + report

- `pnpm velite` (runs `velite build --strict` — schema-validates every touched JSON, exiting non-zero
  with precise per-file errors), then `pnpm typecheck`, `pnpm lint`, `pnpm build` clean. These are the
  **same gates CI runs**, so a clean local run means CI will pass (this is what lets the scheduled mode
  below auto-merge without babysitting).
- **Interactive run:** report a concise diff (entries reviewed, what changed and why, what was
  archived, anything ambiguous needing a human decision). Don't commit unless the user asked.

## Scheduled / unattended mode (run by a Routine)

When there's no human in the loop (a scheduled Routine invoked this), default to **no args** → the
oldest-`lastVerifiedAt` batch **past the 14-day freshness floor**, then:

- The floor is what makes back-to-back scheduled runs safe: a second run fired in the same window finds
  the first run's just-stamped entries inside the floor and **no-ops cleanly** rather than re-verifying
  fresh data. If the whole directory is within the floor, do nothing.
- Apply the verified fixes and bump `lastVerifiedAt` as above.
- If anything changed: create a branch (e.g. `claude/audit-directory-<date>`), commit, push, and open
  a PR into `main` summarizing the diff + any "needs human decision" items. Then **enable squash
  auto-merge and END the run** — do **not** subscribe to the PR, watch CI, sleep, or schedule a
  check-in. You already passed every CI gate locally and auto-merge fires only on green, so GitHub
  merges it server-side once CI passes and deletes the branch (the repo has auto-merge +
  delete-head-branch on); if CI ever fails the PR just stays open for the next run or a human. Because
  an audit edits **trusted factual data**, its guard isn't a pre-merge review but the routine's
  discipline — change only when the source contradicts, a cited `changelog` entry per substantive
  change (step 2.5), and `git revert` as the undo. (A genuinely ambiguous "needs human decision" item is
  the exception: leave that entry unchanged and call it out in the PR body rather than guessing.)
- If nothing changed: **do nothing** — no branch, no empty PR. Briefly state the batch was clean.

Cadence: run ~weekly (or before a release), cycling oldest-`lastVerifiedAt` entries first so the whole
directory rotates through verification over time.
