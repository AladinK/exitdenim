ALTER TABLE public.products ADD COLUMN on_sale boolean NOT NULL DEFAULT false;
UPDATE public.products SET on_sale = true WHERE created_at < '2026-10-01';