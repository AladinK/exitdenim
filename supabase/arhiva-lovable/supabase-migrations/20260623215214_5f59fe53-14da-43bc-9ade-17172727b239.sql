
-- 1) Restrict orders UPDATE for non-admin users to draft only
DROP POLICY IF EXISTS "Users update own draft" ON public.orders;
CREATE POLICY "Users update own draft" ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft'::order_status)
  WITH CHECK (auth.uid() = user_id AND status = 'draft'::order_status);

-- 2) Add explicit admin-only INSERT/DELETE policies on user_roles to prevent privilege escalation
CREATE POLICY "Admins insert roles" ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles" ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles" ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Revoke EXECUTE on SECURITY DEFINER trigger functions from public/authenticated/anon
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_order_totals() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
