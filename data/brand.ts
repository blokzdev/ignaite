export const brand = {
  name: "Ignaite",
  legalName: "Ignaite Labs",
  domain: "ignaite.app",
  tagline:
    "An AI-managed directory of AI apps — researched, written, and kept current by Claude Code.",
  positioning:
    "Ignaite is an AI-managed directory of the AI apps, agents, and tooling worth knowing — every listing researched, written, and continuously audited by Claude Code, each carrying a one-line fact worth knowing. Built and operated by Ignaite Labs.",
  headline: {
    eyebrow: "IGNAITE.APP // AI-MANAGED DIRECTORY",
    title: "The AI apps directory,",
    titleAccent: "managed by AI.",
    sub: "Every listing researched, written, and kept current by Claude Code — with a one-line fact worth knowing on each.",
  },
  logo: {
    src: "/icon",
    alt: "Ignaite logo",
    width: 640,
    height: 640,
  },
  social: {
    telegram: "https://t.me/blokzdev",
    github: "https://github.com/blokzdev",
    linkedin: "https://www.linkedin.com/company/blokzdev/",
    twitter: "https://x.com/ignaitelabs",
    gdev: "https://g.dev/blokz",
    email: "team@ignaite.app",
    playStore: "https://play.google.com/store/apps/dev?id=8878695474933625157",
    flowPage: "https://flow.page/blokz",
  },
  nav: [
    { href: "/", label: "Directory" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type Brand = typeof brand;
