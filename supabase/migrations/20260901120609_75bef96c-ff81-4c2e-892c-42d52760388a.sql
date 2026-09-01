CREATE TABLE public.clinic_directory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  art_registered BOOLEAN NOT NULL DEFAULT false,
  art_registry_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clinic_directory TO anon;
GRANT SELECT ON public.clinic_directory TO authenticated;
GRANT ALL ON public.clinic_directory TO service_role;
ALTER TABLE public.clinic_directory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view clinic directory" ON public.clinic_directory FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage clinic directory" ON public.clinic_directory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX clinic_directory_name_idx ON public.clinic_directory (lower(name));
CREATE INDEX clinic_directory_state_idx ON public.clinic_directory (state);
CREATE TRIGGER set_clinic_directory_updated_at BEFORE UPDATE ON public.clinic_directory FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();