import { useSyncExternalStore } from "react";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { LICENSE_LABEL, type LicenseSignal } from "@/lib/tools/license";
import { DEPLOYMENT_LABEL, PLATFORM_LABEL } from "@/lib/tools/app-labels";
import type { AppCategory, AppDeployment, AppPlatform, AppPricing } from "@/types/app";

// Title-case pricing (app-labels' PRICING_LABEL is ALL-CAPS — fine for chips,
// but the crumb's aria-label should read "Back to Free", not "Back to FREE").
const PRICING_LABEL: Record<AppPricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "byo-key": "BYO key",
};

// Per-tab memory of the directory's last search/filter query, so a detail page's
// back control can return to the exact results the visitor came from (rather than
// a reset directory) AND label that return state-aware. sessionStorage by design:
// per-tab, cleared on tab close, absent on direct visits. Written by
// tools-browser on every filter change.
export const DIRECTORY_QUERY_KEY = "ignaite:directory-query";

export function saveDirectoryQuery(search: string): void {
  try {
    sessionStorage.setItem(DIRECTORY_QUERY_KEY, search);
  } catch {
    // Storage unavailable (private mode / quota) — the crumb stays "Directory".
  }
}

function readSavedQuery(): string {
  try {
    const saved = sessionStorage.getItem(DIRECTORY_QUERY_KEY);
    return saved && saved.startsWith("?") && saved.length > 1 ? saved : "";
  } catch {
    return "";
  }
}

const STATUS_LABEL: Record<string, string> = { archived: "Archived", all: "All results" };

export interface DirectoryReturn {
  /** "search" renders an inline magnifier + the term; "text" is a plain label. */
  kind: "search" | "text";
  label: string;
  href: string;
}

// Turn the saved query into the back control's label + href. Most-salient first:
// a search term, then a single facet's specific value, then a generic "Results",
// then the bare "Directory".
export function describeDirectoryReturn(search: string): DirectoryReturn {
  const href = search ? `/${search}` : "/";
  const p = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  const q = p.get("q")?.trim();
  if (q) return { kind: "search", label: q.length > 18 ? `${q.slice(0, 18)}…` : q, href };

  const list = (key: string) => p.get(key)?.split(",").filter(Boolean) ?? [];
  const cats = list("category");
  const pricing = list("pricing");
  const deployment = list("deployment");
  const platform = list("platform");
  const license = p.get("license");
  const status = p.get("status");
  const statusActive = status && status !== "active" ? status : null;

  const groups = [cats, pricing, deployment, platform];
  const total =
    groups.reduce((n, a) => n + a.length, 0) + (license ? 1 : 0) + (statusActive ? 1 : 0);

  if (total === 0) return { kind: "text", label: "Directory", href: "/" };
  if (total === 1) {
    if (cats.length === 1)
      return { kind: "text", label: CATEGORY_LABEL[cats[0] as AppCategory] ?? "Results", href };
    if (pricing.length === 1)
      return { kind: "text", label: PRICING_LABEL[pricing[0] as AppPricing] ?? "Results", href };
    if (deployment.length === 1)
      return {
        kind: "text",
        label: DEPLOYMENT_LABEL[deployment[0] as AppDeployment] ?? "Results",
        href,
      };
    if (platform.length === 1)
      return { kind: "text", label: PLATFORM_LABEL[platform[0] as AppPlatform] ?? "Results", href };
    if (license)
      return { kind: "text", label: LICENSE_LABEL[license as LicenseSignal] ?? "Results", href };
    if (statusActive) return { kind: "text", label: STATUS_LABEL[statusActive] ?? "Results", href };
  }
  return { kind: "text", label: "Results", href };
}

// ── hydration-safe stores (server snapshot first, client value after mount) ──
const subscribeNever = () => () => {};

/** The raw saved query string ("" or "?…"); pair with useMemo(describeDirectoryReturn). */
export function useSavedDirectoryQuery(): string {
  return useSyncExternalStore(subscribeNever, readSavedQuery, () => "");
}

// Per-tab count of in-app navigations — once > 0 there's an in-app entry behind
// the current page, so router.back() won't exit the site. Bumped by <RouteMemory>.
const NAV_COUNT_KEY = "ignaite:nav-count";

export function bumpNavCount(): void {
  try {
    const n = Number(sessionStorage.getItem(NAV_COUNT_KEY) ?? "0");
    sessionStorage.setItem(NAV_COUNT_KEY, String(n + 1));
  } catch {
    // ignore
  }
}

function readInApp(): boolean {
  try {
    return Number(sessionStorage.getItem(NAV_COUNT_KEY) ?? "0") > 0;
  } catch {
    return false;
  }
}

/** True once the visitor has navigated within the app this tab (back() is safe). */
export function useInAppNav(): boolean {
  return useSyncExternalStore(subscribeNever, readInApp, () => false);
}
