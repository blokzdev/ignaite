"use client";
import { useEffect } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";

// The directory's grid ⇄ condensed-list view preference. Lives in its OWN `?view`
// URL param (kept apart from the filter params so it isn't cleared by "Clear
// filters" nor counted as an applied filter), and is mirrored to localStorage so
// the choice sticks across navigations. The URL stays the source of truth.
export const VIEW_MODES = ["grid", "list"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export const viewParser = parseAsStringLiteral(VIEW_MODES)
  .withOptions({ history: "replace", shallow: true })
  .withDefault("grid");

const STORAGE_KEY = "ignaite:view";

export function useViewMode() {
  const [view, setViewRaw] = useQueryState("view", viewParser);

  // When the URL doesn't pin a view, fall back to the remembered choice — so a
  // visitor who picked "list" keeps it on the next page. Runs once on mount; the
  // URL still wins when it carries an explicit `?view=`.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("view")) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable (private mode) — non-fatal */
    }
    if ((stored === "list" || stored === "grid") && stored !== view) {
      void setViewRaw(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setView = (next: ViewMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
    void setViewRaw(next);
  };

  return [view, setView] as const;
}
