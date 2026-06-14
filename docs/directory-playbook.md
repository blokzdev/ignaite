# Directory playbook

The AI-apps directory at `/` is the product. Its value is being **comprehensive, current, and
trustworthy** — so growing it and maintaining it is a recurring activity, not a one-off. This page is
the human overview; the executable routines live as Claude Code commands.

## The routines

| Command                                                            | Driven by                       | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/add-app <name \| url \| list>`**                               | a human supplies names          | Dedup → web-research → author a schema-valid `App` entry → validate → report.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **`/discover-apps [focus]`**                                       | autonomous (good for schedules) | Finds net-new apps not yet listed (dedups against `main` **and** open discovery PRs; biases toward the thinnest under-covered categories, never padding sparse ones), authors the worthy ones, and **opens a PR**. The unattended counterpart to `/add-app`. Run manually it just opens the PR; the **scheduled routine is fire-and-forget — it enables auto-merge and ends, and GitHub lands the PR server-side once CI is green** (see [Scheduling](#scheduling-claude-code-routines)). |
| **`/audit-directory [--category c] [--stale-since date] [slug…]`** | manual or scheduled             | Re-verifies existing listings (links, pricing, platforms, model support, still-alive), fixes drift, curates `secondaryCategories`, archives discontinued apps, bumps `lastVerifiedAt`; **opens a PR** when run unattended.                                                                                                                                                                                                                                                                |
| **`/rotate-featured [count \| cluster]`**                          | autonomous (good for schedules) | Refreshes the homepage **Featured carousel** so it never goes stale: features one strong active app across ~14 random categories (biased away from recently-featured via `featuredAt`), rotates the prior set out, and **opens a PR**. Touches only `featured`/`featuredAt`/`accentColor` — never `changelog` (rotation is curation, not a listing change; its audit trail is `featuredAt` + the PR itself).                                                                              |

All four are defined in `.claude/commands/` and committed to the repo, so anyone running Claude Code
here can invoke them. They encode the same flow we run manually.

## Quality bar (the policy both routines follow)

- **No fabrication.** Every field is web-verified against the official source. If something can't be
  confirmed, pick the conservative value and flag it for a human — never invent pricing, platforms, or
  links.
- **Freshness discipline.** `addedAt` + `lastVerifiedAt` use the real date (YYYY-MM-DD). `/audit`
  cycles the oldest-`lastVerifiedAt` entries first so the whole directory rotates through verification,
  and **skips anything verified within the last ~14 days** (`--min-age`, default 14) — so overlapping or
  too-frequent runs no-op instead of re-checking still-fresh entries.
- **Change history is the receipts.** When `/audit-directory` makes a _substantive_ change, it appends a
  `changelog` entry (`{ date, kind, summary, asOf?, source? }`) to the listing — a visible audit trail
  on the app detail page (`kind` = updated/fixed/archived/relisted). A no-change re-verification only
  bumps `lastVerifiedAt`; it records nothing. `asOf` (the real-world change date) and `source` are set
  only when the research can pin them — never guessed.
- **"Worth knowing" is the signature.** The `insight` field is one ≤140-char _verifiable FACT_ the
  description doesn't carry — an acquisition/funding event, origin/lineage, a licensing nuance, a
  pivot/rename, or a rare capability — surfaced while researching the listing. It's **not comparative**
  (that's `edge`) and **not** a re-statement of what the app does. It's what makes the catalog read as
  AI-curated, not auto-generated. Never fabricate; omit where there's no sharp fact (coverage is
  intentionally partial — a real fact or nothing).
- **The "honest brief" makes each listing decision-grade.** Beyond `insight`, listings carry optional
  enrichment: `edge` (the comparative "why pick this one"), balanced `pros`/`cons` (the honest cons are
  the trust signal), `bestFor`, curated `alternatives` (peer slugs powering the "Alternatives to <name>"
  rail), and third-party `references` (independent coverage — verify-or-omit, never the vendor's own
  pages). Same no-fabrication bar; `/audit-directory` backfills + re-verifies these over the cycle.
- **Listings can be multi-category.** Each carries one primary `category` (its canonical home — card
  chip, related rail, breadcrumb, JSON-LD, sort) plus optional **`secondaryCategories`** (≤2) for genuine
  second homes, so an app surfaces on **every** category it truly belongs to (page, filter, count,
  sitemap). Strict bar — a real second home a user would also look under, never the primary or a
  tag-mention; **most apps have none.** `/add-app` + `/discover-apps` set them at authoring time and
  `/audit-directory` curates them over the cycle.
- **`featured` is rare** — it spans two columns and enters the carousel; reserve it for true standouts.
- **Schema is the contract** (`types/app.ts`). Required: `slug`, `name`, `tagline`, `description`,
  `category`, `pricing`, `platforms`, `links` (exactly one `primary`), `addedSeq` (the accession
  number — highest existing + 1, counting open discovery PRs; the Newest/Oldest sort orders by it,
  and it is never reused or renumbered). Optional **`secondaryCategories`** (≤2) tag additional genuine
  homes beyond the primary `category`. Mobile apps use the `android` /
  `ios` platforms + an official `website` link (there's no store link kind).
- **Price ≠ license ≠ hosting.** `pricing` is cost only (`free`/`freemium`/`paid`/`byo-key`);
  `openSource: true` is the separate license signal; `deployment` (`cloud`/`self-host`/`local`/
  `hybrid`) is how it's run — set it where that's a real axis, unset for libraries/SDKs.
- **Archive, don't delete.** Discontinued apps get `status: "archived"` (kept as record, hidden from
  the default browse).

## Suggested cadence

- **Add** opportunistically with `/add-app` whenever you spot apps worth listing.
- **Discover** on a schedule (see below) with `/discover-apps`. Pick the interval to match where the
  directory is: run it **frequently while seeding** (the AI-app landscape since ~2022 is large and
  mostly un-listed, so there's plenty to find), then **dial it back as coverage saturates** and net-new
  worthy apps get rarer. Empty runs are cheap and harmless — the quality bar self-limits what lands.
- **Audit** weekly with `/audit-directory` (no args = the staleest batch), plus an ad-hoc
  `/audit-directory --category <thin-or-fast-moving>` (e.g. `video`, `image-gen`, `assistant`) since
  those churn fastest.
- **Rotate the Featured set** biweekly with `/rotate-featured` so the homepage carousel stays fresh and
  spreads the spotlight across categories over time.
- Each run is its own small PR — easy to review, easy to revert (discovery auto-merges once CI is
  green, but a one-listing PR stays trivial to revert).

## Scheduling (Claude Code Routines)

The recurring routines run via Claude Code's **Routines** feature (scheduled cloud sessions).

> **You set these up — an agent can't.** Routines are **account-owned, not repo-owned**, so they
> can't be committed here or created from inside a session. Create them yourself at
> **[claude.ai/code/routines](https://claude.ai/code/routines)** (or run **`/schedule`**), pointed at
> this repo. Min interval is 1 hour; pick the cadence to match the seeding stage (see _Suggested
> cadence_). `/audit-directory` and `/rotate-featured` **open a PR for review** — never straight to
> `main` — so you keep a human quality gate.
> `/discover-apps` runs **fire-and-forget**: it validates locally (the strict velite gate + typecheck
>
> - lint + build — the same checks CI runs), opens a PR, **enables squash auto-merge, and ends** — it
>   does **not** stay online to watch CI or confirm the merge. GitHub merges server-side the moment CI is
>   green and deletes the branch (the repo has auto-merge + delete-head-branch enabled), so the local
>   gate + CI are the guard rather than a human review. If CI ever fails, auto-merge simply doesn't fire
>   — the PR sits open for the next run or a human, no babysitting session required.

Create these scheduled routines and paste them as their prompts:

- **Discover new apps** (fire-and-forget — lands automatically; interval to taste, see _Suggested cadence_)

  > Run `/discover-apps`. Find notable AI apps not yet in the directory, author the genuinely
  > directory-worthy ones per the playbook, validate locally (`pnpm velite` + `typecheck` + `lint` +
  > `build` — the same gates CI runs), and open a PR. Then **enable squash auto-merge and END the run**
  > — do NOT subscribe to the PR, wait for CI, sleep, or schedule a check-in. GitHub merges it
  > server-side once CI is green; if CI fails the PR just stays open for the next run. If nothing is
  > worth adding, do nothing.

- **Weekly — audit existing listings**

  > Run `/audit-directory` on the oldest-verified batch. Re-verify links, pricing, platforms, and
  > status; fix drift; curate `secondaryCategories` (add a genuine second home, drop one that no longer
  > fits); archive anything discontinued; bump `lastVerifiedAt`; and open a PR for review. If nothing
  > changed, do nothing.

- **Biweekly — rotate the Featured set**
  > Run `/rotate-featured`. Refresh the homepage Featured carousel: feature one strong active app
  > across ~14 random categories (biased away from recently-featured), rotate the prior set out, and
  > open a PR for review. If the set is already fresh, do nothing.

_(Alternative: a GitHub Actions `schedule:` cron with `anthropics/claude-code-action` can do the same,
but it spends Actions minutes + needs an `ANTHROPIC_API_KEY` secret. Routines is the cleaner native
path.)_

See also `CLAUDE.md` §5 (Add a directory app) and §12 (common tasks).
