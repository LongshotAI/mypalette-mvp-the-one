-- Create user_uploads storage bucket for user-generated content
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_uploads', 'user_uploads', true);

-- Create host_assets storage bucket for hosting organization assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('host_assets', 'host_assets', true);

-- Storage policies for user_uploads bucket
-- Allow users to upload their own files
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user_uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own files and publicly accessible content
CREATE POLICY "Users can view accessible files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user_uploads' 
  AND (
    -- Public access for avatars and artworks
    (storage.foldername(name))[2] IN ('avatars', 'artworks')
    OR 
    -- Private access for submissions (only owner, admin, super_admin)
    (
      (storage.foldername(name))[2] = 'submissions' 
      AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() 
          AND role = 'admin'
        )
      )
    )
    OR
    -- Owner can always access their files
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user_uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user_uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins full access to user_uploads
CREATE POLICY "Admins have full access to user uploads"
ON storage.objects FOR ALL
USING (
  bucket_id = 'user_uploads'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Storage policies for host_assets bucket
-- Only admins can manage host assets
CREATE POLICY "Admins can manage host assets"
ON storage.objects FOR ALL
USING (
  bucket_id = 'host_assets'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Public read access for host assets
CREATE POLICY "Public can view host assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'host_assets');