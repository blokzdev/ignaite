"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { bumpNavCount } from "@/lib/tools/directory-session";

// Mounted once in the (persistent) marketing layout. It counts in-app
// navigations per tab so a detail page's back control knows router.back() will
// stay on-site (vs a direct landing, where it would leave). No UI. The first
// render is the initial page load — skip it; only count subsequent pathname
// changes (filter-only ?query changes don't change pathname, which is correct —
// those aren't "navigations" for back purposes).
export function RouteMemory() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    bumpNavCount();
  }, [pathname]);

  return null;
}
