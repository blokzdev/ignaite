"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { brand } from "@/data/brand";
import { isActiveNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Lazy-loaded mobile-sheet body. Imported on first menu click so the
 * Radix Dialog chunk (~30 KB) stays out of every route's First Load JS.
 * See components/nav/mobile-sheet.tsx for the trigger.
 */
export function MobileSheetPortal({ open, onOpenChange }: Readonly<Props>) {
  const pathname = usePathname() ?? "/";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <nav aria-label="Mobile">
          <ul className="mt-12 flex flex-col gap-2">
            <li>
              <SheetClose asChild>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("blokz:open-command"))}
                  className="flex w-full items-center gap-2.5 rounded-md px-4 py-3 font-mono text-sm tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:bg-white/[0.04] hover:text-[var(--color-ink)]"
                >
                  <Search className="h-4 w-4" />
                  Search apps…
                </button>
              </SheetClose>
            </li>
            {brand.nav.map((item) => {
              const active = isActiveNav(pathname, item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-4 py-3 font-mono text-sm tracking-[0.08em] uppercase transition-colors",
                        active
                          ? "bg-white/[0.04] text-[var(--color-ink)]"
                          : "text-[var(--color-ink-dim)] hover:bg-white/[0.04] hover:text-[var(--color-ink)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
