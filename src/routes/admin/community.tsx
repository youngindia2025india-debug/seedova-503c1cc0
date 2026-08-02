import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, MessagesSquare, Trash2 } from "lucide-react";
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
  adminDeleteCommunityItem,
  adminListCommunity,
  adminResolveReports,
  type AdminCommunityItem,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/community")({
  component: AdminCommunityPage,
});

function AdminCommunityPage() {
  const queryClient = useQueryClient();
  const listCommunity = useServerFn(adminListCommunity);
  const resolveReports = useServerFn(adminResolveReports);
  const deleteItem = useServerFn(adminDeleteCommunityItem);

  const [tab, setTab] = useState<"reported" | "all">("reported");
  const [pendingDelete, setPendingDelete] = useState<AdminCommunityItem | null>(null);

  const query = useQuery({
    queryKey: ["admin", "community", tab],
    queryFn: () => listCommunity({ data: { onlyReported: tab === "reported" } }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "community"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
  };

  const resolveMutation = useMutation({
    mutationFn: (input: { reportIds: string[]; status: "resolved" | "dismissed" }) =>
      resolveReports({ data: input }),
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "dismissed" ? "Reports dismissed" : "Reports resolved");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (item: AdminCommunityItem) =>
      deleteItem({ data: { id: item.id, kind: item.kind } }),
    onSuccess: () => {
      toast.success("Content removed");
      setPendingDelete(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const items = query.data ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Moderate community"
        description="Review reported questions and answers. Anonymous posters are never identified."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "reported" | "all")} className="mb-3">
        <TabsList>
          <TabsTrigger value="reported">Reported</TabsTrigger>
          <TabsTrigger value="all">All content</TabsTrigger>
        </TabsList>
      </Tabs>

      {query.isError ? (
        <SectionError message="Could not load community content." onRetry={() => void query.refetch()} />
      ) : query.isPending ? (
        <TableSkeleton rows={4} cols={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title={tab === "reported" ? "No reported content" : "No community content yet"}
          description={
            tab === "reported"
              ? "Reports raised by members will appear here."
              : "Questions and answers appear here once members start posting."
          }
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.kind}</Badge>
                    {item.isAnonymous ? <Badge variant="outline">Anonymous</Badge> : null}
                    {item.reportCount > 0 ? (
                      <Badge variant="destructive">{item.reportCount} report(s)</Badge>
                    ) : null}
                  </div>
                  {item.title ? <p className="mt-1.5 text-sm font-medium">{item.title}</p> : null}
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                    {item.body}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {item.reportIds.length > 0 ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={resolveMutation.isPending}
                        onClick={() =>
                          resolveMutation.mutate({
                            reportIds: item.reportIds,
                            status: "dismissed",
                          })
                        }
                        aria-label="Keep content and dismiss reports"
                      >
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Keep
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={resolveMutation.isPending}
                        onClick={() =>
                          resolveMutation.mutate({
                            reportIds: item.reportIds,
                            status: "resolved",
                          })
                        }
                        aria-label="Mark reports resolved"
                      >
                        Resolve
                      </Button>
                    </>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingDelete(item)}
                    aria-label="Remove content"
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
            <AlertDialogTitle>Remove this {pendingDelete?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the content from the community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
