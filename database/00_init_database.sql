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
CREATE POLICY "Diary budget viewable" ON diary_budget_breakdown FOR SELECT USING (true);
CREATE POLICY "Diary images viewable" ON diary_images FOR SELECT USING (true);

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
CREATE POLICY "Users delete own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);


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
