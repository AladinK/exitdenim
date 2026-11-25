ALTER TABLE public.customer_orders
  ADD COLUMN promo_code text,
  ADD COLUMN promo_pct integer NOT NULL DEFAULT 0,
  ADD COLUMN discount numeric NOT NULL DEFAULT 0;