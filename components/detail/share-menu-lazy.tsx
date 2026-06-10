"use client";
import dynamic from "next/dynamic";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { ShareMenu } from "./share-menu";

type Props = ComponentProps<typeof ShareMenu>;

// Placeholder sized to the masthead's trigger (h-11) so the lazy swap causes no
// layout shift; non-interactive until the chunk lands.
function TriggerShell() {
  return (
    <button
      type="button"
      disabled
      aria-label="Share or export (loading)"
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset",
      )}
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}

// Radix dropdown (+popper/focus-scope) is too heavy for every detail page's
// first-load path. ssr:false keeps it out of the route's initial JS; the chunk
// fetches after hydration, past LCP. Used by the masthead (≥sm), opening down.
const LazyMenu = dynamic(() => import("./share-menu").then((m) => m.ShareMenu), {
  ssr: false,
  loading: () => <TriggerShell />,
});

export function ShareMenuLazy(props: Readonly<Props>) {
  return <LazyMenu {...props} />;
}
