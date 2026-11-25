
-- Trigger functions must not be executable from the API. Triggers run as
-- table owner regardless of EXECUTE grants.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalc_order_totals() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is a SECURITY DEFINER helper used inside RLS policies and by
-- server functions via rpc. It must remain callable by `authenticated` for
-- policies to evaluate, but anon has no legitimate need.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
