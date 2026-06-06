import type { App } from "@/types/app";

// Derived license/source signal — there is NO dedicated data field. The three
// states are computed from the existing `openSource` flag + `pricing`:
//   "prop" — not open source (proprietary).
//   "core" — open source AND has a commercial tier (paid / freemium) → open core
//            (libre core + a paid hosted/enterprise tier, e.g. Zed, ComfyUI).
//   "oss"  — open source with no paid tier (free / byo-key) → pure open source.
export type LicenseSignal = "oss" | "core" | "prop";

export const LICENSE_SIGNALS: ReadonlyArray<LicenseSignal> = ["oss", "core", "prop"];

export const LICENSE_LABEL: Record<LicenseSignal, string> = {
  oss: "Open source",
  core: "Open core",
  prop: "Proprietary",
};

export function licenseSignal(app: Pick<App, "openSource" | "pricing">): LicenseSignal {
  if (!app.openSource) return "prop";
  if (app.pricing === "paid" || app.pricing === "freemium") return "core";
  return "oss";
}
