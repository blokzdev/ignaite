"use client";
import { useState, type ComponentType, type ReactNode } from "react";
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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  className?: string;
}

const rowCls =
  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] text-[var(--color-ink)] transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none";
const groupLabel =
  "px-3 pt-2 pb-1 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase";

function RowIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return <Icon aria-hidden className="h-[18px] w-[18px] shrink-0 text-[var(--color-ink-dim)]" />;
}

function ActionRow({
  href,
  download,
  onClick,
  children,
}: Readonly<{ href?: string; download?: string; onClick?: () => void; children: ReactNode }>) {
  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={download ? undefined : "_blank"}
        rel={download ? undefined : "noopener noreferrer"}
        className={rowCls}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={rowCls}>
      {children}
    </button>
  );
}

// Mobile share surface: a bottom sheet (Radix Dialog) anchored to the bottom of
// the viewport — it clears the fixed action bar entirely (the dropdown opening
// upward from the bar's icon used to clip under it). Big tap targets; same
// actions as the desktop dropdown, from the shared useShareModel.
export function ShareSheet({
  name,
  tagline,
  slug,
  shareUrl,
  markdown,
  json,
  className,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const m = useShareModel({ name, tagline, slug, shareUrl, markdown, json });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={`Share or export ${name}`}
        className={cn(
          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08]",
          className,
        )}
      >
        <Share2 className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="no-scrollbar max-h-[85dvh] overflow-y-auto rounded-t-2xl pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <SheetTitle className="px-3 font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
          Share {name}
        </SheetTitle>
        <span aria-live="polite" className="sr-only">
          {m.status}
        </span>

        <div className="mt-3 flex flex-col">
          <p className={groupLabel}>Share</p>
          {m.canShare && (
            <ActionRow onClick={() => void m.nativeShare()}>
              <RowIcon icon={Smartphone} />
              Share via device…
            </ActionRow>
          )}
          <ActionRow onClick={() => void m.copy("link")()}>
            {m.copied === "link" ? (
              <Check
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 text-[var(--color-accent)]"
              />
            ) : (
              <RowIcon icon={Link2} />
            )}
            {m.copied === "link" ? "Copied" : "Copy link"}
          </ActionRow>
          <ActionRow href={m.hrefs.x}>
            <XGlyph className="h-4 w-4 shrink-0 text-[var(--color-ink-dim)]" />
            Post on X
          </ActionRow>
          <ActionRow href={m.hrefs.linkedin}>
            <RowIcon icon={Share2} />
            Share on LinkedIn
          </ActionRow>
          <ActionRow href={m.hrefs.mail}>
            <RowIcon icon={Mail} />
            Email link
          </ActionRow>

          <p className={cn(groupLabel, "mt-2 border-t border-white/[0.06] pt-3")}>Export listing</p>
          <ActionRow onClick={() => void m.copy("md")()}>
            {m.copied === "md" ? (
              <Check
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 text-[var(--color-accent)]"
              />
            ) : (
              <RowIcon icon={ClipboardCopy} />
            )}
            {m.copied === "md" ? "Copied" : "Copy as Markdown"}
          </ActionRow>
          <ActionRow href={m.hrefs.md} download={m.mdName}>
            <RowIcon icon={FileDown} />
            Download .md
          </ActionRow>
          <ActionRow href={m.hrefs.json} download={m.jsonName}>
            <RowIcon icon={FileJson} />
            Download .json
          </ActionRow>
        </div>
      </SheetContent>
    </Sheet>
  );
}
