import type { MetadataRoute } from "next";
import { brand } from "@/data/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: brand.name,
    short_name: brand.name,
    description: brand.tagline,
    start_url: "/",
    scope: "/",
    lang: "en",
    dir: "ltr",
    display: "standalone",
    background_color: "#0a0712",
    theme_color: "#0a0712",
    categories: ["productivity", "developer", "directory"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/pwa-icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Browse apps", short_name: "Directory", url: "/" },
      { name: "How it's managed", short_name: "About", url: "/about" },
      { name: "Contact", short_name: "Contact", url: "/contact" },
    ],
    screenshots: [
      {
        src: "/pwa-screenshot-wide",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Ignaite — the AI apps directory, managed by AI",
      },
      {
        src: "/pwa-screenshot-narrow",
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow",
        label: "Ignaite — the AI apps directory, managed by AI",
      },
    ],
  };
}
