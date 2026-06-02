"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// Defer cmdk + the apps data until the palette is first opened — only this thin
// listener island ships in any route's First Load (mobile-sheet pattern).
const CommandPaletteBody = dynamic(
  () => import("./command-palette-body").then((m) => m.CommandPaletteBody),
  { ssr: false },
);

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openPalette = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — toggle from anywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMounted(true);
        setOpen((v) => !v);
        return;
      }
      // "/" — open, but not while typing in a field.
      if (e.key === "/" && !isEditableTarget(e.target)) {
        e.preventDefault();
        openPalette();
      }
    };
    // Lets a visible trigger (Chunk L's nav button) open the palette.
    const onOpenEvent = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blokz:open-command", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blokz:open-command", onOpenEvent);
    };
  }, [openPalette]);

  if (!mounted) return null;
  return <CommandPaletteBody open={open} onOpenChange={setOpen} />;
}
