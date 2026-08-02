import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { Clinic } from "@/components/clinics/data";

type SupabaseCtx = { supabase: any; userId: string };

type AppRole = Database["public"]["Enums"]["app_role"];
type ReviewStatus = Database["public"]["Enums"]["review_status"];
type ReportStatus = Database["public"]["Enums"]["report_status"];

async function assertAdmin(context: SupabaseCtx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
  return context;
}

const num = (v: number | string | null | undefined): number | null =>
  v == null || v === "" ? null : typeof v === "number" ? v : Number(v);

/* ------------------------------------------------------------------ */
/* Access                                                              */
/* ------------------------------------------------------------------ */

export const getAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

/* ------------------------------------------------------------------ */
/* Clinics                                                             */
/* ------------------------------------------------------------------ */

const CLINIC_COLUMNS =
  "id, slug, name, description, city, state, logo_url, cover_image_url, is_verified, is_published, rating_avg, review_count, cost_min, cost_max, success_rate, treatments, facilities, highlights, established_year";

export type AdminClinic = Clinic & { published: boolean };

function toAdminClinic(row: any): AdminClinic {
  return {
    id: String(row.id),
    slug: row.slug ?? "",
    name: row.name ?? "",
    description: row.description ?? null,
    city: row.city ?? "",
    state: row.state ?? null,
    logoUrl: row.logo_url ?? null,
    coverImageUrl: row.cover_image_url ?? null,
    verified: Boolean(row.is_verified),
    published: Boolean(row.is_published),
    rating: num(row.rating_avg) ?? 0,
    reviews: row.review_count ?? 0,
    costMin: num(row.cost_min),
    costMax: num(row.cost_max),
    successRate: num(row.success_rate),
    treatments: row.treatments ?? [],
    facilities: row.facilities ?? [],
    highlights: row.highlights ?? [],
    establishedYear: row.established_year ?? null,
  };
}

export type AdminClinicInput = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  city: string;
  state?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  verified: boolean;
  published: boolean;
  costMin?: number | null;
  costMax?: number | null;
  successRate?: number | null;
  treatments: string[];
  facilities: string[];
  highlights: string[];
  establishedYear?: number | null;
};

export const adminListClinics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { query?: string; page?: number; pageSize?: number }) => input ?? {})
  .handler(
    async ({
      data,
      context,
    }): Promise<{ items: AdminClinic[]; total: number; page: number; pageSize: number }> => {
      await assertAdmin(context);
      const page = Math.max(1, data.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, data.pageSize ?? 10));
      let q = context.supabase
        .from("clinics")
        .select(CLINIC_COLUMNS, { count: "exact" })
        .order("created_at", { ascending: false });

      const term = (data.query ?? "").replace(/[,()]/g, " ").trim();
      if (term) q = q.or(`name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`);

      const from = (page - 1) * pageSize;
      const { data: rows, count, error } = await q.range(from, from + pageSize - 1);
      if (error) throw new Error(error.message);
      return {
        items: (rows ?? []).map(toAdminClinic),
        total: count ?? 0,
        page,
        pageSize,
      };
    },
  );

export const adminSaveClinic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: AdminClinicInput) => input)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    await assertAdmin(context);
    const payload = {
      slug: data.slug.trim(),
      name: data.name.trim(),
      description: data.description ?? null,
      city: data.city.trim(),
      state: data.state ?? null,
      logo_url: data.logoUrl ?? null,
      cover_image_url: data.coverImageUrl ?? null,
      is_verified: data.verified,
      is_published: data.published,
      cost_min: data.costMin ?? null,
      cost_max: data.costMax ?? null,
      success_rate: data.successRate ?? null,
      treatments: data.treatments,
      facilities: data.facilities,
      highlights: data.highlights,
      established_year: data.establishedYear ?? null,
    };

    if (data.id) {
      const { error } = await context.supabase.from("clinics").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await context.supabase
      .from("clinics")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: String(row.id) };
  });

export const adminDeleteClinic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("clinics").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * TODO(backend): Bulk clinic import is not wired to a real ingestion pipeline yet.
 * This placeholder validates the caller is an admin and echoes back the row count so
 * the mapping/preview UI can be exercised end to end. Replace with a batched,
 * transactional upsert (plus per-row error reporting) when the import backend lands.
 */
