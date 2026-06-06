---
description: Review existing directory listings — verify links, pricing, status; refresh lastVerifiedAt
argument-hint: [--category <c>] [--stale-since <YYYY-MM-DD>] [slug ...]
---

You are auditing existing entries in the Blokz.dev **AI-apps directory** (`data/apps.ts`) to keep it
reliable. The goal is a trustworthy, current directory. **Never fabricate** — if you can't verify a
change, leave the data and flag it.

Scope: **$ARGUMENTS**

- No args → review the entries with the **oldest `lastVerifiedAt`** first (do a manageable batch,
  e.g. 10–15, not all 90+ at once).
- `--category <c>` → only that `AppCategory`.
- `--stale-since <date>` → only entries with `lastVerifiedAt` older than that date.
- explicit `slug`s → just those.

For each entry in scope:

## 1. Verify it's alive + correct (web)

- WebSearch/WebFetch the official site + pricing page. Check:
  - **Links resolve** (primary + secondaries). A `403` from anti-bot protection on a real site is OK;
    a `404`, dead domain, or redirect to a parked/acquired page is not.
  - **Pricing tier** still matches (`free`/`freemium`/`paid`/`byo-key` — cost only).
  - **`openSource`** correct (true when the app's own source is open; separate from price) and
    **`deployment`** correct (`cloud`/`self-host`/`local`/`hybrid`, where it's a real axis).
  - **Platforms** + **model support** still accurate (new mobile app? dropped a platform? model rename?).
  - **Still operating** — not shut down, sunset, or fully absorbed into another product.
  - **`insight` still true** — the editorial one-liner hasn't gone stale (a rename happened, a licence
    flipped, the "only one that…" claim no longer holds). Rewrite it if reality moved.
- **Backfill:** if an entry is missing `openSource`/`deployment` and the value is verifiable, add it
  (this is how full coverage of those facets completes itself over the weekly cycle). Leave
  `deployment` unset for pure libraries/SDKs/extensions. Likewise, if an entry has no `insight`, author
  one (≤140 chars, non-obvious, verifiable — see `add-app.md`) so coverage stays at 100%.

## 2. Apply fixes

- Update changed `pricing`, `platforms`, `modelSupport`, `tags`, `vendor`, or `links` (fix/replace dead
  URLs).
- If an app is **discontinued / shut down**, set `status: "archived"` (it stays in the file as record,
  hidden from the default browse) — don't delete it.
- If a featured app is no longer a standout, consider dropping `featured`.
- **Bump `lastVerifiedAt` to today** on every entry you actually re-verified (whether or not it changed).
- Keep edits minimal + within the existing `App` schema (`types/app.ts`).

## 3. Validate + report

- `pnpm typecheck`, `pnpm lint`, `pnpm build` clean.
- **Interactive run:** report a concise diff (entries reviewed, what changed and why, what was
  archived, anything ambiguous needing a human decision). Don't commit unless the user asked.

## Scheduled / unattended mode (run by a Routine)

When there's no human in the loop (a scheduled Routine invoked this), default to **no args** → the
oldest-`lastVerifiedAt` batch, then:

- Apply the verified fixes and bump `lastVerifiedAt` as above.
- If anything changed: create a branch (e.g. `claude/audit-directory-<date>`), commit, push, and open
  a PR into `main` summarizing the diff + any "needs human decision" items. **Do not merge.**
- If nothing changed: **do nothing** — no branch, no empty PR. Briefly state the batch was clean.

Cadence: run ~weekly (or before a release), cycling oldest-`lastVerifiedAt` entries first so the whole
directory rotates through verification over time.
