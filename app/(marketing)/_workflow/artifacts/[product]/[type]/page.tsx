import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtifactFrame } from "@/components/workflow/artifact-frame";
import { artifacts, getArtifact, loadArtifact } from "@/content/workflow/artifacts";
import { buildMetadata } from "@/lib/seo";
import {
  ARTIFACT_TYPES,
  WORKFLOW_PRODUCTS,
  type ArtifactType,
  type WorkflowProduct,
} from "@/types/workflow";

interface PageProps {
  params: Promise<{ product: string; type: string }>;
}

function isWorkflowProduct(v: string): v is WorkflowProduct {
  return (WORKFLOW_PRODUCTS as ReadonlyArray<string>).includes(v);
}

function isArtifactType(v: string): v is ArtifactType {
  return (ARTIFACT_TYPES as ReadonlyArray<string>).includes(v);
}

export function generateStaticParams() {
  return artifacts.map((a) => ({ product: a.product, type: a.type }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product, type } = await params;
  if (!isWorkflowProduct(product) || !isArtifactType(type)) {
    return buildMetadata({ title: "Not found", path: `/workflow/artifacts/${product}/${type}` });
  }
  const artifact = getArtifact(product, type);
  if (!artifact) {
    return buildMetadata({ title: "Not found", path: `/workflow/artifacts/${product}/${type}` });
  }
  return buildMetadata({
    title: artifact.title,
    description: artifact.description,
    path: `/workflow/artifacts/${artifact.product}/${artifact.type}`,
  });
}

export default async function ArtifactPage({ params }: PageProps) {
  const { product, type } = await params;
  if (!isWorkflowProduct(product) || !isArtifactType(type)) notFound();
  const artifact = getArtifact(product, type);
  if (!artifact) notFound();
  const Content = await loadArtifact(product, type);
  if (!Content) notFound();

  return (
    <ArtifactFrame artifact={artifact}>
      <Content />
    </ArtifactFrame>
  );
}
