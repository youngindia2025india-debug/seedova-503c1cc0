import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <DashboardPageHeader title="Settings" description="Manage notifications, privacy and account preferences." />
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Settings will appear here as we roll out more features.
        </CardContent>
      </Card>
    </div>
  ),
});
