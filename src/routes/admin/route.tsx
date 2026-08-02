import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Seedova" },
      { name: "description", content: "Internal Seedova admin tools." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    // Reuses the existing Supabase session; adds an admin role check on top of
    // the regular auth flow. Roles live in the public.user_roles table and are
    // evaluated by the has_role() security-definer function.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { mode: "signin" } });
    }
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw redirect({ to: "/dashboard" });
    }
    return { user: data.user };
  },
  component: AdminLayout,
});
