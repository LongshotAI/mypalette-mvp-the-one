
-- Create storage bucket for submission files
INSERT INTO storage.buckets (id, name, public)
VALUES ('submission-files', 'submission-files', true);

-- Create storage policies
CREATE POLICY "Users can upload submission files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'submission-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view submission files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'submission-files' 
    AND (
      auth.role() = 'authenticated' OR
      -- Public access for viewing files
      true
    )
  );

CREATE POLICY "Users can update their submission files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'submission-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their submission files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'submission-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
