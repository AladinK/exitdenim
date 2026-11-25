-- Revert anon access to the raw stock table (would leak exact quantities).
REVOKE SELECT ON public.stock FROM anon;
DROP POLICY IF EXISTS "Anyone can read stock for availability" ON public.stock;

-- Restore SECURITY DEFINER so anon callers get only the boolean projection
-- without needing SELECT on stock. This function is intentionally executable
-- by anon/authenticated: it returns no sensitive data (only availability booleans).
CREATE OR REPLACE FUNCTION public.get_stock_availability()
RETURNS TABLE(product_id uuid, size text, in_stock boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT s.product_id, s.size, (s.quantity > 0)
  FROM public.stock s
  JOIN public.products p ON p.id = s.product_id
  WHERE p.active = true;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_stock_availability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_stock_availability() TO anon, authenticated;
