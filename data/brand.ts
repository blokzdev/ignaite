export const brand = {
  name: "Blokz",
  legalName: "Blokz Development Co.",
  domain: "blokz.dev",
  tagline:
    "An AI-managed directory of AI apps — researched, written, and kept current by Claude Code.",
  positioning:
    "Blokz is an AI-managed directory of the AI apps, agents, and tooling worth knowing — every listing researched, written, and continuously audited by Claude Code, each carrying a one-line AI insight. Built and operated by Blokz Development Co.",
  headline: {
    eyebrow: "BLOKZ.DEV // AI-MANAGED DIRECTORY",
    title: "The AI apps directory,",
    titleAccent: "managed by AI.",
    sub: "Every listing researched, written, and kept current by Claude Code — with a one-line AI insight on each.",
  },
  logo: {
    src: "https://cdn.glitch.global/d470e077-214b-4bf9-ac27-4933bce2a4c9/blokz-logo-circle-blue-640px.png?v=1676232520196",
    alt: "Blokz logo",
    width: 640,
    height: 640,
  },
  social: {
    telegram: "https://t.me/blokzdev",
    github: "https://github.com/blokzdev",
    linkedin: "https://www.linkedin.com/company/blokzdev/",
    twitter: "https://twitter.com/blokzdev/",
    gdev: "https://g.dev/blokz",
    email: "team@blokz.dev",
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
