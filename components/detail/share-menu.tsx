"use client";
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
import { useShareModel } from "./use-share-model";
import { XGlyph } from "./x-glyph";

interface Props {
  name: string;
  tagline: string;
  slug: string;
  shareUrl: string;
  markdown: string;
  json: string;
  /** "bar" = icon trigger; "card" = labeled chip. */
  variant: "bar" | "card";
  /** Menu open direction (defaults: bar→up, card→down). */
  side?: "top" | "bottom";
  className?: string;
}

// The listing's share + export surface as a dropdown — used ≥sm (the masthead,
// opening downward). The mobile bottom-bar share uses <ShareSheet> instead, so
// the upward-from-a-fixed-bar collision no longer exists here. Native device
// share, copy link / copy-as-Markdown (inline + announced feedback), X /
// LinkedIn / email intents, and .md/.json downloads — all from useShareModel.
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
  const m = useShareModel({ name, tagline, slug, shareUrl, markdown, json });

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
        collisionPadding={12}
        className="no-scrollbar max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[13rem] overflow-y-auto"
      >
        {/* Copy feedback for screen readers (the inline label flash is visual). */}
        <span aria-live="polite" className="sr-only">
          {m.status}
        </span>

        <DropdownMenuLabel>Share</DropdownMenuLabel>
        {m.canShare && (
          <DropdownMenuItem onSelect={() => void m.nativeShare()}>
            <Smartphone aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Share via device…
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void m.copy("link")();
          }}
        >
          {m.copied === "link" ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          ) : (
            <Link2 aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
          )}
          {m.copied === "link" ? "Copied" : "Copy link"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={m.hrefs.x} target="_blank" rel="noopener noreferrer">
            <XGlyph className="h-3 w-3 text-[var(--color-ink-dim)]" />
            Post on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={m.hrefs.linkedin} target="_blank" rel="noopener noreferrer">
            <Share2 aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={m.hrefs.mail}>
            <Mail aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Email link
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Export listing</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void m.copy("md")();
          }}
        >
          {m.copied === "md" ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          ) : (
            <ClipboardCopy aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
          )}
          {m.copied === "md" ? "Copied" : "Copy as Markdown"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={m.hrefs.md} download={m.mdName}>
            <FileDown aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Download .md
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={m.hrefs.json} download={m.jsonName}>
            <FileJson aria-hidden className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
            Download .json
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
