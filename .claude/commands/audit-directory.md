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
  - **Pricing tier** still matches (`free`/`freemium`/`paid`/`open-source`/`byo-key`).
  - **Platforms** + **model support** still accurate (new mobile app? dropped a platform? model rename?).
  - **Still operating** — not shut down, sunset, or fully absorbed into another product.

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
