-- Create a new storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Set up storage policies
CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
); 