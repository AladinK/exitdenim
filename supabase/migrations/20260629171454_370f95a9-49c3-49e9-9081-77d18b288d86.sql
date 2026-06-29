
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Anyone reads active products" ON public.products;

CREATE POLICY "Authenticated reads active products"
ON public.products
FOR SELECT
TO authenticated
USING (active = true OR has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT ON public.products FROM anon;

CREATE OR REPLACE VIEW public.products_public
WITH (security_invoker = true)
AS
SELECT
  id, sku, slug, name, category, fit, fabric, weight, color,
  description, sizes, retail, image_url,
  moq, delivery, active, sort_order, created_at, updated_at
FROM public.products
WHERE active = true;

GRANT SELECT ON public.products_public TO anon, authenticated;
