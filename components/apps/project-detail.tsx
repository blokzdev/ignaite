import {
  ChainChip,
  LinkIcon,
  Monogram,
  StatLine,
  StatusPill,
  linkLabel,
} from "@/components/apps/card-bits";
import { ProjectGrid } from "@/components/apps/project-grid";
import { DetailShell } from "@/components/detail/detail-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { relatedProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/seo";
import type { Project, ProjectStat } from "@/types/project";

interface Props {
  project: Project;
}

export function ProjectDetail({ project }: Readonly<Props>) {
  const accent = project.media.accentColor ?? "var(--color-accent)";
  const related = relatedProjects(project.slug, 3);
  const rating = project.stats.find((s) => s.kind === "rating");
  const reviews = project.stats.find((s) => s.kind === "reviews");
  const primary = project.links.find((l) => l.primary) ?? project.links[0];

  return (
    <DetailShell
      accent={accent}
      breadcrumb={[{ label: "Portfolio", href: "/about#portfolio" }, { label: project.name }]}
      shareUrl={`${siteUrl}/portfolio/${project.slug}`}
      sticky={{ href: primary?.url ?? "/about#portfolio", label: `Open ${project.name}` }}
    >
      <header className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Monogram name={project.name} accentColor={accent} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {project.chains.map((c) => (
              <ChainChip key={c} chain={c} />
            ))}
            <StatusPill status={project.status} />
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-display text-[var(--color-ink)]">{project.name}</span>
          </h1>
          <p className="mt-3 text-base text-[var(--color-ink-dim)] sm:text-lg">{project.tagline}</p>
        </div>
      </header>

      {project.stats.length > 0 && (
        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/[0.06] py-4 text-sm">
          {project.stats.map((s, i) => (
            <li key={`${s.kind}-${i}`}>
              <StatLine stat={s} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-[var(--color-ink-dim)] sm:text-lg">
        {project.description}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {project.links.map((link, i) => {
          const isPrimary = link.primary || (i === 0 && !project.links.some((l) => l.primary));
          return (
            <a
              key={`${link.kind}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className={
                isPrimary
                  ? "inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)]"
                  : "inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.04] px-5 font-mono text-xs tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08]"
              }
            >
              <LinkIcon kind={link.kind} className="h-3.5 w-3.5" />
              {linkLabel(link)}
            </a>
          );
        })}
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-mono text-xs tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
            Related projects
          </h2>
          <ProjectGrid projects={related} />
        </section>
      )}

      <JsonLd data={projectJsonLd(project, rating, reviews)} />
    </DetailShell>
  );
}

function projectJsonLd(
  project: Project,
  rating: ProjectStat | undefined,
  reviews: ProjectStat | undefined,
): Record<string, unknown> {
  const operatingSystem = project.platforms.includes("android")
    ? "Android"
    : project.platforms.includes("ios")
      ? "iOS"
      : "Web";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: `${siteUrl}/portfolio/${project.slug}`,
    applicationCategory: project.category ?? "Utilities",
    operatingSystem,
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };

  if (rating?.raw) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.raw,
      ratingCount: reviews?.raw ?? 1,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}
