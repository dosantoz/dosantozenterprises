DROP INDEX IF EXISTS public.testimonials_user_id_unique;
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_user_id_key UNIQUE (user_id);