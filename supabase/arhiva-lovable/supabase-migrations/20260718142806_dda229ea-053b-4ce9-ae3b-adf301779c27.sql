-- Recreate the view with security_invoker=true. Stock table has RLS; we need
-- an anon-readable path, so we grant SELECT on the underlying columns needed
-- via a policy on stock scoped to the boolean projection is not feasible.
-- Instead: use a SECURITY INVOKER function returning only the boolean.
DROP VIEW IF EXISTS public.stock_availability;

CREATE OR REPLACE FUNCTION public.get_stock_availability()
RETURNS TABLE(product_id uuid, size text, in_stock boolean)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT s.product_id, s.size, (s.quantity > 0)
  FROM public.stock s
  JOIN public.products p ON p.id = s.product_id
  WHERE p.active = true;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_stock_availability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_stock_availability() TO anon, authenticated;

-- For SECURITY INVOKER to work for anon, add a narrow anon SELECT policy on stock
-- that only exposes rows for active products. The function returns only boolean,
-- but the underlying SELECT needs to succeed for the caller.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='stock' AND policyname='Anyone can read stock for availability'
  ) THEN
    CREATE POLICY "Anyone can read stock for availability"
    ON public.stock FOR SELECT
    TO anon, authenticated
    USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = stock.product_id AND p.active = true));
  END IF;
END $$;

GRANT SELECT ON public.stock TO anon;
