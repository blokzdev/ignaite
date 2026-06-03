import type { Metadata } from "next";
import { Workflow } from "@/components/workflow/workflow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Workflow",
  description:
    "Our vibecoding workflow — from concept to shipped product, with platform-specific nuance for web, Android, Windows, and iOS.",
  path: "/workflow",
});

export default function WorkflowPage() {
  return <Workflow />;
}
