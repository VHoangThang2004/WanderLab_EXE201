-- ==========================================
-- WANDERLAB - SEED MOCK DATA SCRIPT
-- Lưu ý: Bạn cần cấu hình và chạy file này trong Supabase SQL Editor.
-- ==========================================

-- 1. XÓA DỮ LIỆU CŨ ĐỂ SEED MỚI (CHỈ XÓA 5 USER MẪU)
DELETE FROM auth.users WHERE email IN (
  'hoangducmanh@gmail.com',
  'lethanhnha@gmail.com',
  'lehuynhduc@gmail.com',
  'nguyenhongnhung@gmail.com',
  'tranhoaiphuc@gmail.com'
);

-- 2. TẠO TÀI KHOẢN TRONG AUTH.USERS (Trigger sẽ tự động tạo bản ghi trong bảng profiles)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'hoangducmanh@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hoàng Đức Mạnh", "avatar_url":"https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'lethanhnha@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Thanh Nhã", "avatar_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'lehuynhduc@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Huỳnh Đức", "avatar_url":"https://images.unsplash.com/photo-1527980965255-d3b416303d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'nguyenhongnhung@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Hồng Nhung", "avatar_url":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'tranhoaiphuc@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Hoài Phúc", "avatar_url":"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', now(), now(), '', '', '', '');

-- Cập nhật profile location
UPDATE profiles SET location = 'Hà Nội' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE profiles SET location = 'TP. Hồ Chí Minh' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE profiles SET location = 'Đà Nẵng' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE profiles SET location = 'Hải Phòng' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE profiles SET location = 'Cần Thơ' WHERE id = '55555555-5555-5555-5555-555555555555';

-- 3. TẠO BÀI VIẾT (DIARIES) MẪU
-- Hoàng Đức Mạnh
INSERT INTO diaries (user_id, title, location, duration, total_budget, cover_image_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'Khám phá Hà Giang hùng vĩ', 'Hà Giang', '3 ngày 2 đêm', '3.500.000đ', 'https://images.unsplash.com/photo-1542006745-f09b2e59dfd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'),
('11111111-1111-1111-1111-111111111111', 'Phượt Mộc Châu mùa hoa mận', 'Sơn La', '2 ngày 1 đêm', '1.500.000đ', 'https://images.unsplash.com/photo-1555577607-bb2cc6e24db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800');

