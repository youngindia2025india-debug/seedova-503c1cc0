import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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

export type LandingClinic = {
  id: string;
  name: string;
  location: string;
  costLabel: string;
  successLabel: string;
  rating: number;
  reviews: number;
  description: string | null;
};

export type LandingStory = {
  id: string;
  handle: string;
  context: string;
  rating: number;
  text: string;
};

export type LandingQuestion = {
  id: string;
  title: string;
  tag: string;
  answers: number;
  createdAt: string;
};

export type LandingOverview = {
  stats: { clinics: number; reviews: number; members: number; cities: number };
  clinics: LandingClinic[];
  stories: LandingStory[];
  questions: LandingQuestion[];
};

const formatCost = (min: number | null, max: number | null) => {
  const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`;
  if (min == null && max == null) return "Not published";
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
};

export const getLandingOverview = createServerFn({ method: "GET" }).handler(
  async (): Promise<LandingOverview> => {
    const supabase = publicClient();

    const [clinicRows, reviewCount, memberCount, cityRows, storyRows, questionRows] =
      await Promise.all([
        supabase
          .from("clinics")
          .select(
            "id, name, city, state, description, rating_avg, review_count, cost_min, cost_max, success_rate",
            { count: "exact" },
          )
          .eq("is_published", true)
          .order("rating_avg", { ascending: false })
          .limit(3),
        supabase
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("clinics").select("city").eq("is_published", true),
        supabase
          .from("reviews")
          .select("id, rating, title, body, created_at, clinics(city, state)")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("questions")
          .select("id, title, tags, answer_count, created_at")
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

    const cities = new Set((cityRows.data ?? []).map((r) => r.city).filter(Boolean));

    return {
      stats: {
        clinics: clinicRows.count ?? 0,
        reviews: reviewCount.count ?? 0,
        members: memberCount.count ?? 0,
        cities: cities.size,
      },
      clinics: (clinicRows.data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        location: [c.city, c.state].filter(Boolean).join(", "),
        costLabel: formatCost(
          c.cost_min == null ? null : Number(c.cost_min),
          c.cost_max == null ? null : Number(c.cost_max),
        ),
        successLabel: c.success_rate == null ? "Not published" : `${Number(c.success_rate)}%`,
        rating: Number(c.rating_avg ?? 0),
        reviews: c.review_count ?? 0,
        description: c.description,
      })),
      stories: (storyRows.data ?? []).map((r) => {
        const clinic = r.clinics as { city: string | null; state: string | null } | null;
        return {
          id: r.id,
          handle: "Anonymous",
          context: [r.title, clinic?.city].filter(Boolean).join(" · "),
          rating: r.rating,
          text: r.body,
        };
      }),
      questions: (questionRows.data ?? []).map((q) => ({
        id: q.id,
        title: q.title,
        tag: q.tags?.[0] ?? "Community",
        answers: q.answer_count ?? 0,
        createdAt: q.created_at,
      })),
    };
  },
);
