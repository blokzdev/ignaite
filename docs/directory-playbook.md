# Directory playbook

The AI-apps directory at `/` is the product. Its value is being **comprehensive, current, and
trustworthy** — so growing it and maintaining it is a recurring activity, not a one-off. This page is
the human overview; the executable routines live as Claude Code commands.

## The two routines

| Command                                                            | When                                          | What it does                                                                                                                                                |
| ------------------------------------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/add-app <name \| url \| list>`**                               | ad hoc — whenever you spot apps worth listing | Dedup-checks `data/apps.ts`, web-researches each app, authors a schema-valid `App` entry, validates, and reports anything it couldn't fully verify.         |
| **`/audit-directory [--category c] [--stale-since date] [slug…]`** | ~monthly, or before a release                 | Re-verifies existing listings (links, pricing, platforms, model support, still-alive), fixes drift, archives discontinued apps, and bumps `lastVerifiedAt`. |

Both are defined in `.claude/commands/` and committed to the repo, so anyone running Claude Code here
can invoke them. They encode the same flow we run manually.

## Quality bar (the policy both routines follow)

- **No fabrication.** Every field is web-verified against the official source. If something can't be
  confirmed, pick the conservative value and flag it for a human — never invent pricing, platforms, or
  links.
- **Freshness discipline.** `addedAt` + `lastVerifiedAt` use the real date (YYYY-MM-DD). `/audit`
  cycles the oldest-`lastVerifiedAt` entries first so the whole directory rotates through verification.
- **Honest editorial marks.** `blokzMark` (`deployed`/`vetted`/`contributing`) is added **only** for
  apps Blokz genuinely uses, contributes to, or has vetted. Default: none.
- **`featured` is rare** — it spans two columns and enters the carousel; reserve it for true standouts.
- **Schema is the contract** (`types/app.ts`). Required: `slug`, `name`, `tagline`, `description`,
  `category`, `pricing`, `platforms`, `links` (exactly one `primary`). Mobile apps use the `android` /
  `ios` platforms + an official `website` link (there's no store link kind).
- **Archive, don't delete.** Discontinued apps get `status: "archived"` (kept as record, hidden from
  the default browse).

## Suggested cadence

- **Add** opportunistically (a few apps per session is healthy) and after any "what's new in AI" sweep.
- **Audit** monthly: `/audit-directory` with no args to take the staleset batch, plus a targeted
  `/audit-directory --category <thin-or-fast-moving>` (e.g. `video`, `image-gen`, `assistant`) since
  those churn fastest.
- Each run is its own small PR — easy to review, easy to revert.

See also `CLAUDE.md` §5 (Add a directory app) and §12 (common tasks).
