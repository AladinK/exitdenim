ALTER VIEW public.products_public SET (security_invoker = false);
GRANT SELECT ON public.products_public TO anon, authenticated;
GRANT SELECT ON public.stock TO anon, authenticated;