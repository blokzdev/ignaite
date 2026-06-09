import {
  BookOpen,
  ExternalLink,
  Globe,
  MessageCircle,
  Play,
  Smartphone,
  Tag,
  Terminal,
} from "lucide-react";
import type { ComponentType } from "react";
import type {
  AppDeployment,
  AppLinkKind,
  AppPlatform,
  AppPricing,
  ModelSupportKind,
} from "@/types/app";

// Detail-flavored label + icon maps for the /apps/[slug] surface (the full,
// long-form labels — distinct from the shorter chip labels in
// hooks/use-directory-filters.ts). Centralized here, server-safe (no "use
// client"), so the detail body, the spec card, the sticky toolbar, and the
// action bar all share one definition instead of duplicating it.

export const PRICING_LABEL: Record<AppPricing, string> = {
  free: "FREE",
  freemium: "FREEMIUM",
  paid: "PAID",
  "byo-key": "BYO KEY",
};

export const DEPLOYMENT_LABEL: Record<AppDeployment, string> = {
  cloud: "Cloud",
  "self-host": "Self-host",
  local: "Local",
  hybrid: "Hybrid",
};

export const MODEL_KIND_LABEL: Record<ModelSupportKind, string> = {
  "single-model": "Single model (proprietary)",
  "multi-model": "Multi-model",
  "byo-key": "BYO key / model",
  "model-agnostic": "Model-agnostic",
  "self-contained": "Self-contained (on-device)",
};

export const PLATFORM_LABEL: Record<AppPlatform, string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  cli: "CLI",
  api: "API",
  "browser-extension": "Browser extension",
  "vscode-extension": "VS Code extension",
};

export const PLATFORM_ICON: Record<AppPlatform, ComponentType<{ className?: string }>> = {
  web: Globe,
  ios: Smartphone,
  android: Smartphone,
  macos: Globe,
  windows: Globe,
  linux: Terminal,
  cli: Terminal,
  api: Terminal,
  "browser-extension": Globe,
  "vscode-extension": Terminal,
};

// GitHub branded icon: lucide-react 1.x dropped it; ship our own glyph.
export function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.55v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.75.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export const LINK_ICON: Record<AppLinkKind, ComponentType<{ className?: string }>> = {
  website: ExternalLink,
  docs: BookOpen,
  github: GithubGlyph,
  pricing: Tag,
  demo: Play,
  video: Play,
  twitter: ExternalLink,
  discord: MessageCircle,
};

export const LINK_LABEL: Record<AppLinkKind, string> = {
  website: "Website",
  docs: "Docs",
  github: "GitHub",
  pricing: "Pricing",
  demo: "Demo",
  video: "Video",
  twitter: "Twitter",
  discord: "Discord",
};
