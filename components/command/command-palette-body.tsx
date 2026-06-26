"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Info, LayoutGrid, Mail, Route, Tag } from "lucide-react";
import { useState, type ComponentType } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import appsIndex from "@/.velite/apps-search.json";
import recipesIndex from "@/.velite/recipes-search.json";
import { APP_CATEGORIES, type AppCategory } from "@/types/app";
import { CATEGORY_LABEL } from "@/hooks/use-directory-filters";
import { isActiveNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When false, open "menu-first": don't focus the input (no mobile keyboard). */
  autoFocusInput: boolean;
}

const PAGES: ReadonlyArray<{
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { label: "Directory", href: "/", icon: LayoutGrid },
  { label: "Recipes", href: "/recipes", icon: Route },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

// Browsable recipes for the palette (archived hidden; "stale" still shown).
// Imports only the slim build-time index — never lib/recipes or @/.velite full,
// so the full corpus stays out of this client chunk.
const PALETTE_RECIPES = recipesIndex.filter((r) => r.status !== "archived");

// Top categories by listing count — the comfortable menu's one-tap browse tiles.
// Computed once from the slim build-time index (stable across renders).
const TOP_CATEGORIES: ReadonlyArray<{ category: AppCategory; count: number }> = (() => {
  const counts = new Map<AppCategory, number>();
  for (const app of appsIndex) {
    // Full membership: count an app under its primary and any secondary categories.
    for (const c of [app.category, ...app.secondaryCategories] as AppCategory[]) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, count]) => ({ category, count }));
})();

export function CommandPaletteBody({ open, onOpenChange, autoFocusInput }: Readonly<Props>) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  // Two states: "menu" (comfortable nav + category tiles, no keyboard) and
  // "search" (the tight, full categorized index). Focusing/typing in the input
  // flips menu → search; it stays in search until the dialog is reopened.
  const [mode, setMode] = useState<"menu" | "search">(autoFocusInput ? "search" : "menu");
  const [query, setQuery] = useState("");

  // Reset to the trigger's intent each time the dialog opens (render-phase
  // adjustment per the React docs — avoids an effect round-trip).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMode(autoFocusInput ? "search" : "menu");
      setQuery("");
    }
  }

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenAutoFocus={autoFocusInput ? undefined : (e) => e.preventDefault()}
    >
      <CommandInput
        placeholder="Search apps, categories, pages…"
        value={query}
        onValueChange={(v) => {
          setQuery(v);
          if (v) setMode("search");
        }}
        onFocus={() => setMode("search")}
      />

      {mode === "menu" ? (
        <MenuView key="menu" pathname={pathname} onNavigate={go} />
      ) : (
        <SearchView key="search" pathname={pathname} onNavigate={go} />
      )}
    </CommandDialog>
  );
}

// ── Menu state ────────────────────────────────────────────────────────────────
// Comfortable, plain (non-cmdk) content: three padded nav rows + a responsive
// grid of quick-category tiles. The scroll container mirrors CommandList sizing.
function MenuView({
  pathname,
  onNavigate,
}: Readonly<{ pathname: string; onNavigate: (href: string) => void }>) {
  return (
    <nav
      aria-label="Site"
      className="no-scrollbar max-h-[60dvh] animate-[overlay-in_120ms_ease-out] overflow-x-hidden overflow-y-auto overscroll-contain p-2 sm:max-h-80"
    >
      <ul className="flex flex-col gap-1">
        {PAGES.map((p) => {
          const active = isActiveNav(pathname, p.href);
          const Icon = p.icon;
          return (
            <li key={p.href}>
              <button
                type="button"
                onClick={() => onNavigate(p.href)}
                aria-current={active ? "page" : undefined}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05] focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
                    active
                      ? "bg-[var(--color-accent)]/[0.12] ring-[var(--color-accent)]/30"
                      : "bg-white/[0.04] ring-white/[0.08]",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-dim)]",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-[15px]",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                  )}
                >
                  {p.label}
                </span>
                {active ? (
                  <span
                    aria-hidden
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                  />
                ) : (
                  <ChevronRight
                    aria-hidden
                    className="ml-auto h-4 w-4 text-[var(--color-ink-dim)] transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="px-3 pt-4 pb-2 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
        Browse categories
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TOP_CATEGORIES.map(({ category, count }) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => onNavigate(`/?category=${category}`)}
              aria-label={`Browse ${CATEGORY_LABEL[category]} (${count} apps)`}
              className="flex w-full items-center gap-2.5 rounded-xl bg-white/[0.04] p-3 text-left ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none"
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
              <span className="truncate text-sm text-[var(--color-ink)]">
                {CATEGORY_LABEL[category]}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-[var(--color-ink-dim)]">
                {count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── Search state ──────────────────────────────────────────────────────────────
// The full, tight categorized index (cmdk filters on the controlled query).
function SearchView({
  pathname,
  onNavigate,
}: Readonly<{ pathname: string; onNavigate: (href: string) => void }>) {
  return (
    <CommandList className="animate-[overlay-in_120ms_ease-out] overscroll-contain">
      <CommandEmpty>No results.</CommandEmpty>

      {/* Apps lead the search view — when you're typing, apps are the target.
          Navigate + Categories sink to the bottom since the menu state already
          surfaces the nav menu and the top-category tiles. */}
      <CommandGroup heading="Apps">
        {appsIndex.map((app) => (
          <CommandItem
            key={app.slug}
            value={`${app.name} ${app.vendor ?? ""}`}
            keywords={[
              ...(app.tags ?? []),
              app.category,
              ...app.secondaryCategories,
              app.vendor ?? "",
            ]}
            onSelect={() => onNavigate(`/apps/${app.slug}`)}
          >
            <span className="truncate text-[var(--color-ink)]">{app.name}</span>
            <span className="ml-auto shrink-0 pl-3 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
              {CATEGORY_LABEL[app.category as AppCategory]}
            </span>
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      {PALETTE_RECIPES.length > 0 ? (
        <>
          <CommandGroup heading="Recipes">
            {PALETTE_RECIPES.map((r) => (
              <CommandItem
                key={r.slug}
                value={`recipe ${r.title} ${r.goal} ${r.audience}`}
                keywords={r.tags}
                onSelect={() => onNavigate(`/recipes/${r.slug}`)}
              >
                <Route className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
                <span className="truncate text-[var(--color-ink)]">{r.title}</span>
                <span className="ml-auto shrink-0 pl-3 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                  {r.stepCount} steps
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
        </>
      ) : null}

      <CommandGroup heading="Categories">
        {APP_CATEGORIES.map((c) => (
          <CommandItem
            key={c}
            value={`category ${CATEGORY_LABEL[c]}`}
            onSelect={() => onNavigate(`/?category=${c}`)}
          >
            <Tag className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
            <span className="text-[var(--color-ink)]">{CATEGORY_LABEL[c]}</span>
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Navigate">
        {PAGES.map((p) => {
          const active = isActiveNav(pathname, p.href);
          const Icon = p.icon;
          return (
            <CommandItem
              key={p.href}
              value={`page ${p.label}`}
              onSelect={() => onNavigate(p.href)}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-dim)]",
                )}
              />
              <span className={active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"}>
                {p.label}
              </span>
              {active && (
                <span
                  aria-hidden
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                />
              )}
            </CommandItem>
          );
        })}
      </CommandGroup>
    </CommandList>
  );
}
