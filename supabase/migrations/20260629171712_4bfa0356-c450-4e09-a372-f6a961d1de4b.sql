
CREATE TABLE public.site_assets (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

GRANT SELECT ON public.site_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_assets TO authenticated;
GRANT ALL ON public.site_assets TO service_role;

ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_assets readable by everyone"
  ON public.site_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_assets admins insert"
  ON public.site_assets FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_assets admins update"
  ON public.site_assets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_assets admins delete"
  ON public.site_assets FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for the public site-assets bucket: anyone can read, admins write.
CREATE POLICY "site-assets public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "site-assets admins insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-assets admins update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-assets admins delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
