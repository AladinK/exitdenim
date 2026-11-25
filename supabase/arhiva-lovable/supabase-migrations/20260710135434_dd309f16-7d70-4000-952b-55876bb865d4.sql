
DROP POLICY IF EXISTS "Anyone reads stock" ON public.stock;

CREATE POLICY "Authenticated reads stock"
  ON public.stock FOR SELECT
  TO authenticated
  USING (true);

REVOKE SELECT ON public.stock FROM anon;

CREATE OR REPLACE FUNCTION public.get_stock_availability()
RETURNS TABLE(product_id uuid, size text, in_stock boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.product_id, s.size, (s.quantity > 0)
  FROM public.stock s
  JOIN public.products p ON p.id = s.product_id
  WHERE p.active = true;
$$;

GRANT EXECUTE ON FUNCTION public.get_stock_availability() TO anon, authenticated;
