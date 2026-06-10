"use client";
import { useState } from "react";
import {
  Check,
  ClipboardCopy,
  FileDown,
  FileJson,
  Link2,
  Mail,
  Share2,
  Smartphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// X's logo glyph (lucide has no brand icons).
function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3Z" />
    </svg>
  );
}

interface Props {
  name: string;
  tagline: string;
  slug: string;
  shareUrl: string;
  /** Pre-built export payloads (lib/tools/app-export — generated at SSG time). */
  markdown: string;
  json: string;
  /** "bar" = icon trigger (mobile action bar / masthead); "card" = labeled chip. */
  variant: "bar" | "card";
  /** Menu open direction; defaults to up for "bar" (bottom-anchored), down for "card". */
  side?: "top" | "bottom";
  className?: string;
}

// The listing's share + export surface: native device share, copy link /
// copy-as-Markdown (inline "Copied" feedback, menu stays open), multi-format
// downloads (.md / .json via data-URI anchors — the payloads are prop strings,
// nothing is generated client-side), and X / LinkedIn / email intents.
export function ShareMenu({
  name,
  tagline,
  slug,
  shareUrl,
  markdown,
  json,
  variant,
  side,
  className,
}: Readonly<Props>) {
  const [copied, setCopied] = useState<"link" | "md" | null>(null);

  // Keep the menu open and flash the item label so copy feedback is inline
  // (no toaster on this route).
  const copy = (kind: "link" | "md", text: string) => async (e: Event) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      // Clipboard unavailable — fail silently.
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${name} — Ignaite`, text: tagline, url: shareUrl });
    } catch {
      // User dismissed the sheet (AbortError) — nothing to do.
    }
  };

  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(`${name} — ${tagline}`)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(`${name} — Ignaite`)}&body=${encodeURIComponent(`${tagline}\n\n${shareUrl}`)}`;
  const mdHref = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
  const jsonHref = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Share or export ${name}`}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08]",
          variant === "bar"
            ? "h-12 w-12"
            : "h-8 gap-1.5 px-3 font-mono text-[11px] tracking-[0.08em] uppercase",
          className,
        )}
      >
        <Share2 className={variant === "bar" ? "h-4 w-4" : "h-3 w-3"} />
        {variant === "card" && "Share"}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={side ?? (variant === "bar" ? "top" : "bottom")}
        className="min-w-[13rem]"
      >
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        {/* Content only mounts on open (client), so the capability check is safe. */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <DropdownMenuItem onSelect={() => void nativeShare()}>
            <Smartphone className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Share via device…
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={copy("link", shareUrl)}>
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
          )}
          {copied === "link" ? "Copied" : "Copy link"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={xHref} target="_blank" rel="noopener noreferrer">
            <XGlyph className="h-3 w-3 text-[var(--color-ink-dim)]" />
            Post on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
            <Share2 className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={mailHref}>
            <Mail className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Email link
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Export listing</DropdownMenuLabel>
        <DropdownMenuItem onSelect={copy("md", markdown)}>
          {copied === "md" ? (
            <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          ) : (
            <ClipboardCopy className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
          )}
          {copied === "md" ? "Copied" : "Copy as Markdown"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={mdHref} download={`${slug}.md`}>
            <FileDown className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Download .md
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={jsonHref} download={`${slug}.json`}>
            <FileJson className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Download .json
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
