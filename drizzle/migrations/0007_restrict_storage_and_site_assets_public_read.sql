-- Remove unbound public read on storage objects; signed URLs are now minted server-side.
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "site-assets public read" ON storage.objects;

-- Admins keep read access for the admin panel's client-side signing.
CREATE POLICY "Admins read product images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read site assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- site_assets: public read replaced by admin-only read; the public homepage
-- reads it through a server function with the privileged client.
DROP POLICY IF EXISTS "site_assets readable by everyone" ON public.site_assets;

CREATE POLICY "site_assets admins read"
  ON public.site_assets FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));