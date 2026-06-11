-- ==========================================
-- WANDERLAB - SEED ADMIN SCRIPT
-- ==========================================

-- 1. XÓA TÀI KHOẢN ADMIN CŨ NẾU ĐÃ TỒN TẠI (Tránh lỗi trùng lặp)
DELETE FROM auth.users WHERE email = 'adminwanderlab@gmail.com';

-- 2. TẠO TÀI KHOẢN TRONG AUTH.USERS
-- Sử dụng một UUID tĩnh cố định cho Admin: '99999999-9999-9999-9999-999999999999'
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
(
  '00000000-0000-0000-0000-000000000000', 
  '99999999-9999-9999-9999-999999999999', 
  'authenticated', 
  'authenticated', 
  'adminwanderlab@gmail.com', 
  crypt('123456', gen_salt('bf')), 
  now(), now(), now(), 
  '{"provider":"email","providers":["email"]}', 
  '{"full_name":"Hệ Thống Admin", "avatar_url":"https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}', 
  now(), now(), '', '', '', ''
);

-- 3. CẬP NHẬT QUYỀN (ROLE) THÀNH ADMIN TRONG BẢNG PROFILES
-- Trigger tự động tạo bản ghi trong profiles, do đó chỉ cần UPDATE:
UPDATE profiles 
SET role = 'admin'::user_role 
WHERE id = '99999999-9999-9999-9999-999999999999';
