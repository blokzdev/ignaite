"use client";
import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  /** Render just the icon (no "Copy link" label) — for compact bars. */
  iconOnly?: boolean;
  /** Override sizing (e.g. h-12 w-12 in the mobile action bar). */
  className?: string;
}

export function CopyLinkButton({ url, iconOnly, className }: Readonly<Props>) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy link to this page"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white/[0.04] font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        iconOnly ? "h-8 w-8" : "h-8 px-3",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
      ) : (
        <Link2 className="h-3.5 w-3.5" />
      )}
      {!iconOnly && <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>}
    </button>
  );
}
