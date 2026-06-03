import {
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  Globe,
  MessageCircle,
  Package,
  Play,
  Send,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { chains } from "@/data/chains";
import type { Chain, LinkKind, ProjectLink, ProjectStat, ProjectStatus } from "@/types/project";

const STATUS_MAP: Record<
  ProjectStatus,
  { variant: "success" | "accent" | "warn" | "default"; label: string }
> = {
  live: { variant: "success", label: "LIVE" },
  beta: { variant: "accent", label: "BETA" },
  "coming-soon": { variant: "warn", label: "SOON" },
  deprecated: { variant: "default", label: "DEPRECATED" },
  archived: { variant: "default", label: "ARCHIVED" },
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  const { variant, label } = STATUS_MAP[status];
  return (
    <Badge variant={variant} className="gap-1.5">
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full bg-current"
        style={{ opacity: status === "live" ? 1 : 0.7 }}
      />
      {label}
    </Badge>
  );
}

export function ChainChip({ chain }: { chain: Chain }) {
  const meta = chains[chain];
  return (
    <Badge variant="default">
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.short}
    </Badge>
  );
}

export function Monogram({
  name,
  accentColor,
  size = "md",
}: {
  name: string;
  accentColor: string;
  size?: "md" | "lg";
}) {
  const letters = name
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const dim = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  const textSize = size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <div
      aria-hidden
      className={`flex flex-none items-center justify-center rounded-2xl ${dim}`}
      style={{
        background: `${accentColor}1f`,
        boxShadow: `inset 0 0 0 1px ${accentColor}55`,
      }}
    >
      <span className={`text-display ${textSize}`} style={{ color: accentColor }}>
        {letters}
      </span>
    </div>
  );
}

export function StatLine({ stat }: { stat: ProjectStat }) {
  switch (stat.kind) {
    case "rating":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          <span aria-hidden className="text-[var(--color-accent)]">
            ★
          </span>{" "}
          {stat.value}
          <span className="sr-only"> rating</span>
        </span>
      );
    case "downloads":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          {stat.value} <span className="text-[var(--color-ink-dim)]">downloads</span>
        </span>
      );
    case "reviews":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          {stat.value} <span className="text-[var(--color-ink-dim)]">reviews</span>
        </span>
      );
    case "stars":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          <span aria-hidden>★</span> {stat.value}
          <span className="sr-only"> stars</span>
        </span>
      );
    case "forks":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          ⑂ {stat.value}
          <span className="sr-only"> forks</span>
        </span>
      );
    case "users":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          {stat.value} <span className="text-[var(--color-ink-dim)]">users</span>
        </span>
      );
    case "tvl":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          {stat.value} <span className="text-[var(--color-ink-dim)]">TVL</span>
        </span>
      );
    case "version":
      return <span className="font-mono text-[var(--color-ink-dim)]">v{stat.value}</span>;
    case "custom":
      return (
        <span className="font-mono text-[var(--color-ink-soft)]">
          {stat.label && <span className="text-[var(--color-ink-dim)]">{stat.label}: </span>}
          {stat.value}
        </span>
      );
  }
}

// Branded icons (Github/Gitlab/Discord/Telegram) were dropped in lucide-react 1.x
// for trademark reasons, so we ship our own minimal glyphs. Tracked in BACKLOG.
function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.55v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.75.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function GitlabGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.5 2.1l2.44 7.5h8.12l2.44-7.5a.42.42 0 0 1 .8 0l2.44 7.5 1.21 3.78c.1.32-.02.66-.3.94Z" />
    </svg>
  );
}

const LINK_LABELS: Record<LinkKind, string> = {
  "play-store": "Get on Play",
  "app-store": "App Store",
  github: "GitHub",
  gitlab: "GitLab",
  website: "Website",
  docs: "Docs",
  demo: "Try demo",
  download: "Download",
  npm: "npm",
  discord: "Discord",
  telegram: "Telegram",
  video: "Watch",
};

export function linkLabel(link: ProjectLink): string {
  return link.label ?? LINK_LABELS[link.kind];
}

export function LinkIcon({ kind, className }: { kind: LinkKind; className?: string }) {
  switch (kind) {
    case "play-store":
    case "app-store":
      return <Smartphone className={className} />;
    case "github":
      return <GithubGlyph className={className} />;
    case "gitlab":
      return <GitlabGlyph className={className} />;
    case "website":
      return <Globe className={className} />;
    case "docs":
      return <BookOpen className={className} />;
    case "demo":
      return <ExternalLink className={className} />;
    case "download":
      return <Download className={className} />;
    case "npm":
      return <Package className={className} />;
    case "discord":
      return <MessageCircle className={className} />;
    case "telegram":
      return <Send className={className} />;
    case "video":
      return <Play className={className} />;
    default:
      return <ArrowUpRight className={className} />;
  }
}

export function SecondaryIconLink({ link }: { link: ProjectLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={linkLabel(link)}
      title={linkLabel(link)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]"
    >
      <LinkIcon kind={link.kind} className="h-4 w-4" />
    </a>
  );
}
