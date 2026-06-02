import { SiteFooter } from "@/components/footer/site-footer";
import { SiteNav } from "@/components/nav/site-nav";
import { CommandPalette } from "@/components/command/command-palette";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <CommandPalette />
    </>
  );
}
