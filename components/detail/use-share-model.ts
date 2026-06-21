"use client";
import { useCallback, useState } from "react";

interface Input {
  name: string;
  tagline: string;
  slug: string;
  shareUrl: string;
  /** Pre-built export payloads (lib/tools/app-export — generated at SSG time). */
  markdown: string;
  json: string;
}

// Single source of truth for the listing's share/export actions, shared by the
// desktop dropdown (share-menu) and the mobile bottom sheet (share-sheet) so the
// two presentations never drift. Holds the copy-feedback state (+ an announced
// status for screen readers), the native-share call, and the computed intent
// hrefs.
export function useShareModel({ name, tagline, slug, shareUrl, markdown, json }: Readonly<Input>) {
  const [copied, setCopied] = useState<"link" | "md" | null>(null);
  // Announced to assistive tech via an aria-live region in each presentation.
  const [status, setStatus] = useState("");

  const copy = useCallback(
    (kind: "link" | "md") => async () => {
      const text = kind === "link" ? shareUrl : markdown;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(kind);
        setStatus(kind === "link" ? "Link copied to clipboard" : "Markdown copied to clipboard");
        setTimeout(() => setCopied(null), 1400);
      } catch {
        // Clipboard unavailable (insecure context) — fail silently.
      }
    },
    [shareUrl, markdown],
  );

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const nativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: `${name} — Ignaite`, text: tagline, url: shareUrl });
    } catch {
      // User dismissed the sheet (AbortError) — nothing to do.
    }
  }, [name, tagline, shareUrl]);

  // X: the canonical intent endpoint is twitter.com/intent/tweet (x.com/intent/post
  // is unrecognised by the app — it opens then bounces). Pre-fills the post and
  // attributes via @ignaitelabs.
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${name} — ${tagline}`)}&url=${encodeURIComponent(shareUrl)}&via=ignaitelabs`;
  // LinkedIn ignores text params — it builds the post from the page's OG tags.
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(`${name} — Ignaite`)}&body=${encodeURIComponent(`${tagline}\n\n${shareUrl}`)}`;
  const mdHref = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
  const jsonHref = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;

  return {
    copied,
    status,
    copy,
    canShare,
    nativeShare,
    mdName: `${slug}.md`,
    jsonName: `${slug}.json`,
    hrefs: { x: xHref, linkedin: linkedinHref, mail: mailHref, md: mdHref, json: jsonHref },
  };
}
