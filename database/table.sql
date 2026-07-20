-- =========================================================================================
-- WANDERLAB - MASTER INIT DATABASE SCRIPT v4.0 (ALL-IN-ONE)
-- Hướng dẫn: Copy TOÀN BỘ file này và dán vào Supabase SQL Editor rồi bấm RUN 1 LẦN DUY NHẤT.
-- =========================================================================================

-- ==========================================
-- PHẦN 1: XÓA DỮ LIỆU CŨ VÀ KHỞI TẠO CẤU TRÚC
-- ==========================================

-- Bật extension tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dọn sạch toàn bộ các bảng cũ (tránh lỗi xung đột)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS itinerary_bookmarks CASCADE;
DROP TABLE IF EXISTS diary_bookmarks CASCADE;
DROP TABLE IF EXISTS diary_likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS itinerary_budget_breakdown CASCADE;
DROP TABLE IF EXISTS itinerary_days CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS diary_budget_breakdown CASCADE;
DROP TABLE IF EXISTS diary_days CASCADE;
DROP TABLE IF EXISTS diary_images CASCADE;
DROP TABLE IF EXISTS diaries CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Tạo ENUMs
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('explorer', 'planner', 'local_provider', 'admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE user_plan AS ENUM ('free', 'starter', 'professional'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE diary_status AS ENUM ('draft', 'pending', 'published', 'flagged', 'removed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE privacy_setting AS ENUM ('private', 'friends', 'public'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tạo Bảng Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    cover_image_url TEXT,
    bio TEXT,
    location TEXT,
    role user_role DEFAULT 'explorer',
    status user_status DEFAULT 'active',
    plan user_plan DEFAULT 'free',
    reputation_score INTEGER DEFAULT 0,
    diaries_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tạo Bảng Diaries
CREATE TABLE diaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT DEFAULT 'Việt Nam',
    cover_image_url TEXT,
    duration TEXT,
    dates TEXT,
    total_budget TEXT,
    group_size TEXT,
    description TEXT,
    privacy privacy_setting DEFAULT 'public',
    status diary_status DEFAULT 'published',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 0,
    budget_notes JSONB DEFAULT '[]'::jsonb,
    tips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Các bảng phụ của Diaries
CREATE TABLE diary_images (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE, image_url TEXT NOT NULL, caption TEXT, sort_order INTEGER DEFAULT 0);
CREATE TABLE diary_days (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE, day_number INTEGER NOT NULL, title TEXT NOT NULL, budget TEXT, activities JSONB DEFAULT '[]'::jsonb);
CREATE TABLE diary_budget_breakdown (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE, category TEXT NOT NULL, amount TEXT NOT NULL, percentage INTEGER);

-- Bảng Itineraries
CREATE TABLE itineraries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, destination TEXT NOT NULL, destination_region TEXT, destination_image TEXT, duration TEXT, group_size TEXT, budget_level TEXT, interests JSONB DEFAULT '[]'::jsonb, estimated_total TEXT, is_ai_generated BOOLEAN DEFAULT false, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()));
CREATE TABLE itinerary_days (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE, day_number INTEGER NOT NULL, title TEXT NOT NULL, emoji TEXT, budget TEXT, activities JSONB DEFAULT '[]'::jsonb);
CREATE TABLE itinerary_budget_breakdown (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE, label TEXT NOT NULL, amount TEXT NOT NULL);

-- CÁC BẢNG TƯƠNG TÁC (ĐÃ CHẶN LỖI TRÙNG LẶP DỮ LIỆU)
CREATE TABLE follows (follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE, following_id UUID REFERENCES profiles(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), PRIMARY KEY (follower_id, following_id));
CREATE TABLE diary_likes (user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), PRIMARY KEY (user_id, diary_id));
CREATE TABLE diary_bookmarks (user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), PRIMARY KEY (user_id, diary_id));
CREATE TABLE itinerary_bookmarks (user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), PRIMARY KEY (user_id, itinerary_id));
CREATE TABLE comments (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, content TEXT NOT NULL, likes_count INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()));


-- ==========================================
-- PHẦN 2: BẬT BẢO MẬT RLS VÀ PHÂN QUYỀN
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_budget_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_budget_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_bookmarks ENABLE ROW LEVEL SECURITY;

-- Cấp quyền (Policy) chuẩn cho mọi người
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published diaries viewable" ON diaries FOR SELECT USING (true);
CREATE POLICY "Users insert own diaries" ON diaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own diaries" ON diaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own diaries" ON diaries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Diary days viewable" ON diary_days FOR SELECT USING (true);
CREATE POLICY "Users insert own diary days" ON diary_days FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users update own diary days" ON diary_days FOR UPDATE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users delete own diary days" ON diary_days FOR DELETE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));

