GRANT SELECT ON public.products TO anon;
CREATE POLICY "Public reads active products" ON public.products FOR SELECT TO anon USING (active = true);