-- Revoke public/anon/authenticated EXECUTE on SECURITY DEFINER trigger functions.
-- These are only invoked by triggers (which run as table owner) and must never
-- be callable via the Data API.
REVOKE EXECUTE ON FUNCTION public.recalc_order_totals() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is SECURITY DEFINER because it is used inside RLS policies and must
-- read user_roles regardless of the caller's row visibility. Restrict direct
-- API execution to signed-in users only (anon has no legitimate reason to call it).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- get_stock_availability intentionally exposes only a boolean per (product, size)
-- to the public, bypassing RLS on the private stock table. Keep it callable but
-- lock down the grant surface explicitly.
REVOKE EXECUTE ON FUNCTION public.get_stock_availability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_stock_availability() TO anon, authenticated;
