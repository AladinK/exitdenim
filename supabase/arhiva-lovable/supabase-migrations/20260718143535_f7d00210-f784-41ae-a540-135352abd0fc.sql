-- 1. Column-level lockdown: wholesale prices are business-sensitive and must
--    never be readable through the Data API by anon or arbitrary authenticated
--    users. Admin/partner-approved server flows use the service role.
REVOKE SELECT (wholesale) ON public.products FROM anon;
REVOKE SELECT (wholesale) ON public.products FROM authenticated;

-- 2. Stock: exact quantities are reserved for approved partners and admins.
--    The public `get_stock_availability()` RPC continues to expose booleans.
DROP POLICY IF EXISTS "Authenticated reads stock" ON public.stock;

CREATE POLICY "Approved partners and admins read stock"
  ON public.stock
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  );