import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Flag, MessagesSquare, Star, Users, Bookmark, Clock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { SectionError, WidgetSkeleton } from "@/components/admin/AdminStates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminAnalytics } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const fetchAnalytics = useServerFn(adminAnalytics);
  const query = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => fetchAnalytics(),
  });

  const data = query.data;
  const widgets = data
    ? [
        { label: "Total clinics", value: data.clinics, icon: Building2, hint: `${data.publishedClinics} published` },
        { label: "Total users", value: data.users, icon: Users },
        { label: "Total reviews", value: data.reviews, icon: Star, hint: `${data.pendingReviews} pending` },
        { label: "Open reports", value: data.openReports, icon: Flag },
        { label: "Questions", value: data.questions, icon: MessagesSquare },
        { label: "Answers", value: data.answers, icon: MessagesSquare },
        { label: "Saved clinics", value: data.savedClinics, icon: Bookmark },
        { label: "Pending reviews", value: data.pendingReviews, icon: Clock },
      ]
    : [];

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Live counts from the database. Widgets show zero until real data exists."
      />

      {query.isError ? (
        <SectionError
          message="Could not load analytics."
          onRetry={() => void query.refetch()}
        />
      ) : query.isPending ? (
        <WidgetSkeleton count={8} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {widgets.map((w) => (
              <Card key={w.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {w.label}
                  </CardTitle>
                  <w.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold tabular-nums">{w.value}</div>
                  {w.hint ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{w.hint}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Reviews submitted per month</CardTitle>
            </CardHeader>
            <CardContent>
              {data && data.reviewsByMonth.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.reviewsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="var(--color-primary)"
                        radius={[4, 4, 0, 0]}
                        name="Reviews"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No reviews recorded yet — the chart appears once patients submit reviews.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