-- Lê Thanh Nhã
INSERT INTO diaries (user_id, title, location, duration, total_budget, cover_image_url) VALUES 
('22222222-2222-2222-2222-222222222222', 'Sài Gòn năng động và ẩm thực', 'TP.HCM', '2 ngày', '1.000.000đ', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'),
('22222222-2222-2222-2222-222222222222', 'Vũng Tàu những ngày đầy nắng', 'Vũng Tàu', '2 ngày 1 đêm', '2.000.000đ', 'https://images.unsplash.com/photo-1506462945848-ac8ea2f609e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800');

-- Lê Huỳnh Đức
INSERT INTO diaries (user_id, title, location, duration, total_budget, cover_image_url) VALUES 
('33333333-3333-3333-3333-333333333333', 'Đà Nẵng - Hội An 4 ngày 3 đêm', 'Đà Nẵng', '4 ngày 3 đêm', '5.500.000đ', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'),
('33333333-3333-3333-3333-333333333333', 'Huế mộng mơ', 'Huế', '2 ngày 1 đêm', '2.500.000đ', 'https://images.unsplash.com/photo-1582283087284-8ccbfdc9ecb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800');

-- Nguyễn Hồng Nhung
INSERT INTO diaries (user_id, title, location, duration, total_budget, cover_image_url) VALUES 
('44444444-4444-4444-4444-444444444444', 'Cát Bà xanh thẳm', 'Hải Phòng', '3 ngày 2 đêm', '3.000.000đ', 'https://images.unsplash.com/photo-1610486001099-0a6a02dfc059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'),
('44444444-4444-4444-4444-444444444444', 'Vịnh Hạ Long huyền thoại', 'Quảng Ninh', '3 ngày 2 đêm', '4.500.000đ', 'https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800');

-- Trần Hoài Phúc
INSERT INTO diaries (user_id, title, location, duration, total_budget, cover_image_url) VALUES 
('55555555-5555-5555-5555-555555555555', 'Chợ nổi Cái Răng', 'Cần Thơ', '1 ngày', '500.000đ', 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'),
('55555555-5555-5555-5555-555555555555', 'Rừng tràm Trà Sư', 'An Giang', '2 ngày 1 đêm', '2.200.000đ', 'https://images.unsplash.com/photo-1544605943-7f3c67d3e08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800');

-- 4. TẠO BẠN BÈ VÀ LỜI MỜI (DÀNH CHO TẤT CẢ 6 TÀI KHOẢN, BAO GỒM VO HOÀNG THẮNG)
DO $$ 
DECLARE 
  thang_id UUID;
BEGIN
  -- Lấy ID của Võ Hoàng Thắng (nếu có tồn tại)
  SELECT id INTO thang_id FROM auth.users WHERE email = 'vohoangthang2004@gmail.com' LIMIT 1;
  
  -- Nếu Thắng có tồn tại, tạo liên kết bạn bè với Thắng
  IF thang_id IS NOT NULL THEN
    -- Thắng kết bạn với Đức Mạnh (2 chiều = Bạn bè)
    INSERT INTO follows (follower_id, following_id) VALUES (thang_id, '11111111-1111-1111-1111-111111111111') ON CONFLICT DO NOTHING;
    INSERT INTO follows (follower_id, following_id) VALUES ('11111111-1111-1111-1111-111111111111', thang_id) ON CONFLICT DO NOTHING;
    
    -- Thắng kết bạn với Thanh Nhã
    INSERT INTO follows (follower_id, following_id) VALUES (thang_id, '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;
    INSERT INTO follows (follower_id, following_id) VALUES ('22222222-2222-2222-2222-222222222222', thang_id) ON CONFLICT DO NOTHING;

    -- Hồng Nhung gửi lời mời cho Thắng (Nhung follow Thắng, nhưng Thắng chưa follow lại)
    INSERT INTO follows (follower_id, following_id) VALUES ('44444444-4444-4444-4444-444444444444', thang_id) ON CONFLICT DO NOTHING;

    -- Thắng gửi lời mời cho Hoài Phúc (Thắng follow Phúc, Phúc chưa follow lại)
    INSERT INTO follows (follower_id, following_id) VALUES (thang_id, '55555555-5555-5555-5555-555555555555') ON CONFLICT DO NOTHING;
  END IF;

  -- Kết bạn chéo giữa 5 người còn lại
  -- Mạnh và Đức (Bạn bè)
  INSERT INTO follows (follower_id, following_id) VALUES ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333') ON CONFLICT DO NOTHING;
  INSERT INTO follows (follower_id, following_id) VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111') ON CONFLICT DO NOTHING;
  
  -- Nhã và Nhung (Bạn bè)
  INSERT INTO follows (follower_id, following_id) VALUES ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444') ON CONFLICT DO NOTHING;
  INSERT INTO follows (follower_id, following_id) VALUES ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;
END $$;

-- 5. TẠO TIN NHẮN (MESSAGES) GIỮA CÁC TÀI KHOẢN
DO $$ 
DECLARE 
  thang_id UUID;
BEGIN
  SELECT id INTO thang_id FROM auth.users WHERE email = 'vohoangthang2004@gmail.com' LIMIT 1;
  
  IF thang_id IS NOT NULL THEN
    -- Chat giữa Thắng và Đức Mạnh
    INSERT INTO messages (sender_id, receiver_id, content, status) VALUES 
    ('11111111-1111-1111-1111-111111111111', thang_id, 'Chào Thắng, cuối tuần này rảnh không?', 'read'),
    (thang_id, '11111111-1111-1111-1111-111111111111', 'Chào Mạnh, mình rảnh. Có plan gì à?', 'read'),
    ('11111111-1111-1111-1111-111111111111', thang_id, 'Tính lên Đà Lạt ngắm sương mù, đi không?', 'read'),
    (thang_id, '11111111-1111-1111-1111-111111111111', 'Tuyệt vời quá, hẹn gặp lại nha!', 'delivered');

    -- Chat giữa Thắng và Thanh Nhã
    INSERT INTO messages (sender_id, receiver_id, content, status) VALUES 
    (thang_id, '22222222-2222-2222-2222-222222222222', 'Đây là lịch trình Nha Trang nhé', 'read'),
    ('22222222-2222-2222-2222-222222222222', thang_id, 'Cảm ơn bạn đã gợi ý lịch trình nhé.', 'read');
  END IF;

  -- Chat giữa Huỳnh Đức và Hồng Nhung
  INSERT INTO messages (sender_id, receiver_id, content, status) VALUES 
  ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Nhung ơi, bạn review giúp mình cái bài đăng Hải Phòng mới với', 'read'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Ok bạn để mình xem', 'delivered');
END $$;
