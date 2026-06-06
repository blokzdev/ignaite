"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense, useEffect } from "react";
import { brand } from "@/data/brand";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { isActiveNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { MobileSheet } from "./mobile-sheet";
import { DirectoryConsoleSkeleton } from "./directory-console-skeleton";

// The directory search/filter console is a separate chunk, loaded only on `/`
// (the pathname gate below). Keeping the import() inside dynamic() — and never
// rendering it off-route — is what keeps the apps data + filter logic out of the
// /about and /contact bundles even though this nav ships in the shared layout.
const DirectoryConsole = dynamic(() =>
  import("@/components/tools/directory-console").then((m) => m.DirectoryConsole),
);

function openCommandPalette() {
  window.dispatchEvent(new Event("blokz:open-command"));
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const isDirectory = pathname === "/";
  const scrolled = useScrollThreshold(8);
  const reduced = useReducedMotion();
  // Pin the header on the directory route (the search must stay one keystroke
  // away); keep the scroll-down auto-hide on content routes. Hooks run every
  // render — only the resulting value is gated. Never hide for reduced-motion
  // users (the snap would be jarring without a transition).
  const scrollHidden = useScrollDirection(80);
  const hidden = !isDirectory && scrollHidden && !reduced;

  // Publish nav visibility so sticky bars (the directory filter bar) can ride up
  // to the top edge via `top: var(--nav-h)` when the nav slides away.
  useEffect(() => {
    document.documentElement.dataset.navHidden = String(hidden);
    return () => {
      document.documentElement.dataset.navHidden = "false";
    };
  }, [hidden]);

  return (
    <header
      className={cn(
        "ease-out-expo fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-300",
        // Reveal on focus-within so keyboard users tabbing into a hidden nav
        // always see it (no off-screen focus trap).
        hidden ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0",
        scrolled
          ? "border-b border-white/[0.06] bg-[var(--color-canvas)]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-site flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${brand.name} home`}
        >
          <span className="block h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)] transition-transform group-hover:scale-125" />
          <span className="font-mono text-sm tracking-[0.16em] text-[var(--color-ink)] uppercase">
            {brand.name}
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-1">
            {brand.nav.map((item) => {
              const active = isActiveNav(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-1.5 font-mono text-xs tracking-[0.08em] uppercase transition-colors focus-visible:text-[var(--color-ink)]",
                      active
                        ? "bg-white/[0.06] text-[var(--color-ink)]"
                        : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* On `/` the console hosts a full search field, so this pill would be
              redundant — keep it only on content routes. */}
          {!isDirectory && (
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Search (Command/Ctrl + K)"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] py-1.5 pr-1.5 pl-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              <Search className="h-3.5 w-3.5" />
              Search
              <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-dim)]">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        <MobileNavCluster />
      </nav>

      {/* Directory console (search + quick-category strip + Filters) — only on `/`.
          The Suspense skeleton holds the header's height while the chunk hydrates
          (and is the static-render fallback for its nuqs useSearchParams read). */}
      {isDirectory && (
        <Suspense fallback={<DirectoryConsoleSkeleton />}>
          <DirectoryConsole />
        </Suspense>
      )}
    </header>
  );
}

// Mobile: a search shortcut next to the menu trigger, so the ⌘K palette is
// reachable without a keyboard.
function MobileNavCluster() {
  return (
    <div className="flex items-center gap-1 md:hidden">
      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Search apps"
        className="rounded-full p-2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        <Search className="h-5 w-5" />
      </button>
      <MobileSheet />
    </div>
  );
}
