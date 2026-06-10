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

// ── scroll-position memory for the back-to-results crumb ────────────────────
//
// The crumb is a plain forward <Link> (not router.back()), so the browser's
// per-history-entry scroll offset never applies — we capture and restore it
// ourselves. Two keys: the RETURN record (where the visitor left the grid —
// written on every card click-through) and a one-shot RESTORE flag (armed only
// by a crumb press), so fresh visits to the directory never jump. The grid is
// infinite-scroll, so the record carries the visible count too — a bare scrollY
// would point below a freshly-rendered first batch.
const DIRECTORY_RETURN_KEY = "ignaite:directory-return";
const DIRECTORY_RESTORE_KEY = "ignaite:directory-restore";

export interface DirectoryReturnRecord {
  /** Canonical "?…" (or "") query string the grid was showing — must match the
   *  mount it restores into. Same serializer as the saved query above. */
  query: string;
  scrollY: number;
  /** visibleCount at click time — restored FIRST so scrollY is reachable. */
  count: number;
  /** The card clicked through — the anchor fallback target if the page came
   *  back shorter than remembered (data changed between visits). */
  slug: string;
}

/** Written by the grid when a card click navigates to a detail page. */
export function saveDirectoryReturn(record: DirectoryReturnRecord): void {
  try {
    sessionStorage.setItem(DIRECTORY_RETURN_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable — returning simply lands at the top, as before.
  }
}

/** Armed by the crumb's click, consumed by the very next ToolsBrowser mount. */
export function armDirectoryRestore(): void {
  try {
    sessionStorage.setItem(DIRECTORY_RESTORE_KEY, "1");
  } catch {
    // Without the flag the next mount won't restore — safe degradation.
  }
}

function readReturnRecord(): DirectoryReturnRecord | null {
  try {
    const raw = sessionStorage.getItem(DIRECTORY_RETURN_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as Partial<DirectoryReturnRecord>;
    if (
      typeof r.query !== "string" ||
      typeof r.slug !== "string" ||
      typeof r.scrollY !== "number" ||
      typeof r.count !== "number" ||
      !Number.isFinite(r.scrollY) ||
      !Number.isFinite(r.count) ||
      r.scrollY < 0 ||
      r.count <= 0
    ) {
      return null;
    }
    return r as DirectoryReturnRecord;
  } catch {
    return null;
  }
}

/** Pure read (safe in render / a lazy state initializer): the return record,
 *  iff the crumb armed a restore AND the record belongs to the results being
 *  mounted (`currentQuery` — the same canonical serialization the record was
 *  saved with). Pair with `clearDirectoryRestore()` from a mount effect to keep
 *  the flag one-shot. */
export function peekDirectoryRestore(currentQuery: string): DirectoryReturnRecord | null {
  try {
    if (!sessionStorage.getItem(DIRECTORY_RESTORE_KEY)) return null;
    const record = readReturnRecord();
    return record && record.query === currentQuery ? record : null;
  } catch {
    return null;
  }
}

/** Disarm the one-shot flag — call on grid mount whether or not the peek
 *  matched, so a stale arm can never fire on a later visit. Idempotent. */
export function clearDirectoryRestore(): void {
  try {
    sessionStorage.removeItem(DIRECTORY_RESTORE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

const hasReturnRecord = () => readReturnRecord() !== null;

/** Whether a return record exists — drives the crumb's `scroll={false}` (we
 *  position the destination ourselves only when a restore will actually run).
 *  Server snapshot is `false`; the prop only matters at click time. */
export function useHasDirectoryReturn(): boolean {
  return useSyncExternalStore(subscribeNever, hasReturnRecord, () => false);
}
