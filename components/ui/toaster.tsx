"use client";
import type { CSSProperties } from "react";
import { Toaster as SonnerToaster } from "sonner";

// Token-themed sonner host. sonner reads these CSS custom properties for its
// default toast surface; we point them at the Ignaite palette. sonner already
// respects prefers-reduced-motion internally.
const tokenStyle = {
  "--normal-bg": "var(--color-surface)",
  "--normal-text": "var(--color-ink)",
  "--normal-border": "rgb(255 255 255 / 0.1)",
} as CSSProperties;

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-center"
      style={tokenStyle}
      toastOptions={{
        classNames: {
          toast: "rounded-xl text-sm",
          actionButton:
            "!bg-[var(--color-accent)] !text-[var(--color-canvas)] !font-mono !text-[10px] !uppercase !tracking-[0.08em]",
        },
      }}
    />
  );
}
