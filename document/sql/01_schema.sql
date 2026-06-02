-- ==========================================
-- WANDERLAB DATABASE SCHEMA v2.0
-- Sync with TypeScript interfaces
-- ==========================================

-- Bật các extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS
-- ==========================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('explorer', 'planner', 'local_provider', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_plan AS ENUM ('free', 'starter', 'professional');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE diary_status AS ENUM ('draft', 'pending', 'published', 'flagged', 'removed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE privacy_setting AS ENUM ('private', 'friends', 'public');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 2. BẢNG PROFILES (Người dùng)
-- ==========================================
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

-- ==========================================
-- 3. BẢNG DIARIES (Nhật ký)
-- ==========================================
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

-- Bảng Ảnh phụ của Nhật ký (Gallery)
CREATE TABLE diary_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Bảng Lịch trình từng ngày của Nhật ký
CREATE TABLE diary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    budget TEXT,
    activities JSONB DEFAULT '[]'::jsonb
);

-- Bảng Phân bổ chi phí của Nhật ký
CREATE TABLE diary_budget_breakdown (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount TEXT NOT NULL,
    percentage INTEGER
);

-- ==========================================
-- 4. BẢNG ITINERARIES (Lịch trình tự tạo / AI)
-- ==========================================
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    destination_region TEXT,
    destination_image TEXT,
    duration TEXT,
    group_size TEXT,
    budget_level TEXT,
    interests JSONB DEFAULT '[]'::jsonb,
    estimated_total TEXT,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    emoji TEXT,
    budget TEXT,
    activities JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE itinerary_budget_breakdown (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    amount TEXT NOT NULL
);

-- ==========================================
-- 5. BẢNG TƯƠNG TÁC XÃ HỘI (Social)
-- ==========================================
CREATE TABLE follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE diary_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, diary_id)
);

CREATE TABLE diary_bookmarks (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, diary_id)
);

CREATE TABLE itinerary_bookmarks (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, itinerary_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 6. TRIGGERS & FUNCTIONS
-- ==========================================

-- Function cập nhật cột updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Gán Trigger cho các bảng cần thiết
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_diaries_updated_at ON diaries;
CREATE TRIGGER update_diaries_updated_at BEFORE UPDATE ON diaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function tự tạo profile khi sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Người dùng mới'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 7. RLS (Row Level Security)
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

-- Ví dụ policies đơn giản (Ai cũng có thể xem, chủ sở hữu được sửa)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published diaries are viewable by everyone" ON diaries FOR SELECT USING (status = 'published');
CREATE POLICY "Users can insert their own diaries" ON diaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own diaries" ON diaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own diaries" ON diaries FOR DELETE USING (auth.uid() = user_id);

-- Apply similar basic logic for related tables...
CREATE POLICY "Diary days viewable" ON diary_days FOR SELECT USING (true);
CREATE POLICY "Diary budget viewable" ON diary_budget_breakdown FOR SELECT USING (true);
CREATE POLICY "Diary images viewable" ON diary_images FOR SELECT USING (true);
CREATE POLICY "Comments viewable" ON comments FOR SELECT USING (true);
