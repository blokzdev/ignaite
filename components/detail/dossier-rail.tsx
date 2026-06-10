import Link from "next/link";
import { ArrowUpRight, History } from "lucide-react";
import type { App } from "@/types/app";
import { cn } from "@/lib/utils";
import { LINK_ICON, LINK_LABEL, MODEL_KIND_LABEL } from "@/lib/tools/app-labels";

const sectionLabel =
  "font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-dim)] uppercase";

// The "dossier" — the listing's reference column: every link (primary
// highlighted), model-support detail, best-for audience tags, and a compact
// provenance link to the change-history ledger. Pure metadata, no CTAs (the
// masthead/action bar own Open) and no facet rows (the stat strip owns those).
// Sticky sidebar on desktop, stacked after the brief on smaller screens.
// Server component; capped height with an internal scroll so a long dossier
// never pins taller than the viewport.
export function DossierRail({ app, accent }: Readonly<{ app: App; accent: string }>) {
  const primary = app.links.find((l) => l.primary) ?? app.links[0];
  const changeCount = app.changelog?.length ?? 0;

  return (
    <aside
      aria-label="Details & links"
      className="scrollbar-styled flex flex-col gap-5 overflow-y-auto rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.08] ring-inset lg:max-h-[calc(100dvh-7rem)]"
    >
      {/* Links */}
      <div>
        <p className={sectionLabel}>Links</p>
        <ul className="mt-3 flex flex-col gap-0.5">
          {app.links.map((link) => {
            const Icon = LINK_ICON[link.kind];
            const isPrimary = link === primary;
            return (
              <li key={`${link.kind}-${link.url}`}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
                    isPrimary ? "bg-[var(--color-accent)]/[0.07]" : "hover:bg-white/[0.04]",
                  )}
                  style={isPrimary ? { boxShadow: `inset 0 0 0 1px ${accent}33` } : undefined}
                >
                  <Icon
                    aria-hidden
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isPrimary
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-ink-dim)] group-hover:text-[var(--color-ink)]",
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1 truncate text-sm",
                      isPrimary ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]",
                    )}
                  >
                    {link.label ?? LINK_LABEL[link.kind]}
                  </span>
                  {isPrimary && (
                    <span className="font-mono text-[9px] tracking-[0.1em] text-[var(--color-accent)] uppercase">
                      Primary
                    </span>
                  )}
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Model support */}
      {app.modelSupport && (
        <div className="border-t border-white/[0.06] pt-5">
          <p className={sectionLabel}>Model support</p>
          <p className="mt-2 text-sm text-[var(--color-ink)]">
            {MODEL_KIND_LABEL[app.modelSupport.kind]}
          </p>
          {app.modelSupport.models && app.modelSupport.models.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {app.modelSupport.models.map((m) => (
                <li
                  key={m}
                  className="rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
          {app.modelSupport.notes && (
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
              {app.modelSupport.notes}
            </p>
          )}
        </div>
      )}

      {/* Best for */}
      {app.bestFor && app.bestFor.length > 0 && (
        <div className="border-t border-white/[0.06] pt-5">
          <p className={sectionLabel}>Best for</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {app.bestFor.map((b) => (
              <li
                key={b}
                className="rounded-full bg-[var(--color-accent)]/[0.08] px-2.5 py-0.5 text-[13px] text-[var(--color-ink)] ring-1 ring-[var(--color-accent)]/20 ring-inset"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Provenance — links to the full ledger (dates live in the stat strip) */}
      <div className="border-t border-white/[0.06] pt-5">
        <Link
          href="#history"
          className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          <History aria-hidden className="h-3.5 w-3.5 shrink-0" />
          {changeCount > 0
            ? `${changeCount} ${changeCount === 1 ? "update" : "updates"} · View history`
            : "View history"}
          <ArrowUpRight
            aria-hidden
            className="h-3 w-3 text-[var(--color-ink-dim)] transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </aside>
  );
}
