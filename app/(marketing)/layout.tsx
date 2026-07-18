import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteNav } from "@/components/nav/site-nav";
import { CommandPalette } from "@/components/command/command-palette";
import { BookmarkProvider } from "@/components/auth/bookmark-provider";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The nuqs adapter lives here (not on the homepage) so the directory header
  // console and the homepage grid share one URL-state subscription — they
  // coordinate purely through the URL, no context/prop-drilling. It's an inert
  // provider on routes with no filters (/about, /contact): the apps data + filter
  // logic ride only inside the pathname-gated, dynamically-imported console.
  return (
    <NuqsAdapter>
      <SiteNav />
      {/* BookmarkProvider is a client island that hydrates per-user bookmark state
          AFTER mount via a server action — it reads no cookies in render, so the
          marketing routes stay statically prerendered and supabase-js never enters
          their chunks (§2a). */}
      <BookmarkProvider>
        <main id="main">{children}</main>
      </BookmarkProvider>
      <SiteFooter />
      <CommandPalette />
    </NuqsAdapter>
  );
}
