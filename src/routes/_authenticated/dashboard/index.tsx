import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageHeader } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Star, Users, Route as RouteIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — Seedova" }, { name: "robots", content: "noindex" }] }),
  component: DashboardHome,
});

const stats = [
  { label: "Saved clinics", value: 0, icon: Bookmark },
  { label: "My reviews", value: 0, icon: Star },
  { label: "Questions asked", value: 0, icon: Users },
  { label: "Journey entries", value: 0, icon: RouteIcon },
];

function DashboardHome() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split("@")[0] ?? "there";
  return (
    <div>
      <DashboardPageHeader title={`Welcome back, ${name}`} description="Here's an overview of your Seedova activity." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Explore the sidebar to save clinics, share anonymous reviews, join the community and track your treatment journey.
        </CardContent>
      </Card>
    </div>
  );
}