CREATE POLICY "Diary budget viewable" ON diary_budget_breakdown FOR SELECT USING (true);
CREATE POLICY "Users insert own diary budget" ON diary_budget_breakdown FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users update own diary budget" ON diary_budget_breakdown FOR UPDATE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users delete own diary budget" ON diary_budget_breakdown FOR DELETE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));

CREATE POLICY "Diary images viewable" ON diary_images FOR SELECT USING (true);
CREATE POLICY "Users insert own diary images" ON diary_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users update own diary images" ON diary_images FOR UPDATE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));
CREATE POLICY "Users delete own diary images" ON diary_images FOR DELETE USING (EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid()));

-- Policy Tương tác xã hội
CREATE POLICY "Comments viewable" ON comments FOR SELECT USING (true);
CREATE POLICY "Users insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Diary likes viewable" ON diary_likes FOR SELECT USING (true);
CREATE POLICY "Users insert own likes" ON diary_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own likes" ON diary_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Diary bookmarks viewable" ON diary_bookmarks FOR SELECT USING (true);
CREATE POLICY "Users insert own bookmarks" ON diary_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks" ON diary_bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Follows viewable" ON follows FOR SELECT USING (true);
CREATE POLICY "Users insert own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users delete own follows or follows targeting them" ON follows FOR DELETE USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Policy Itineraries
CREATE POLICY "Itineraries viewable" ON itineraries FOR SELECT USING (true);
CREATE POLICY "Users insert own itineraries" ON itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own itineraries" ON itineraries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own itineraries" ON itineraries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Itinerary days viewable" ON itinerary_days FOR SELECT USING (true);
CREATE POLICY "Users insert own itinerary days" ON itinerary_days FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));
CREATE POLICY "Users update own itinerary days" ON itinerary_days FOR UPDATE USING (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));
CREATE POLICY "Users delete own itinerary days" ON itinerary_days FOR DELETE USING (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));

CREATE POLICY "Itinerary budget viewable" ON itinerary_budget_breakdown FOR SELECT USING (true);
CREATE POLICY "Users insert own itinerary budget" ON itinerary_budget_breakdown FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));
CREATE POLICY "Users update own itinerary budget" ON itinerary_budget_breakdown FOR UPDATE USING (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));
CREATE POLICY "Users delete own itinerary budget" ON itinerary_budget_breakdown FOR DELETE USING (EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid()));


-- ==========================================
-- PHẦN 3: TẠO HÀM (FUNCTIONS) & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = timezone('utc'::text, now()); RETURN NEW; END; $$ language 'plpgsql';
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diaries_updated_at BEFORE UPDATE ON diaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Xử lý đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url) VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Người dùng mới'), new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Hàm xử lý Like/Comment mượt mà (Bỏ qua rào cản RLS)
CREATE OR REPLACE FUNCTION increment_like(row_id UUID) RETURNS void AS $$ BEGIN UPDATE diaries SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = row_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION decrement_like(row_id UUID) RETURNS void AS $$ BEGIN UPDATE diaries SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = row_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION increment_comment(row_id UUID) RETURNS void AS $$ BEGIN UPDATE diaries SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = row_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION decrement_comment(row_id UUID) RETURNS void AS $$ BEGIN UPDATE diaries SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0) WHERE id = row_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- WANDERLAB - SEED ADMIN SCRIPT
-- ==========================================

-- TẠO TÀI KHOẢN TRONG AUTH.USERS
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
) ON CONFLICT (id) DO NOTHING;

-- KHÔI PHỤC PROFILE CHO CÁC TÀI KHOẢN AUTH CŨ (Tránh lỗi không đăng nhập được khi chạy lại DB)
INSERT INTO public.profiles (id, full_name, avatar_url, role)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', 'Người dùng ' || substr(id::text, 1, 4)), 
    raw_user_meta_data->>'avatar_url', 
    'explorer'::user_role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- CẬP NHẬT QUYỀN (ROLE) THÀNH ADMIN TRONG BẢNG PROFILES
-- Chắc chắn rằng tài khoản admin được cấp quyền đúng:
UPDATE profiles 
SET role = 'admin'::user_role 
WHERE id = '99999999-9999-9999-9999-999999999999';

-- TẠO BẢNG TIN NHẮN (MESSAGES)
-- ==========================================

DO $$ BEGIN CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    reactions JSONB DEFAULT '{}'::jsonb,
    status message_status DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT,
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy Notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Người dùng có thể đọc tin nhắn mà họ gửi hoặc nhận
CREATE POLICY "Users can view their own messages" 
ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Người dùng có thể gửi tin nhắn đi
CREATE POLICY "Users can insert messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Người dùng có thể cập nhật trạng thái tin nhắn mà họ nhận (ví dụ: đánh dấu là đã đọc)
CREATE POLICY "Users can update received messages" 
ON messages FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- PHẦN 4: BẬT REALTIME CHO NHỮNG BẢNG CẦN THIẾT
-- ==========================================
-- Thêm các bảng vào danh sách theo dõi Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;