export const adminImportClinics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { rows: AdminClinicInput[] }) => ({ rows: input?.rows ?? [] }))
  .handler(
    async ({ data, context }): Promise<{ imported: number; pending: true; message: string }> => {
      await assertAdmin(context);
      return {
        imported: 0,
        pending: true,
        message: `Validated ${data.rows.length} row(s). Backend import pipeline is not connected yet.`,
      };
    },
  );

/* ------------------------------------------------------------------ */
/* Reviews moderation                                                  */
/* ------------------------------------------------------------------ */

export type AdminReview = {
  id: string;
  clinicId: string;
  clinicName: string | null;
  rating: number;
  title: string | null;
  body: string;
  isAnonymous: boolean;
  status: ReviewStatus;
  createdAt: string;
  reportCount: number;
};

export const adminListReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: ReviewStatus | "all" }) => input ?? {})
  .handler(async ({ data, context }): Promise<AdminReview[]> => {
    await assertAdmin(context);
    let q = context.supabase
      .from("reviews")
      .select("id, clinic_id, rating, title, body, is_anonymous, status, created_at, clinics(name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status && data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (rows ?? []).map((r: any) => r.id);
    const counts = new Map<string, number>();
    if (ids.length) {
      const { data: reports } = await context.supabase
        .from("reports")
        .select("target_id")
        .eq("target_type", "review")
        .in("target_id", ids);
      for (const r of reports ?? [])
        counts.set(r.target_id, (counts.get(r.target_id) ?? 0) + 1);
    }

    return (rows ?? []).map((r: any) => ({
      id: String(r.id),
      clinicId: String(r.clinic_id),
      clinicName: r.clinics?.name ?? null,
      rating: r.rating,
      title: r.title ?? null,
      body: r.body,
      isAnonymous: Boolean(r.is_anonymous),
      status: r.status,
      createdAt: r.created_at,
      reportCount: counts.get(r.id) ?? 0,
    }));
  });

export const adminSetReviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: ReviewStatus }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("reviews")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Community moderation                                                */
/* ------------------------------------------------------------------ */

export type AdminCommunityItem = {
  id: string;
  kind: "question" | "answer";
  title: string | null;
  body: string;
  isAnonymous: boolean;
  createdAt: string;
  reportCount: number;
  reportIds: string[];
};

