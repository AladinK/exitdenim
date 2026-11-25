
-- Enum for retail order status
DO $$ BEGIN
  CREATE TYPE public.customer_order_status AS ENUM ('pending','confirmed','shipped','delivered','cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Customer orders (retail / COD)
CREATE TABLE public.customer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE DEFAULT (('EXR-' || to_char(now(),'YYMMDD') || '-') || lpad((floor(random()*10000))::text,4,'0')),
  user_id UUID NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_postal TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'Србија',
  shipping_method TEXT NOT NULL DEFAULT 'courier',
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  status public.customer_order_status NOT NULL DEFAULT 'pending',
  note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_orders TO authenticated;
GRANT INSERT ON public.customer_orders TO anon;
GRANT ALL ON public.customer_orders TO service_role;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;

-- Guests (anon) can create orders (user_id must be NULL)
CREATE POLICY "Anyone can create guest order"
  ON public.customer_orders FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- Authenticated users can create their own order (or as guest with NULL)
CREATE POLICY "Authenticated can create own order"
  ON public.customer_orders FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Authenticated users can view their own orders
CREATE POLICY "Users view own orders"
  ON public.customer_orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admins full access
CREATE POLICY "Admins manage all customer orders"
  ON public.customer_orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE TRIGGER customer_orders_touch_updated
  BEFORE UPDATE ON public.customer_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- Customer order items
CREATE TABLE public.customer_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_order_items TO authenticated;
GRANT INSERT ON public.customer_order_items TO anon;
GRANT ALL ON public.customer_order_items TO service_role;
ALTER TABLE public.customer_order_items ENABLE ROW LEVEL SECURITY;

-- Guests can insert items only for guest orders (user_id NULL on the parent)
CREATE POLICY "Guests insert items for guest order"
  ON public.customer_order_items FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM public.customer_orders o WHERE o.id = order_id AND o.user_id IS NULL));

-- Authenticated users can insert items for their own order (or guest one)
CREATE POLICY "Auth insert items for own order"
  ON public.customer_order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.customer_orders o WHERE o.id = order_id AND (o.user_id IS NULL OR o.user_id = auth.uid())));

-- Users read items of their own orders
CREATE POLICY "Users read items of own orders"
  ON public.customer_order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.customer_orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- Admins full
CREATE POLICY "Admins manage all customer order items"
  ON public.customer_order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX customer_order_items_order_id_idx ON public.customer_order_items(order_id);
CREATE INDEX customer_orders_user_id_idx ON public.customer_orders(user_id);
CREATE INDEX customer_orders_created_at_idx ON public.customer_orders(created_at DESC);
