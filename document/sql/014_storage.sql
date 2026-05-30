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

-- =======================================================
-- TẠO POLICIES CHO BUCKET 'avatars' VÀ 'covers'
-- =======================================================

-- Tạo bucket nếu chưa có
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true), ('covers', 'covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies cho 'avatars'
CREATE POLICY "Cho phép user tải lên ảnh đại diện"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Cho phép user cập nhật ảnh đại diện"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Cho phép xem ảnh đại diện public"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Policies cho 'covers'
CREATE POLICY "Cho phép user tải lên ảnh bìa"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Cho phép user cập nhật ảnh bìa"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'covers');

CREATE POLICY "Cho phép xem ảnh bìa public"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'covers');

