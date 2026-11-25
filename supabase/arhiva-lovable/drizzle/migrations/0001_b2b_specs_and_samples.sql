ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS fabric_oz numeric,
  ADD COLUMN IF NOT EXISTS composition text,
  ADD COLUMN IF NOT EXISTS wash_finish text,
  ADD COLUMN IF NOT EXISTS pack_distribution jsonb;

CREATE TABLE public.sample_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sample_requests TO authenticated;
GRANT ALL ON public.sample_requests TO service_role;
ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved partners create own sample requests" ON public.sample_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.status = 'approved'));
CREATE POLICY "Users read own sample requests" ON public.sample_requests
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sample requests" ON public.sample_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));