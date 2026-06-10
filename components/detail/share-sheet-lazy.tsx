"use client";
import dynamic from "next/dynamic";
import { Share2 } from "lucide-react";
import type { ComponentProps } from "react";
import type { ShareSheet } from "./share-sheet";

type Props = ComponentProps<typeof ShareSheet>;

// Placeholder sized to the action-bar trigger (h-12) so the lazy swap causes no
// layout shift.
function TriggerShell() {
  return (
    <button
      type="button"
      disabled
      aria-label="Share or export (loading)"
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}

// Radix Dialog (sheet) lazy-loads on the detail route — kept off the first-load
// path; fetches after hydration. Used by the fixed mobile action bar (<sm).
const LazySheet = dynamic(() => import("./share-sheet").then((m) => m.ShareSheet), {
  ssr: false,
  loading: () => <TriggerShell />,
});

export function ShareSheetLazy(props: Readonly<Props>) {
  return <LazySheet {...props} />;
}
