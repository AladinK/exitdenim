-- Switch has_role to SECURITY INVOKER. authenticated already has SELECT on
-- user_roles (RLS scopes each user to their own rows), which is all the
-- policies that call has_role(auth.uid(), ...) need.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

-- Replace the SECURITY DEFINER stock availability function with a view that
-- exposes only boolean availability. RLS on stock is bypassed via a view
-- owned by postgres, but only safe boolean columns are projected.
DROP FUNCTION IF EXISTS public.get_stock_availability();

CREATE OR REPLACE VIEW public.stock_availability
WITH (security_invoker = false) AS
SELECT s.product_id, s.size, (s.quantity > 0) AS in_stock
FROM public.stock s
JOIN public.products p ON p.id = s.product_id
WHERE p.active = true;

GRANT SELECT ON public.stock_availability TO anon, authenticated;
