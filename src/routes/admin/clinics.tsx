import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { SectionError, TableSkeleton } from "@/components/admin/AdminStates";
import { ClinicFormDialog } from "@/components/admin/ClinicFormDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatCostRange } from "@/components/clinics/data";
import {
  adminDeleteClinic,
  adminListClinics,
  adminSaveClinic,
  type AdminClinic,
  type AdminClinicInput,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/clinics")({
  component: AdminClinicsPage,
});

const PAGE_SIZE = 10;

function AdminClinicsPage() {
  const queryClient = useQueryClient();
  const listClinics = useServerFn(adminListClinics);
  const saveClinic = useServerFn(adminSaveClinic);
  const deleteClinic = useServerFn(adminDeleteClinic);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminClinic | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminClinic | null>(null);

  const query = useQuery({
    queryKey: ["admin", "clinics", search, page],
    queryFn: () => listClinics({ data: { query: search, page, pageSize: PAGE_SIZE } }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] });

  const saveMutation = useMutation({
    mutationFn: (input: AdminClinicInput) => saveClinic({ data: input }),
    onSuccess: () => {
      toast.success(editing ? "Clinic updated" : "Clinic created");
      setFormOpen(false);
      setEditing(null);
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClinic({ data: { id } }),
    onSuccess: () => {
      toast.success("Clinic deleted");
      setPendingDelete(null);
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader
        title="Manage clinics"
        description="Create, edit and remove clinic records."
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            aria-label="Create a new clinic"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New clinic
          </Button>
        }
      />

      <div className="mb-3 max-w-sm">
        <label htmlFor="clinic-search" className="sr-only">
          Search clinics
        </label>
        <Input
          id="clinic-search"
          placeholder="Search by name, city or state"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {query.isError ? (
        <SectionError message="Could not load clinics." onRetry={() => void query.refetch()} />
      ) : query.isPending ? (
        <TableSkeleton rows={6} cols={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={search ? "No clinics match your search" : "No clinics yet"}
          description={
            search
              ? "Try a different name, city or state."
              : "Create a clinic record or use the import tool to add data."
          }
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
            <Table>
              <caption className="sr-only">All clinic records</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">Location</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Rating</TableHead>
                  <TableHead scope="col">Cost</TableHead>
                  <TableHead scope="col">Success</TableHead>
                  <TableHead scope="col" className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((clinic) => (
                  <TableRow key={clinic.id}>
                    <TableCell className="font-medium">{clinic.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {[clinic.city, clinic.state].filter(Boolean).join(", ") || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={clinic.published ? "default" : "secondary"}>
                          {clinic.published ? "Published" : "Draft"}
                        </Badge>
                        {clinic.verified ? <Badge variant="outline">Verified</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {clinic.reviews > 0 ? `${clinic.rating.toFixed(1)} (${clinic.reviews})` : "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatCostRange(clinic.costMin, clinic.costMax)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {clinic.successRate == null ? "—" : `${clinic.successRate}%`}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${clinic.name}`}
                          onClick={() => {
                            setEditing(clinic);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${clinic.name}`}
                          onClick={() => setPendingDelete(clinic)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2 md:hidden">
            {items.map((clinic) => (
              <li key={clinic.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{clinic.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[clinic.city, clinic.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <Badge variant={clinic.published ? "default" : "secondary"}>
                    {clinic.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`Edit ${clinic.name}`}
                    onClick={() => {
                      setEditing(clinic);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`Delete ${clinic.name}`}
                    onClick={() => setPendingDelete(clinic)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {pages} · {total} clinic{total === 1 ? "" : "s"}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <ClinicFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        clinic={editing}
        pending={saveMutation.isPending}
        onSubmit={(input) => saveMutation.mutate(input)}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete clinic?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be permanently removed along with its related records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
