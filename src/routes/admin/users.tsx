import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { SectionError, TableSkeleton } from "@/components/admin/AdminStates";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminListUsers,
  adminSetUserRole,
  adminSetUserStatus,
  type AdminUser,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

const PAGE_SIZE = 10;
const ROLES = ["user", "moderator", "admin"] as const;

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const listUsers = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetUserRole);
  const setStatus = useServerFn(adminSetUserStatus);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin", "users", search, page],
    queryFn: () => listUsers({ data: { query: search, page, pageSize: PAGE_SIZE } }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const roleMutation = useMutation({
    mutationFn: (input: { userId: string; role: (typeof ROLES)[number] }) =>
      setRole({ data: input }),
    onSuccess: () => {
      toast.success("Role updated");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { userId: string; status: "active" | "suspended" }) =>
      setStatus({ data: input }),
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "suspended" ? "Member suspended" : "Member reactivated");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const primaryRole = (user: AdminUser) =>
    user.roles.includes("admin")
      ? "admin"
      : user.roles.includes("moderator")
        ? "moderator"
        : "user";

  return (
    <div>
      <AdminPageHeader
        title="User management"
        description="Assign roles and suspend or reactivate members. Suspension is recorded on the member profile; sign-in enforcement needs a backend auth action."
      />

      <div className="mb-3 max-w-sm">
        <label htmlFor="user-search" className="sr-only">
          Search members
        </label>
        <Input
          id="user-search"
          placeholder="Search by display name or city"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {query.isError ? (
        <SectionError message="Could not load members." onRetry={() => void query.refetch()} />
      ) : query.isPending ? (
        <TableSkeleton rows={6} cols={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No members match your search" : "No members yet"}
          description="Members appear here after they sign up."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <Table>
              <caption className="sr-only">Registered members</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Member</TableHead>
                  <TableHead scope="col">City</TableHead>
                  <TableHead scope="col">Joined</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Role</TableHead>
                  <TableHead scope="col" className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.displayName ?? "Unnamed member"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.city ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={primaryRole(user)}
                        onValueChange={(role) =>
                          roleMutation.mutate({
                            userId: user.id,
                            role: role as (typeof ROLES)[number],
                          })
                        }
                      >
                        <SelectTrigger
                          className="h-8 w-[140px]"
                          aria-label={`Role for ${user.displayName ?? "member"}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            userId: user.id,
                            status: user.status === "active" ? "suspended" : "active",
                          })
                        }
                      >
                        {user.status === "active" ? "Suspend" : "Reactivate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {pages} · {total} member{total === 1 ? "" : "s"}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
