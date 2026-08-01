import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  DEFAULT_FILTERS,
  EMPTY_FACETS,
  PAGE_SIZE,
  type Clinic,
  type ClinicFacets,
  type ClinicFilterState,
  type ClinicSearchResult,
  type SortKey,
} from "@/components/clinics/data";

type ClinicRow = Database["public"]["Tables"]["clinics"]["Row"];

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
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

const SELECT_COLUMNS =
  "id, slug, name, description, city, state, logo_url, cover_image_url, is_verified, rating_avg, review_count, cost_min, cost_max, success_rate, treatments, facilities, highlights, established_year";

const num = (value: number | string | null): number | null =>
  value == null ? null : typeof value === "number" ? value : Number(value);

function toClinic(row: Partial<ClinicRow>): Clinic {
  return {
    id: String(row.id),
    slug: row.slug ?? String(row.id),
    name: row.name ?? "",
    description: row.description ?? null,
    city: row.city ?? "",
    state: row.state ?? null,
    logoUrl: row.logo_url ?? null,
    coverImageUrl: row.cover_image_url ?? null,
    verified: Boolean(row.is_verified),
    rating: num(row.rating_avg ?? null) ?? 0,
    reviews: row.review_count ?? 0,
    costMin: num(row.cost_min ?? null),
    costMax: num(row.cost_max ?? null),
    successRate: num(row.success_rate ?? null),
    treatments: row.treatments ?? [],
    facilities: row.facilities ?? [],
    highlights: row.highlights ?? [],
    establishedYear: row.established_year ?? null,
  };
}

const escapeOr = (value: string) => value.replace(/[,()]/g, " ").trim();

export type SearchClinicsInput = {
  query?: string;
  filters?: Partial<ClinicFilterState>;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
};

export const searchClinics = createServerFn({ method: "GET" })
  .inputValidator((input: SearchClinicsInput) => input ?? {})
  .handler(async ({ data }): Promise<ClinicSearchResult> => {
    const filters: ClinicFilterState = { ...DEFAULT_FILTERS, ...(data.filters ?? {}) };
    const sort: SortKey = data.sort ?? "rating";
    const page = Math.max(1, data.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, data.pageSize ?? PAGE_SIZE));
    const supabase = publicClient();

    let q = supabase
      .from("clinics")
      .select(SELECT_COLUMNS, { count: "exact" })
      .eq("is_published", true);

    const term = escapeOr((data.query ?? "").trim());
    if (term) {
      q = q.or(
        `name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%,treatments.cs.{${term}}`,
      );
    }
    if (filters.state !== "all") q = q.eq("state", filters.state);
    if (filters.city !== "all") q = q.eq("city", filters.city);
    if (filters.treatments.length) q = q.contains("treatments", filters.treatments);
    if (filters.facilities.length) q = q.contains("facilities", filters.facilities);
    if (filters.minSuccess > 0) q = q.gte("success_rate", filters.minSuccess);
    if (filters.minRating > 0) q = q.gte("rating_avg", filters.minRating);
    if (filters.maxCost < DEFAULT_FILTERS.maxCost) q = q.lte("cost_min", filters.maxCost);

    switch (sort) {
      case "cost":
        q = q.order("cost_min", { ascending: true, nullsFirst: false });
        break;
      case "success":
        q = q.order("success_rate", { ascending: false, nullsFirst: false });
        break;
      case "newest":
        q = q.order("created_at", { ascending: false });
        break;
      case "reviews":
        q = q.order("review_count", { ascending: false });
        break;
      default:
        q = q.order("rating_avg", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    const { data: rows, count, error } = await q.range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);

    return {
      items: (rows ?? []).map((row) => toClinic(row as Partial<ClinicRow>)),
      total: count ?? 0,
      page,
      pageSize,
    };
  });

export const getClinicFacets = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClinicFacets> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("clinics")
      .select("city, state, treatments, facilities")
      .eq("is_published", true);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return EMPTY_FACETS;

    const states = new Set<string>();
    const cities = new Set<string>();
    const treatments = new Set<string>();
    const facilities = new Set<string>();
    const citiesByState: Record<string, Set<string>> = {};

    for (const row of data) {
      if (row.city) cities.add(row.city);
      if (row.state) {
        states.add(row.state);
        citiesByState[row.state] ??= new Set<string>();
        if (row.city) citiesByState[row.state]!.add(row.city);
      }
      for (const t of row.treatments ?? []) if (t) treatments.add(t);
      for (const f of row.facilities ?? []) if (f) facilities.add(f);
    }

    const sorted = (set: Set<string>) => Array.from(set).sort((a, b) => a.localeCompare(b));

    return {
      states: sorted(states),
      cities: sorted(cities),
      treatments: sorted(treatments),
      facilities: sorted(facilities),
      citiesByState: Object.fromEntries(
        Object.entries(citiesByState).map(([k, v]) => [k, sorted(v)]),
      ),
    };
  },
);

export const getSearchSuggestions = createServerFn({ method: "GET" })
  .inputValidator((input: { query: string }) => ({ query: String(input?.query ?? "") }))
  .handler(async ({ data }): Promise<string[]> => {
    const term = escapeOr(data.query.trim());
    if (term.length < 2) return [];
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("clinics")
      .select("name, city, state")
      .eq("is_published", true)
      .or(`name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`)
      .limit(10);
    if (error) throw new Error(error.message);

    const lower = term.toLowerCase();
    const out = new Set<string>();
    for (const row of rows ?? []) {
      for (const value of [row.name, row.city, row.state]) {
        if (value && value.toLowerCase().includes(lower)) out.add(value);
      }
    }
    return Array.from(out).slice(0, 6);
  });

export const listSavedClinicIds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const { data, error } = await context.supabase
      .from("saved_clinics")
      .select("clinic_id")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => row.clinic_id);
  });

export const toggleSavedClinic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { clinicId: string }) => ({ clinicId: String(input.clinicId) }))
  .handler(async ({ data, context }): Promise<{ saved: boolean }> => {
    const { data: existing, error: readError } = await context.supabase
      .from("saved_clinics")
      .select("id")
      .eq("user_id", context.userId)
      .eq("clinic_id", data.clinicId)
      .maybeSingle();
    if (readError) throw new Error(readError.message);

    if (existing) {
      const { error } = await context.supabase
        .from("saved_clinics")
        .delete()
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { saved: false };
    }

    const { error } = await context.supabase
      .from("saved_clinics")
      .insert({ user_id: context.userId, clinic_id: data.clinicId });
    if (error) throw new Error(error.message);
    return { saved: true };
  });
