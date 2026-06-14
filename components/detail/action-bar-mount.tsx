"use client";
import { useEffect } from "react";

// Flags the document while the mobile action bar is mounted, so globals.css can
// reserve footer space for the fixed bar (the footer is a sibling of <main>, so
// the detail shell's own bottom padding can't clear it). Renders nothing.
export function ActionBarMount() {
  useEffect(() => {
    document.documentElement.dataset.detailActionbar = "true";
    return () => {
      delete document.documentElement.dataset.detailActionbar;
    };
  }, []);
  return null;
}
