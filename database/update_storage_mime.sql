-- Tắt giới hạn loại file cho bucket chat_media
-- Điều này cho phép gửi các file dạng văn phòng (Word, Excel, PowerPoint, Text, ZIP, RAR, PDF...)
UPDATE storage.buckets 
SET allowed_mime_types = NULL 
WHERE id = 'chat_media';
