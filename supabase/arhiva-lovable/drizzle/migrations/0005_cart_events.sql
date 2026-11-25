CREATE TABLE public.cart_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  product_id uuid,
  product_name text,
  size text,
  price numeric,
  value numeric,
  device text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.cart_events TO anon, authenticated;
GRANT SELECT ON public.cart_events TO authenticated;
GRANT ALL ON public.cart_events TO service_role;
ALTER TABLE public.cart_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone logs cart events" ON public.cart_events FOR INSERT TO anon, authenticated
  WITH CHECK (event IN ('add_to_cart','begin_checkout'));
CREATE POLICY "Admins read cart events" ON public.cart_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX cart_events_created_idx ON public.cart_events (created_at DESC);