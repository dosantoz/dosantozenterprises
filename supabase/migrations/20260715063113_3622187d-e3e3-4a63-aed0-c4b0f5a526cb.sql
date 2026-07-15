
-- Add rating and user_id to testimonials, allow authenticated users to submit their own
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow signed-in users to insert their own testimonial (auto-published)
DROP POLICY IF EXISTS "Users can submit their own testimonial" ON public.testimonials;
CREATE POLICY "Users can submit their own testimonial"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update/delete their own testimonial
DROP POLICY IF EXISTS "Users can update their own testimonial" ON public.testimonials;
CREATE POLICY "Users can update their own testimonial"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own testimonial" ON public.testimonials;
CREATE POLICY "Users can delete their own testimonial"
ON public.testimonials
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'testimonials'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  END IF;
END $$;
