"use client";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LayoutGrid, Tag } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { apps } from "@/data/apps";
import { APP_CATEGORIES } from "@/types/app";
import { CATEGORY_LABEL } from "@/hooks/use-directory-filters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAGES: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Directory", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function CommandPaletteBody({ open, onOpenChange }: Readonly<Props>) {
  const router = useRouter();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search apps, categories, pages…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Apps">
          {apps.map((app) => (
            <CommandItem
              key={app.slug}
              value={`${app.name} ${app.vendor ?? ""}`}
              keywords={[...(app.tags ?? []), app.category, app.vendor ?? ""]}
              onSelect={() => go(`/apps/${app.slug}`)}
            >
              <span className="truncate text-[var(--color-ink)]">{app.name}</span>
              <span className="ml-auto shrink-0 pl-3 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
                {CATEGORY_LABEL[app.category]}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

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

        <CommandGroup heading="Go to">
          {PAGES.map((p) => (
            <CommandItem key={p.href} value={`page ${p.label}`} onSelect={() => go(p.href)}>
              {p.href === "/" ? (
                <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-dim)]" />
              )}
              <span className="text-[var(--color-ink)]">{p.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
