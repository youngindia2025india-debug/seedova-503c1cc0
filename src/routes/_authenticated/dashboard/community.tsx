import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/community")({
  head: () => ({ meta: [{ title: "Community — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <DashboardPageHeader title="Community" description="Your anonymous questions and answers." />
      <EmptyState icon={Users} title="Nothing here yet" description="Ask a question or answer someone else's to get started." />
    </div>
  ),
});
