import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DashboardSavedClinic = {
  id: string;
  name: string;
  city: string;
  state: string | null;
  verified: boolean;
  rating: number;
  reviews: number;
};

export type DashboardJourneyEntry = {
  stage: string;
  title: string;
  eventDate: string | null;
  createdAt: string;
};

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ displayName: string | null }> => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("display_name")
      .eq("id", context.userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return { displayName: data?.display_name ?? null };
  });

export const getMySavedClinics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardSavedClinic[]> => {
    const { data: savedRows, error: savedError } = await context.supabase
      .from("saved_clinics")
      .select("clinic_id, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });

    if (savedError) throw new Error(savedError.message);
    const clinicIds = (savedRows ?? []).map((row) => row.clinic_id);
    if (clinicIds.length === 0) return [];

    const { data: clinicRows, error: clinicError } = await context.supabase
      .from("clinics")
      .select("id, name, city, state, is_verified, rating_avg, review_count")
      .in("id", clinicIds)
      .eq("is_published", true);

    if (clinicError) throw new Error(clinicError.message);

    const byId = new Map(
      (clinicRows ?? []).map((clinic) => [clinic.id, {
        id: clinic.id,
        name: clinic.name,
        city: clinic.city,
        state: clinic.state,
        verified: clinic.is_verified,
        rating: Number(clinic.rating_avg ?? 0),
        reviews: clinic.review_count ?? 0,
      }]),
    );

    return clinicIds.flatMap((id) => {
      const clinic = byId.get(id);
      return clinic ? [clinic] : [];
    });
  });

export const getMyTreatmentJourney = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardJourneyEntry[]> => {
    const { data, error } = await context.supabase
      .from("treatment_journey")
      .select("stage, title, event_date, created_at")
      .eq("user_id", context.userId)
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map((entry) => ({
      stage: entry.stage,
      title: entry.title,
      eventDate: entry.event_date,
      createdAt: entry.created_at,
    }));
  });