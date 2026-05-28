-- Tạo bucket 'diaries' trên Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('diaries', 'diaries', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Cho phép upload (INSERT) cho authenticated users
CREATE POLICY "Cho phép user đăng ảnh"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'diaries');

-- Cho phép mọi người xem ảnh (SELECT)
CREATE POLICY "Cho phép xem ảnh public"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'diaries');
