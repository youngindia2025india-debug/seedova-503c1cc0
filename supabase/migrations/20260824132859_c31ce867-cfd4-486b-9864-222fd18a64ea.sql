-- Public (not signed in) readers must not need the admin role helper.
DROP POLICY IF EXISTS "clinics public read" ON public.clinics;

CREATE POLICY "clinics anon read published"
ON public.clinics FOR SELECT TO anon
USING (is_published = true);

CREATE POLICY "clinics authenticated read"
ON public.clinics FOR SELECT TO authenticated
USING (is_published = true OR public.has_role(auth.uid(), 'admin'::app_role));

-- Signed-in users need EXECUTE so RLS policies that call has_role can run.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;