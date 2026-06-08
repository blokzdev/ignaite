import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/effects/lenis-provider";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { ReducedMotionProvider } from "@/components/effects/reduced-motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { brand } from "@/data/brand";
import { buildMetadata, siteUrl } from "@/lib/seo";
import "./globals.css";

// Self-hosted + preloaded via next/font (was a plain @fontsource CSS @import,
// which wasn't preloaded → the serif hero text flashed/reflowed on load).
const instrumentSerif = localFont({
  src: "./fonts/instrument-serif-latin-400-italic.woff2",
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: "#0a0712",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      data-motion="full"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.08em] focus:text-[var(--color-canvas)] focus:uppercase"
        >
          Skip to content
        </a>
        <ReducedMotionProvider>
          <LenisProvider>
            {children}
            <NoiseOverlay />
          </LenisProvider>
        </ReducedMotionProvider>
        <Analytics />
        <SpeedInsights />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: brand.legalName,
            alternateName: brand.name,
            url: siteUrl,
            description: brand.positioning,
            logo: `${siteUrl}/apple-icon`,
            sameAs: [
              brand.social.github,
              brand.social.linkedin,
              brand.social.twitter,
              brand.social.telegram,
              brand.social.gdev,
              brand.social.playStore,
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: brand.social.email,
              contactType: "customer support",
            },
          }}
        />
      </body>
    </html>
  );
}
