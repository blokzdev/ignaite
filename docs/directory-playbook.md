# Directory playbook

The AI-apps directory at `/` is the product. Its value is being **comprehensive, current, and
trustworthy** — so growing it and maintaining it is a recurring activity, not a one-off. This page is
the human overview; the executable routines live as Claude Code commands.

## The routines

| Command                                                            | Driven by                       | What it does                                                                                                                                                                                |
| ------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/add-app <name \| url \| list>`**                               | a human supplies names          | Dedup → web-research → author a schema-valid `App` entry → validate → report.                                                                                                               |
| **`/discover-apps [focus]`**                                       | autonomous (good for schedules) | Finds net-new apps not yet listed, authors the worthy ones, and **opens a PR**. The unattended counterpart to `/add-app`.                                                                   |
| **`/audit-directory [--category c] [--stale-since date] [slug…]`** | manual or scheduled             | Re-verifies existing listings (links, pricing, platforms, model support, still-alive), fixes drift, archives discontinued apps, bumps `lastVerifiedAt`; **opens a PR** when run unattended. |

All three are defined in `.claude/commands/` and committed to the repo, so anyone running Claude Code
here can invoke them. They encode the same flow we run manually.

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

- **Add** opportunistically with `/add-app` whenever you spot apps worth listing.
- **Discover** on a schedule (see below) with `/discover-apps` — weekly is the sweet spot.
- **Audit** weekly with `/audit-directory` (no args = the staleest batch), plus an ad-hoc
  `/audit-directory --category <thin-or-fast-moving>` (e.g. `video`, `image-gen`, `assistant`) since
  those churn fastest.
- Each run is its own small PR — easy to review, easy to revert.

## Scheduling (Claude Code Routines)

The two recurring routines run via Claude Code's **Routines** feature (scheduled cloud sessions).

> **You set these up — an agent can't.** Routines are **account-owned, not repo-owned**, so they
> can't be committed here or created from inside a session. Create them yourself at
> **[claude.ai/code/routines](https://claude.ai/code/routines)** (or run **`/schedule`**), pointed at
> this repo. Min interval is 1 hour; weekly is recommended. Both routines **open a PR for review** —
> never straight to `main` — so you keep the quality gate.

Create two scheduled routines and paste these as their prompts:

- **Weekly — discover new apps**

  > Run `/discover-apps`. Find notable AI apps not yet in the directory, author the genuinely
  > directory-worthy ones per the playbook, and open a PR for review. If nothing is worth adding, do
  > nothing.

- **Weekly — audit existing listings**
  > Run `/audit-directory` on the oldest-verified batch. Re-verify links, pricing, platforms, and
  > status; fix drift; archive anything discontinued; bump `lastVerifiedAt`; and open a PR for review.
  > If nothing changed, do nothing.

Cadence note: **weekly beats daily** for discovery — there usually aren't several net-new
directory-worthy AI apps every day, so daily mostly produces empty runs at extra cost. Bump to daily
only if a category is moving that fast.

_(Alternative: a GitHub Actions `schedule:` cron with `anthropics/claude-code-action` can do the same,
but it spends Actions minutes + needs an `ANTHROPIC_API_KEY` secret. Routines is the cleaner native
path.)_

See also `CLAUDE.md` §5 (Add a directory app) and §12 (common tasks).
