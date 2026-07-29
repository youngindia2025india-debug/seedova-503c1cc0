import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/treatment-journey")({
  head: () => ({ meta: [{ title: "Treatment journey — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <DashboardPageHeader title="Treatment journey" description="A private timeline of your IVF journey — only you can see it." />
      <EmptyState icon={RouteIcon} title="No journey entries yet" description="Log stages, notes and dates to track your progress over time." />
    </div>
  ),
});
