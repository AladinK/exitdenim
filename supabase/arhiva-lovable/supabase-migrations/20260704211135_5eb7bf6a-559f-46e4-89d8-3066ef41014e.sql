
-- 1. Private schema for internal helpers (not exposed via Data API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Move the SECURITY DEFINER body to private._has_role
CREATE OR REPLACE FUNCTION private._has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private._has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION private._has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3. Rewrite public.has_role as a thin SECURITY INVOKER wrapper.
-- Same signature/OID kept so existing RLS policies keep working.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private
AS $$
  SELECT private._has_role(_user_id, _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 4. Fix SECURITY DEFINER view: make products_public respect querying user's RLS.
ALTER VIEW public.products_public SET (security_invoker = on);
