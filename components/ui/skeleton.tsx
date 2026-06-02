import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pulse to signal loading (default). Set false for static placeholder scaffolding. */
  pulse?: boolean;
}

function Skeleton({ className, pulse = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md bg-white/[0.06]", pulse && "animate-pulse", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
