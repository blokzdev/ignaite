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
  /** Drives the leading type-glyph: search=magnifier, category=grid, filter=sliders, directory=home. */
  kind: "search" | "category" | "filter" | "directory";
  /** The segment text ("" for directory — that state is icon-only). */
  label: string;
  href: string;
}

// Turn the saved query into the back control's type + label + href. Priority: a
// search term, then a PURE single category (its own glyph), then any filter set
// (one filter glyph + the active values joined), then the bare directory.
export function describeDirectoryReturn(search: string): DirectoryReturn {
  const href = search ? `/${search}` : "/";
  const p = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  const q = p.get("q")?.trim();
  if (q) return { kind: "search", label: q.length > 40 ? `${q.slice(0, 40)}…` : q, href };

  const list = (key: string) => p.get(key)?.split(",").filter(Boolean) ?? [];
  const cats = list("category");
  const pricing = list("pricing");
  const deployment = list("deployment");
  const platform = list("platform");
  const license = p.get("license");
  const status = p.get("status");
  const statusActive = status && status !== "active" ? status : null;

  // All active facet values, in a stable, readable order.
  const labels = [
    ...cats.map((c) => CATEGORY_LABEL[c as AppCategory]),
    ...pricing.map((v) => PRICING_LABEL[v as AppPricing]),
    ...(license ? [LICENSE_LABEL[license as LicenseSignal]] : []),
    ...deployment.map((v) => DEPLOYMENT_LABEL[v as AppDeployment]),
    ...platform.map((v) => PLATFORM_LABEL[v as AppPlatform]),
    ...(statusActive ? [STATUS_LABEL[statusActive] ?? statusActive] : []),
  ].filter(Boolean) as string[];

  if (labels.length === 0) return { kind: "directory", label: "", href: "/" };
  // A pure single category gets its own grid glyph; anything else is a filter set.
  if (labels.length === 1 && cats.length === 1) return { kind: "category", label: labels[0], href };
  return { kind: "filter", label: labels.join(" + "), href };
}

// ── hydration-safe stores (server snapshot first, client value after mount) ──
const subscribeNever = () => () => {};

/** The raw saved query string ("" or "?…"); pair with useMemo(describeDirectoryReturn). */
export function useSavedDirectoryQuery(): string {
  return useSyncExternalStore(subscribeNever, readSavedQuery, () => "");
}
