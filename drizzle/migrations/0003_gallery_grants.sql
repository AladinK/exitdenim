GRANT SELECT (gallery) ON public.products TO anon, authenticated;
GRANT INSERT (gallery), UPDATE (gallery) ON public.products TO authenticated;
GRANT SELECT ON public.products_public TO anon, authenticated;