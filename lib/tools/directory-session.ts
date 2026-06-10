import { useSyncExternalStore } from "react";

// Per-tab memory of the directory's last search/filter query, so a detail
// page's "Directory" breadcrumb can return to the exact results the visitor
// came from (rather than a reset directory). sessionStorage by design: per-tab
// (two tabs don't fight), cleared when the tab closes, absent on direct visits
// (the crumb then falls back to plain "/"). Written by tools-browser on every
// filter change; read by the detail toolbar after mount (hydration-safe).
export const DIRECTORY_QUERY_KEY = "ignaite:directory-query";

export function saveDirectoryQuery(search: string): void {
  try {
    sessionStorage.setItem(DIRECTORY_QUERY_KEY, search);
  } catch {
    // Storage unavailable (private mode / quota) — the crumb just stays "/".
  }
}

/** The saved results URL, or plain "/" when there's no meaningful saved query. */
export function savedDirectoryHref(): string {
  try {
    const saved = sessionStorage.getItem(DIRECTORY_QUERY_KEY);
    return saved && saved.startsWith("?") && saved.length > 1 ? `/${saved}` : "/";
  } catch {
    return "/";
  }
}

// Nothing mutates the saved query while a detail page is mounted, so the
// subscription is a no-op; useSyncExternalStore still gives the hydration-safe
// server-"/" → client-saved upgrade (same pattern as useReducedMotion).
const subscribeNever = () => () => {};
const getServerHref = () => "/";

/** Hydration-safe read of the saved results URL (client components only). */
export function useSavedDirectoryHref(): string {
  return useSyncExternalStore(subscribeNever, savedDirectoryHref, getServerHref);
}
