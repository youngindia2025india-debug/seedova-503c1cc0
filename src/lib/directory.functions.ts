import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DirectoryClinic = {
  id: string;
  name: string;
  state: string;
  isVerified: boolean;
  artRegistered: boolean;
  artRegistryLink: string | null;
};

export type DirectorySearchResult = {
  items: DirectoryClinic[];
  states: string[];
};

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

type DirectoryRow = {
  id: string;
  name: string;
  state: string;
  is_verified: boolean;
  art_registered: boolean;
  art_registry_link: string | null;
};

function toDirectoryClinic(row: DirectoryRow): DirectoryClinic {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    isVerified: row.is_verified,
    artRegistered: row.art_registered,
    artRegistryLink: row.art_registry_link,
  };
}

const escapeTerm = (value: string) => value.replace(/[,()\\%_*]/g, " ").trim();

export const searchDirectoryClinics = createServerFn({ method: "GET" })
  .inputValidator((input: { query?: string; state?: string }) => ({
    query: String(input?.query ?? ""),
    state: String(input?.state ?? "all"),
  }))
  .handler(async ({ data }): Promise<DirectorySearchResult> => {
    const supabase = publicClient();

    let q = supabase
      .from("clinic_directory")
      .select("id, name, state, is_verified, art_registered, art_registry_link")
      .order("name", { ascending: true });

    const term = escapeTerm(data.query);
    if (term) {
      q = q.or(`name.ilike.%${term}%,state.ilike.%${term}%`);
    }
    if (data.state && data.state !== "all") {
      q = q.eq("state", data.state);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const { data: stateRows, error: stateError } = await supabase
      .from("clinic_directory")
      .select("state");
    if (stateError) throw new Error(stateError.message);

    const states = Array.from(
      new Set((stateRows ?? []).map((r) => r.state).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));

    return {
      items: (rows ?? []).map((row) => toDirectoryClinic(row as DirectoryRow)),
      states,
    };
  });

export const getDirectoryClinic = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => ({ id: String(input?.id ?? "") }))
  .handler(async ({ data }): Promise<DirectoryClinic | null> => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("clinic_directory")
      .select("id, name, state, is_verified, art_registered, art_registry_link")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? toDirectoryClinic(row as DirectoryRow) : null;
  });

/* ------------------------------------------------------------------ */
/* Admin management                                                    */
/* ------------------------------------------------------------------ */

export type DirectoryInput = {
  id?: string;
  name: string;
  state: string;
  isVerified: boolean;
  artRegistered: boolean;
  artRegistryLink: string | null;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminListDirectoryClinics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DirectoryClinic[]> => {
    await assertAdmin(context as any);
    const { data, error } = await (context as any).supabase
      .from("clinic_directory")
      .select("id, name, state, is_verified, art_registered, art_registry_link")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: DirectoryRow) => toDirectoryClinic(row));
  });

export const adminSaveDirectoryClinic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: DirectoryInput) => ({
    id: input.id ? String(input.id) : undefined,
    name: String(input.name ?? "").trim(),
    state: String(input.state ?? "").trim(),
    isVerified: Boolean(input.isVerified),
    artRegistered: Boolean(input.artRegistered),
    artRegistryLink: input.artRegistryLink ? String(input.artRegistryLink).trim() : null,
  }))
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    await assertAdmin(context as any);
    if (!data.name) throw new Error("Clinic name is required");
    if (!data.state) throw new Error("State is required");

    const payload = {
      name: data.name,
      state: data.state,
      is_verified: data.isVerified,
      art_registered: data.artRegistered,
      art_registry_link: data.artRegistryLink,
    };

    const supabase = (context as any).supabase;
    if (data.id) {
      const { error } = await supabase
        .from("clinic_directory")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await supabase
      .from("clinic_directory")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const adminDeleteDirectoryClinic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context as any);
    const { error } = await (context as any).supabase
      .from("clinic_directory")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
