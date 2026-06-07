import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Loading treatment:
   * - `shimmer` — a light band sweeps across (use on large content blocks: cards, detail body, forms).
   * - `pulse` — soft opacity breathe (use on small chrome: chips, console pills). Default.
   * - `none` — flat fill, no motion (static scaffolding).
   * All variants collapse to a flat fill under prefers-reduced-motion.
   */
  variant?: "shimmer" | "pulse" | "none";
}

function Skeleton({ className, variant = "pulse", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md",
        variant === "shimmer" && "skeleton-shimmer",
        variant === "pulse" && "animate-pulse bg-white/[0.06] motion-reduce:animate-none",
        variant === "none" && "bg-white/[0.06]",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
