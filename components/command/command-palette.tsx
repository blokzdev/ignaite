"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
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
  // Whether the next open focuses the search input. Keyboard/search entrypoints
  // open "search-first" (true); the mobile menu trigger opens "menu-first"
  // (false) so the nav list shows without popping the virtual keyboard.
  const [autoFocusInput, setAutoFocusInput] = useState(true);
  const pathname = usePathname();

  const openPalette = useCallback((focus = true) => {
    setAutoFocusInput(focus);
    setMounted(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — toggle from anywhere (search-first).
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAutoFocusInput(true);
        setMounted(true);
        setOpen((v) => !v);
        return;
      }
      // "/" — not while typing in a field. On the directory route it focuses the
      // in-header filter field (a distinct affordance from the ⌘K jump palette);
      // everywhere else it opens the palette (search-first).
      if (e.key === "/" && !isEditableTarget(e.target)) {
        e.preventDefault();
        if (pathname === "/") {
          window.dispatchEvent(new Event("blokz:focus-search"));
        } else {
          openPalette(true);
        }
      }
    };
    // Visible triggers open the palette. The mobile menu button passes
    // { focus: false } to open menu-first; search affordances omit it (→ true).
    const onOpenEvent = (e: Event) => {
      const focus = (e as CustomEvent<{ focus?: boolean }>).detail?.focus ?? true;
      openPalette(focus);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blokz:open-command", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blokz:open-command", onOpenEvent);
    };
  }, [openPalette, pathname]);

  if (!mounted) return null;
  return <CommandPaletteBody open={open} onOpenChange={setOpen} autoFocusInput={autoFocusInput} />;
}
