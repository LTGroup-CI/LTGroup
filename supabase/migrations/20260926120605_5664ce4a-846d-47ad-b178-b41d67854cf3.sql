DROP POLICY IF EXISTS public_messages_insert ON public.messages;
CREATE POLICY public_messages_insert ON public.messages FOR INSERT TO anon, authenticated
WITH CHECK (
  request_type IN ('contact','devis')
  AND status = 'nouveau'
  AND admin_reply IS NULL
  AND replied_at IS NULL
  AND length(trim(full_name)) BETWEEN 2 AND 120
  AND length(trim(email)) BETWEEN 5 AND 255
  AND length(trim(message)) BETWEEN 5 AND 5000
  AND (phone IS NULL OR length(phone) <= 40)
  AND (company IS NULL OR length(company) <= 160)
  AND (subject IS NULL OR length(subject) <= 200)
);
DROP POLICY IF EXISTS site_media_public_read ON storage.objects;