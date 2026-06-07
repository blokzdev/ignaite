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
  // The top nav row hides on scroll-down and reveals on scroll-up — on every
  // route, including `/`. On the directory route only the nav ROW collapses; the
  // search/category console below it stays pinned (it must never be more than a
  // keystroke away). On content routes the whole header slides away as before.
  // Never hide for reduced-motion users (the snap would be jarring untransitioned).
  const navHidden = useScrollDirection(80) && !reduced;

  // Publish nav visibility so the condensed --nav-h (scroll-padding / skip-link
  // landing) tracks the collapsed chrome: 0 on content routes, console-height on
  // the directory route. See the data-route rules in globals.css.
  useEffect(() => {
    document.documentElement.dataset.navHidden = String(navHidden);
    return () => {
      document.documentElement.dataset.navHidden = "false";
    };
  }, [navHidden]);

  return (
    <header
      className={cn(
        "ease-out-expo fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-300",
        // Content routes slide the whole header away; the directory route keeps
        // its console pinned and only collapses the nav row (below). Reveal on
        // focus-within so keyboard users tabbing into a hidden nav always see it.
        !isDirectory &&
          (navHidden ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0"),
        scrolled
          ? "border-b border-white/[0.06] bg-[var(--color-canvas)]/80 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      {/* Top nav row. On `/` it collapses on scroll-down (the console below stays
          pinned) and re-opens on scroll-up or focus-within; on content routes it
          rides with the whole header. */}
      <div
        className={cn(
          "ease-out-expo overflow-hidden transition-[max-height,opacity] duration-300 motion-reduce:transition-none",
          isDirectory && navHidden ? "max-h-0 opacity-0" : "max-h-[var(--nav-row-h)] opacity-100",
          isDirectory && "focus-within:max-h-[var(--nav-row-h)] focus-within:opacity-100",
        )}
      >
        <nav className="container-site flex h-[var(--nav-row-h)] items-center justify-between px-6">
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
      </div>

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
