import { ProjectCard } from "@/components/apps/project-card";
import { listProjects } from "@/lib/projects";

export function AppsPreview() {
  const items = listProjects();
  if (items.length === 0) return null;

  return (
    <section id="portfolio" className="section-y relative scroll-mt-24 px-6">
      <div className="container-site">
        <header className="mb-12 max-w-xl">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// In production"}</p>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl">
            <span className="text-display text-[var(--color-ink)]">What we&apos;ve shipped.</span>
          </h2>
          <p className="mt-4 text-base text-[var(--color-ink-dim)]">
            Every Blokz-built app shipping today — blockchain explorers, web apps, OSS placeholders.
            Tap a card to read the full story.
          </p>
        </header>

        <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
