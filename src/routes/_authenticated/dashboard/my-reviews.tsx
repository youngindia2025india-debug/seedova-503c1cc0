import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/my-reviews")({
  head: () => ({ meta: [{ title: "My reviews — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <DashboardPageHeader title="My reviews" description="Anonymous reviews you've shared." />
      <EmptyState icon={Star} title="You haven't written any reviews yet" description="Share your experience anonymously to help other patients." />
    </div>
  ),
});
