ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check CHECK (status IN ('active','suspended'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE POLICY "profiles admin update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin read" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin insert" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin delete" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "questions moderator delete" ON public.questions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "answers moderator delete" ON public.answers
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));