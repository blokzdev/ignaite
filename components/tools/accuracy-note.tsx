import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/**
 * The quiet last word on /apps/<slug>: how the listing is maintained, plus the
 * correction path ("Let us know" → /contact). The change history + freshness
 * stamp moved into the dossier's provenance footer (DossierRail), so this is
 * blurb-only. Always renders. Server component — no client bundle cost.
 */
export function AccuracyNote({ appName }: Readonly<{ appName: string }>) {
  return (
    <aside
      aria-label="How this listing is maintained"
      className="mt-20 rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] ring-inset sm:p-6"
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
        can occasionally get something wrong. Spotted something off?{" "}
        <Link
          href={`/contact?subject=${encodeURIComponent(`Update for ${appName}`)}&type=correction`}
          className="text-[var(--color-accent)] underline decoration-[var(--color-accent)]/40 underline-offset-4 transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          Let us know.
        </Link>
      </p>
    </aside>
  );
}
