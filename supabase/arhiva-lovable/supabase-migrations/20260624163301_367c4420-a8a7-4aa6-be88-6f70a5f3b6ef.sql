CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_first boolean;
BEGIN
  INSERT INTO public.profiles (id, email, boutique_name, country, city, contact_person, phone, instagram, website, store_type, monthly_qty, categories, message)
  VALUES (
    NEW.id, NEW.email,
    NEW.raw_user_meta_data->>'boutique_name',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'contact_person',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'instagram',
    NEW.raw_user_meta_data->>'website',
    NEW.raw_user_meta_data->>'store_type',
    NEW.raw_user_meta_data->>'monthly_qty',
    COALESCE(string_to_array(NEW.raw_user_meta_data->>'categories', ','), '{}'),
    NEW.raw_user_meta_data->>'message'
  );

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO is_first;
  IF is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET status = 'approved' WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$function$;

-- Backfill: ako još nema admina, prvi postojeći user postaje admin
DO $$
DECLARE
  first_user uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    SELECT id INTO first_user FROM auth.users ORDER BY created_at ASC LIMIT 1;
    IF first_user IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (first_user, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
      UPDATE public.profiles SET status = 'approved' WHERE id = first_user;
    END IF;
  END IF;
END $$;