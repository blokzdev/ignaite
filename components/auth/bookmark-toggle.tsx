"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "./bookmark-provider";
import { cn } from "@/lib/utils";

// Small client island rendered inside server components (tool cards, app detail).
// Reads shared state from <BookmarkProvider> so every toggle for the same item
// stays in sync. Renders disabled until the provider hydrates (no context → also
// disabled, so it degrades safely if ever mounted outside the provider).
export function BookmarkToggle({
  kind,
  slug,
  className,
}: Readonly<{ kind: "app" | "recipe"; slug: string; className?: string }>) {
  const ctx = useBookmarks();
  const active = ctx?.isBookmarked(kind, slug) ?? false;
  const ready = ctx?.ready ?? false;

  return (
    <button
      type="button"
      onClick={() => ctx?.toggle(kind, slug)}
      disabled={!ready}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Add bookmark"}
      title={active ? "Bookmarked" : "Bookmark"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none disabled:opacity-40 sm:h-9 sm:w-9",
        active
          ? "bg-[var(--color-accent)]/[0.14] text-[var(--color-accent)] ring-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/[0.22]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-white/[0.08] hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
        className,
      )}
    >
      {active ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
    </button>
  );
}
