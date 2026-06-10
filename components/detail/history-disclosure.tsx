"use client";
import { useEffect, useId, useState } from "react";
import { ChevronDown, History } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Expand/collapse shell for the dossier's change-history ledger. The timeline
 * itself arrives server-rendered as `children` (ChangeHistory stays RSC) — this
 * island only owns the toggle, so the client bundle cost is the trigger row.
 * Deep links still work: the stat strip's VERIFIED cell points at `#history`
 * (anchored on the dossier's provenance block), and landing on / navigating to
 * that hash auto-expands the ledger so the jump never dead-ends on a closed
 * disclosure. Plain show/hide — no height animation, so nothing to gate for
 * reduced motion beyond the chevron's transform.
 */
export function HistoryDisclosure({
  changeCount,
  children,
}: Readonly<{ changeCount: number; children: React.ReactNode }>) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const expandOnHash = () => {
      if (window.location.hash === "#history") setExpanded(true);
    };
    expandOnHash();
    window.addEventListener("hashchange", expandOnHash);
    return () => window.removeEventListener("hashchange", expandOnHash);
  }, []);

  const countLabel =
    changeCount > 0 ? `${changeCount} ${changeCount === 1 ? "update" : "updates"} · ` : "";

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <History aria-hidden className="h-3.5 w-3.5 shrink-0" />
        {`${countLabel}${expanded ? "Hide history" : "View history"}`}
        <ChevronDown
          aria-hidden
          className={cn(
            "h-3 w-3 shrink-0 transition-transform motion-reduce:transition-none",
            expanded && "rotate-180",
          )}
        />
      </button>
      <div id={panelId} hidden={!expanded} className="mt-4">
        {children}
      </div>
    </div>
  );
}
