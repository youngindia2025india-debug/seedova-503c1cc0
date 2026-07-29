import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/saved-clinics")({
  head: () => ({ meta: [{ title: "Saved clinics — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <DashboardPageHeader title="Saved clinics" description="Clinics you've bookmarked for later." />
      <EmptyState icon={Bookmark} title="No saved clinics yet" description="Save clinics from search to compare and revisit them here." />
    </div>
  ),
});
