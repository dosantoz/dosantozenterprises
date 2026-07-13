
-- Storage layout: order-files/{order_id}/{filename}
CREATE POLICY "order-files read for participants" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'order-files' AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id::text = (storage.foldername(name))[1]
          AND o.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "order-files upload for participants" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'order-files' AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id::text = (storage.foldername(name))[1]
          AND o.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "order-files delete for admins" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'order-files' AND public.has_role(auth.uid(), 'admin')
  );
