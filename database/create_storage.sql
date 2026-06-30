-- TẠO BUCKET LƯU TRỮ (STORAGE BUCKET) CHO CHAT MEDIA
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'chat_media', 
  'chat_media', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- XÓA POLICY CŨ NẾU CÓ ĐỂ TRÁNH LỖI TRÙNG LẶP
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;

-- CẤP QUYỀN TRUY CẬP (POLICIES) CHO CHAT_MEDIA
-- Ai cũng có thể xem/tải file
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'chat_media' );

-- Chỉ người dùng đã đăng nhập mới được upload file
CREATE POLICY "Authenticated users can upload media" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'chat_media' AND auth.role() = 'authenticated' );
