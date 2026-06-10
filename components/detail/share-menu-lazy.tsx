"use client";
import dynamic from "next/dynamic";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { ShareMenu } from "./share-menu";

type Props = ComponentProps<typeof ShareMenu>;

// Placeholder with the trigger's exact dimensions so the lazy swap causes no
// layout shift; non-interactive until the chunk lands (same contract as any
// client island pre-hydration).
function TriggerShell({ variant }: Readonly<{ variant: Props["variant"] }>) {
  return (
    <button
      type="button"
      disabled
      aria-label="Share or export (loading)"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset",
        variant === "bar"
          ? "h-12 w-12"
          : "h-8 gap-1.5 px-3 font-mono text-[11px] tracking-[0.08em] uppercase",
      )}
    >
      <Share2 className={variant === "bar" ? "h-4 w-4" : "h-3 w-3"} />
      {variant === "card" && "Share"}
    </button>
  );
}

// Radix dropdown (+popper/focus-scope) is ~30KB — too heavy for the
// first-load path of every detail page. ssr:false keeps it out of the route's
// initial JS; the single shared chunk fetches right after hydration, well past
// LCP. Two dynamic defs only to give each variant a correctly-sized loading
// shell — they resolve to the same module/chunk.
const LazyBarMenu = dynamic(() => import("./share-menu").then((m) => m.ShareMenu), {
  ssr: false,
  loading: () => <TriggerShell variant="bar" />,
});
const LazyCardMenu = dynamic(() => import("./share-menu").then((m) => m.ShareMenu), {
  ssr: false,
  loading: () => <TriggerShell variant="card" />,
});

export function ShareMenuLazy(props: Readonly<Props>) {
  const Menu = props.variant === "bar" ? LazyBarMenu : LazyCardMenu;
  return <Menu {...props} />;
}
