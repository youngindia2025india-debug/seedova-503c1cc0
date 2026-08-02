import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { SectionError, TableSkeleton } from "@/components/admin/AdminStates";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  adminDeleteReview,
  adminListReviews,
  adminSetReviewStatus,
  type AdminReview,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
});

type StatusFilter = "pending" | "approved" | "rejected" | "all";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const listReviews = useServerFn(adminListReviews);
  const setStatus = useServerFn(adminSetReviewStatus);
  const removeReview = useServerFn(adminDeleteReview);

  const [status, setStatusFilter] = useState<StatusFilter>("pending");
  const [pendingDelete, setPendingDelete] = useState<AdminReview | null>(null);

  const query = useQuery({
    queryKey: ["admin", "reviews", status],
    queryFn: () => listReviews({ data: { status } }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
  };

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: "approved" | "rejected" | "pending" }) =>
      setStatus({ data: input }),
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "approved" ? "Review approved" : "Review rejected");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeReview({ data: { id } }),
    onSuccess: () => {
      toast.success("Review removed");
      setPendingDelete(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const items = query.data ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Moderate reviews"
        description="Approve, reject or remove patient reviews. Anonymous reviewers stay anonymous."
      />

      <Tabs
        value={status}
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        className="mb-3"
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {query.isError ? (
        <SectionError message="Could not load reviews." onRetry={() => void query.refetch()} />
      ) : query.isPending ? (
        <TableSkeleton rows={4} cols={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Nothing to moderate"
          description="No reviews match this filter yet."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((review) => (
            <li key={review.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{review.clinicName ?? "Unknown clinic"}</span>
                    <Badge variant={statusVariant[review.status] ?? "secondary"}>
                      {review.status}
                    </Badge>
                    <Badge variant="outline">{review.rating}★</Badge>
                    {review.isAnonymous ? <Badge variant="outline">Anonymous</Badge> : null}
                    {review.reportCount > 0 ? (
                      <Badge variant="destructive">{review.reportCount} report(s)</Badge>
                    ) : null}
                  </div>
                  {review.title ? (
                    <p className="mt-1.5 text-sm font-medium">{review.title}</p>
                  ) : null}
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                    {review.body}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={review.status === "approved" || statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({ id: review.id, status: "approved" })
                    }
                    aria-label="Approve review"
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={review.status === "rejected" || statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({ id: review.id, status: "rejected" })
                    }
                    aria-label="Reject review"
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingDelete(review)}
                    aria-label="Remove review"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove review?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the review. Consider rejecting instead if you may want to
              restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
