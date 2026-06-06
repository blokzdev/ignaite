import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppDetail } from "@/components/tools/app-detail";
import { apps } from "@/.velite";
import { getApp } from "@/lib/apps";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return buildMetadata({ title: "Not found", path: `/apps/${slug}` });
  // First sentence of description, truncated to keep the meta description tight.
  const firstSentence = app.description.split(/(?<=\.)\s/)[0] ?? app.description;
  return buildMetadata({
    title: app.name,
    description: `${app.tagline} ${firstSentence}`.trim(),
    path: `/apps/${app.slug}`,
  });
}

export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  return <AppDetail app={app} />;
}
