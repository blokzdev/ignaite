import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { ChangeEntry } from "@/types/app";
import { formatDate } from "@/lib/utils";
import { ChangeHistory } from "./change-history";

/**
 * The maintenance ledger for /apps/<slug>: one bordered card that tells the whole
 * provenance story — how the listing is maintained (disclaimer), its change
 * history (timeline, always anchored by a "Listed" origin node), and the
 * freshness stamp + Submit-a-correction CTA. Always renders, so the loading
 * skeleton always has a real target. Server component — no client bundle cost.
 */
export function AccuracyNote({
  appName,
  addedAt,
  lastVerifiedAt,
  changelog,
}: Readonly<{
  appName: string;
  addedAt?: string;
  lastVerifiedAt?: string;
  changelog?: ReadonlyArray<ChangeEntry>;
}>) {
  const hasHistory = (changelog?.length ?? 0) > 0 || Boolean(addedAt);

  return (
    <aside
      aria-label="How this listing is maintained"
      className="mt-20 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset sm:p-6"
    >
      <div className="flex items-center gap-2.5">
        <ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-[var(--color-ink-dim)]" />
        <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          How this listing is maintained
        </p>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Every listing here is researched and written by Claude Code, then re-audited periodically.
        Details like pricing, features, and availability can change between audits — and AI research
        can occasionally get something wrong. Spotted something off? Let us know.
      </p>

      {hasHistory && (
        <div className="mt-5 border-t border-white/[0.06] pt-5">
          <ChangeHistory entries={changelog ?? []} addedAt={addedAt} />
        </div>
      )}

      <div className="mt-5 flex flex-col items-start gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
        {lastVerifiedAt && (
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase">
            Last verified · {formatDate(lastVerifiedAt)}
          </p>
        )}
        <Link
          href={`/contact?subject=${encodeURIComponent(`Update for ${appName}`)}&type=correction`}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75"
        >
          Submit a correction
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
