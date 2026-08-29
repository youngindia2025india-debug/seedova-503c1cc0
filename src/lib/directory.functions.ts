import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

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
