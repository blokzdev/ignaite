export const brand = {
  name: "Blokz",
  legalName: "Blokz Development Co.",
  domain: "blokz.dev",
  tagline: "Apps at the AI frontier. Built end-to-end with Claude Code.",
  positioning:
    "We design, prompt, and ship production-grade apps for B2B and B2C — grounded in current research (edge AI, multi-agent systems, memory architectures, distributed inference). Web3 when it earns its place. Mobile, web, desktop, anywhere users are.",
  headline: {
    eyebrow: "BLOKZ.DEV // AI APP STUDIO",
    title: "AI apps.",
    titleAccent: "Built by AI.",
    sub: "Research-rooted AI for B2B and B2C — built end-to-end with Claude Code.",
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