export const adminListCommunity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { onlyReported?: boolean }) => input ?? {})
  .handler(async ({ data, context }): Promise<AdminCommunityItem[]> => {
    await assertAdmin(context);

    const { data: reports, error: reportError } = await context.supabase
      .from("reports")
      .select("id, target_id, target_type, status")
      .in("target_type", ["question", "answer"])
      .eq("status", "open");
    if (reportError) throw new Error(reportError.message);

    const reportMap = new Map<string, string[]>();
    for (const r of reports ?? []) {
      reportMap.set(r.target_id, [...(reportMap.get(r.target_id) ?? []), r.id]);
    }

    const onlyReported = Boolean(data.onlyReported);
    const reportedIds = Array.from(reportMap.keys());
    if (onlyReported && reportedIds.length === 0) return [];

    let questionQuery = context.supabase
      .from("questions")
      .select("id, title, body, is_anonymous, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    let answerQuery = context.supabase
      .from("answers")
      .select("id, body, is_anonymous, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (onlyReported) {
      questionQuery = questionQuery.in("id", reportedIds);
      answerQuery = answerQuery.in("id", reportedIds);
    }

    const [{ data: questions, error: qError }, { data: answers, error: aError }] =
      await Promise.all([questionQuery, answerQuery]);
    if (qError) throw new Error(qError.message);
    if (aError) throw new Error(aError.message);

    const items: AdminCommunityItem[] = [
      ...(questions ?? []).map((q: any) => ({
        id: String(q.id),
        kind: "question" as const,
        title: q.title ?? null,
        body: q.body,
        isAnonymous: Boolean(q.is_anonymous),
        createdAt: q.created_at,
        reportCount: reportMap.get(q.id)?.length ?? 0,
        reportIds: reportMap.get(q.id) ?? [],
      })),
      ...(answers ?? []).map((a: any) => ({
        id: String(a.id),
        kind: "answer" as const,
        title: null,
        body: a.body,
        isAnonymous: Boolean(a.is_anonymous),
        createdAt: a.created_at,
        reportCount: reportMap.get(a.id)?.length ?? 0,
        reportIds: reportMap.get(a.id) ?? [],
      })),
    ];

    return items.sort((a, b) =>
      b.reportCount - a.reportCount || b.createdAt.localeCompare(a.createdAt),
    );
  });

export const adminResolveReports = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { reportIds: string[]; status: ReportStatus }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (!data.reportIds.length) return { ok: true };
    const { error } = await context.supabase
      .from("reports")
      .update({ status: data.status })
      .in("id", data.reportIds);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteCommunityItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; kind: "question" | "answer" }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const table = data.kind === "question" ? "questions" : "answers";
    const { error } = await context.supabase.from(table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export type AdminAnalytics = {
  clinics: number;
  publishedClinics: number;
  users: number;
  reviews: number;
  pendingReviews: number;
  questions: number;
  answers: number;
  openReports: number;
  savedClinics: number;
  reviewsByMonth: { month: string; count: number }[];
};

export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAnalytics> => {
    await assertAdmin(context);
    const db = context.supabase as any;
    const count = async (table: string, apply?: (q: any) => any) => {
      let q = db.from(table).select("id", { count: "exact", head: true });
      if (apply) q = apply(q);
      const { count: c, error } = await q;
      if (error) throw new Error(error.message);
      return c ?? 0;
    };

    const [
      clinics,
      publishedClinics,
      users,
      reviews,
      pendingReviews,
      questions,
      answers,
      openReports,
      savedClinics,
    ] = await Promise.all([
      count("clinics"),
      count("clinics", (q) => q.eq("is_published", true)),
      count("profiles"),
      count("reviews"),
      count("reviews", (q) => q.eq("status", "pending")),
      count("questions"),
      count("answers"),
      count("reports", (q) => q.eq("status", "open")),
      count("saved_clinics"),
    ]);

    const { data: reviewRows, error } = await context.supabase
      .from("reviews")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(2000);
    if (error) throw new Error(error.message);

    const byMonth = new Map<string, number>();
    for (const row of reviewRows ?? []) {
      const month = String(row.created_at).slice(0, 7);
      byMonth.set(month, (byMonth.get(month) ?? 0) + 1);
    }

    return {
      clinics,
      publishedClinics,
      users,
      reviews,
      pendingReviews,
      questions,
      answers,
      openReports,
      savedClinics,
      reviewsByMonth: Array.from(byMonth.entries()).map(([month, c]) => ({ month, count: c })),
    };
  });

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export type AdminUser = {
  id: string;
  displayName: string | null;
  city: string | null;
  status: "active" | "suspended";
  roles: AppRole[];
  createdAt: string;
};

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { query?: string; page?: number; pageSize?: number }) => input ?? {})
  .handler(
    async ({
      data,
      context,
    }): Promise<{ items: AdminUser[]; total: number; page: number; pageSize: number }> => {
      await assertAdmin(context);
      const page = Math.max(1, data.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, data.pageSize ?? 10));
      let q = context.supabase
        .from("profiles")
        .select("id, display_name, city, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false });

      const term = (data.query ?? "").replace(/[,()]/g, " ").trim();
      if (term) q = q.or(`display_name.ilike.%${term}%,city.ilike.%${term}%`);

      const from = (page - 1) * pageSize;
      const { data: rows, count, error } = await q.range(from, from + pageSize - 1);
      if (error) throw new Error(error.message);

      const ids = (rows ?? []).map((r: any) => r.id);
      const roleMap = new Map<string, AppRole[]>();
      if (ids.length) {
        const { data: roles, error: roleError } = await context.supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", ids);
        if (roleError) throw new Error(roleError.message);
        for (const r of roles ?? [])
          roleMap.set(r.user_id, [...(roleMap.get(r.user_id) ?? []), r.role]);
      }

      return {
        items: (rows ?? []).map((r: any) => ({
          id: String(r.id),
          displayName: r.display_name ?? null,
          city: r.city ?? null,
          status: (r.status ?? "active") as "active" | "suspended",
          roles: roleMap.get(r.id) ?? [],
          createdAt: r.created_at,
        })),
        total: count ?? 0,
        page,
        pageSize,
      };
    },
  );

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: AppRole }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error: delError } = await context.supabase
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId);
    if (delError) throw new Error(delError.message);
    const { error } = await context.supabase
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Suspension is recorded on the member's profile. TODO(backend): enforcement
 * (blocking sign-in / revoking sessions) requires an Auth Admin action and is
 * not part of the profile flag alone.
 */
export const adminSetUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; status: "active" | "suspended" }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("profiles")
      .update({ status: data.status })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
