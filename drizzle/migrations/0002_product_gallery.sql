ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery text[] NOT NULL DEFAULT '{}';
CREATE OR REPLACE VIEW public.products_public WITH (security_invoker=on) AS
SELECT id, sku, slug, name, category, fit, fabric, weight, color, description, sizes, retail, image_url, moq, delivery, active, sort_order, created_at, updated_at, gallery
FROM public.products WHERE active = true;