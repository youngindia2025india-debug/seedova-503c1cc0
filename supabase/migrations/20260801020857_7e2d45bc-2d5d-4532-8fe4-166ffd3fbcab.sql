ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS success_rate numeric,
  ADD COLUMN IF NOT EXISTS cost_min numeric,
  ADD COLUMN IF NOT EXISTS cost_max numeric,
  ADD COLUMN IF NOT EXISTS treatments text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS facilities text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS clinics_city_idx ON public.clinics (city);
CREATE INDEX IF NOT EXISTS clinics_state_idx ON public.clinics (state);
CREATE INDEX IF NOT EXISTS clinics_name_idx ON public.clinics (name);
CREATE INDEX IF NOT EXISTS clinics_treatments_idx ON public.clinics USING gin (treatments);
CREATE INDEX IF NOT EXISTS clinics_facilities_idx ON public.clinics USING gin (facilities);