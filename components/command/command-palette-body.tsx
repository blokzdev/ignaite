"use client";
import { usePathname, useRouter } from "next/navigation";
import { Info, LayoutGrid, Mail, Tag } from "lucide-react";
import type { ComponentType } from "react";
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
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function CommandPaletteBody({ open, onOpenChange, autoFocusInput }: Readonly<Props>) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

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
      <CommandInput placeholder="Search apps, categories, pages…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {PAGES.map((p) => {
            const active = isActiveNav(pathname, p.href);
            const Icon = p.icon;
            return (
              <CommandItem
                key={p.href}
                value={`page ${p.label}`}
                onSelect={() => go(p.href)}
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

        <CommandSeparator />

        <CommandGroup heading="Categories">
          {APP_CATEGORIES.map((c) => (
            <CommandItem
              key={c}
              value={`category ${CATEGORY_LABEL[c]}`}
              onSelect={() => go(`/?category=${c}`)}
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
              <span className="text-[var(--color-ink)]">{CATEGORY_LABEL[c]}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Apps">
          {appsIndex.map((app) => (
            <CommandItem
              key={app.slug}
              value={`${app.name} ${app.vendor ?? ""}`}
              keywords={[...(app.tags ?? []), app.category, app.vendor ?? ""]}
              onSelect={() => go(`/apps/${app.slug}`)}
            >
              <span className="truncate text-[var(--color-ink)]">{app.name}</span>
              <span className="ml-auto shrink-0 pl-3 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                {CATEGORY_LABEL[app.category as AppCategory]}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
