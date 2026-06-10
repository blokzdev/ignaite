import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteNav } from "@/components/nav/site-nav";
import { CommandPalette } from "@/components/command/command-palette";
import { RouteMemory } from "@/components/detail/route-memory";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The nuqs adapter lives here (not on the homepage) so the directory header
  // console and the homepage grid share one URL-state subscription — they
  // coordinate purely through the URL, no context/prop-drilling. It's an inert
  // provider on routes with no filters (/about, /contact): the apps data + filter
  // logic ride only inside the pathname-gated, dynamically-imported console.
  return (
    <NuqsAdapter>
      <RouteMemory />
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <CommandPalette />
    </NuqsAdapter>
  );
}
