import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminDeleteDirectoryClinic,
  adminListDirectoryClinics,
  adminSaveDirectoryClinic,
  type DirectoryClinic,
} from "@/lib/directory.functions";

export const Route = createFileRoute("/admin/directory")({
  head: () => ({
    meta: [
      { title: "Clinic Directory — Seedova Admin" },
      { name: "description", content: "Add and manage clinic directory entries." },
      { property: "og:title", content: "Clinic Directory — Seedova Admin" },
      { property: "og:description", content: "Add and manage clinic directory entries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDirectoryPage,
});

type FormState = {
  id?: string;
  name: string;
  state: string;
  isVerified: boolean;
  artRegistered: boolean;
  artRegistryLink: string;
};

const emptyForm: FormState = {
  name: "",
  state: "",
  isVerified: true,
  artRegistered: true,
  artRegistryLink: "",
};

function AdminDirectoryPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-clinic-directory"],
    queryFn: () => adminListDirectoryClinics(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-clinic-directory"] });
    queryClient.invalidateQueries({ queryKey: ["clinic-directory"] });
  };

  const save = useMutation({
    mutationFn: () =>
      adminSaveDirectoryClinic({
        data: {
          id: form.id,
          name: form.name,
          state: form.state,
          isVerified: form.isVerified,
          artRegistered: form.artRegistered,
          artRegistryLink: form.artRegistryLink.trim() || null,
        },
      }),
    onSuccess: () => {
      toast.success(form.id ? "Clinic updated" : "Clinic added");
      setOpen(false);
      setForm(emptyForm);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteDirectoryClinic({ data: { id } }),
    onSuccess: () => {
      toast.success("Clinic removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const edit = (clinic: DirectoryClinic) => {
    setForm({
      id: clinic.id,
      name: clinic.name,
      state: clinic.state,
      isVerified: clinic.isVerified,
      artRegistered: clinic.artRegistered,
      artRegistryLink: clinic.artRegistryLink ?? "",
    });
    setOpen(true);
  };

  return (
    <>
      <AdminPageHeader
        title="Clinic Directory"
        description="Simple listing shown on the public /clinics page."
        actions={
          <Button
            size="sm"
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add clinic
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No directory entries yet. Use “Add clinic” to create the first one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Verified</th>
                <th className="px-3 py-2 font-medium">ART</th>
                <th className="px-3 py-2 font-medium">Link</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.map((clinic) => (
                <tr key={clinic.id} className="border-t border-border/70">
                  <td className="px-3 py-2 font-medium text-foreground">{clinic.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{clinic.state}</td>
                  <td className="px-3 py-2">{clinic.isVerified ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{clinic.artRegistered ? "Yes" : "No"}</td>
                  <td className="max-w-[220px] truncate px-3 py-2 text-muted-foreground">
                    {clinic.artRegistryLink ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${clinic.name}`}
                        onClick={() => edit(clinic)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${clinic.name}`}
                        onClick={() => remove.mutate(clinic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit clinic" : "Add clinic"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dir-name">Hospital / Clinic name</Label>
              <Input
                id="dir-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ABC IVF & Fertility Centre"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dir-state">State</Label>
              <Input
                id="dir-state"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="Maharashtra"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <Label htmlFor="dir-verified">Verified</Label>
              <Switch
                id="dir-verified"
                checked={form.isVerified}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isVerified: v }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <Label htmlFor="dir-art">ART Registered for IVF</Label>
              <Switch
                id="dir-art"
                checked={form.artRegistered}
                onCheckedChange={(v) => setForm((f) => ({ ...f, artRegistered: v }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dir-link">ART Registry link (optional)</Label>
              <Input
                id="dir-link"
                value={form.artRegistryLink}
                onChange={(e) => setForm((f) => ({ ...f, artRegistryLink: e.target.value }))}
                placeholder="https://…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
