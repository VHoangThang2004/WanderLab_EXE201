-- 01. profiles
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL,
  avatar_url      TEXT,
  cover_image_url TEXT,
  bio             TEXT,
  location        TEXT,
  role            TEXT NOT NULL DEFAULT 'explorer' CHECK (role IN ('explorer','planner','local_provider','admin')),
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','pending')),
  reputation_score INTEGER DEFAULT 0,
  diaries_count   INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 02. diaries
CREATE TABLE diaries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  location        TEXT NOT NULL,
  country         TEXT DEFAULT 'Việt Nam',
  cover_image_url TEXT,
  trust_score     INTEGER DEFAULT 0,
  duration        TEXT,
  dates           TEXT,
  total_budget    TEXT,
  group_size      TEXT,
  description     TEXT,
  tips            JSONB DEFAULT '[]',
  budget_notes    JSONB DEFAULT '[]',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','published','flagged','removed')),
  likes_count     INTEGER DEFAULT 0,
  comments_count  INTEGER DEFAULT 0,
  views_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_diaries_author ON diaries(author_id);
CREATE INDEX idx_diaries_status ON diaries(status);
CREATE INDEX idx_diaries_location ON diaries(location);
CREATE INDEX idx_diaries_created ON diaries(created_at DESC);
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published diaries are viewable" ON diaries FOR SELECT USING (status = 'published' OR author_id = auth.uid());
CREATE POLICY "Users can create diaries" ON diaries FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own diaries" ON diaries FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete own diaries" ON diaries FOR DELETE USING (author_id = auth.uid());

-- 03. diary_images
CREATE TABLE diary_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_diary_images_diary ON diary_images(diary_id);

-- 04. diary_days
CREATE TABLE diary_days (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL,
  title       TEXT NOT NULL,
  activities  JSONB DEFAULT '[]',
  budget      TEXT
);
CREATE INDEX idx_diary_days_diary ON diary_days(diary_id);

-- 05. budget_items
CREATE TABLE budget_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  amount      TEXT NOT NULL,
  percentage  INTEGER DEFAULT 0
);
CREATE INDEX idx_budget_items_diary ON budget_items(diary_id);

-- 06. comments
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_diary ON comments(diary_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- 07. likes
CREATE TABLE likes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, diary_id)
);

-- 08. bookmarks
CREATE TABLE bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, diary_id)
);

-- 09. follows
CREATE TABLE follows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 10. itineraries
CREATE TABLE itineraries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  destination         TEXT NOT NULL,
  destination_region  TEXT,
  destination_image   TEXT,
  duration            TEXT,
  group_size          TEXT,
  budget_level        TEXT,
  interests           JSONB DEFAULT '[]',
  estimated_total     TEXT,
  days                JSONB DEFAULT '[]',
  budget_breakdown    JSONB DEFAULT '[]',
  is_ai_generated     BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_itineraries_user ON itineraries(user_id);

-- 11. conversations
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  type            TEXT DEFAULT 'direct' CHECK (type IN ('direct','group')),
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 12. conversation_members
CREATE TABLE conversation_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- 13. messages
CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  image_url         TEXT,
  is_read           BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- 14. plans
CREATE TABLE plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  key         TEXT UNIQUE NOT NULL,
  price_monthly INTEGER NOT NULL,
  features    JSONB DEFAULT '[]',
  is_active   BOOLEAN DEFAULT true
);
INSERT INTO plans (name, key, price_monthly, features) VALUES
  ('Free', 'free', 0, '["AI trợ lý: 5-10 lượt/ngày","Đăng tải Full HD","Giới hạn video","Tạo nhật ký","Chia sẻ cộng đồng"]'),
  ('Starter', 'starter', 50000, '["AI trợ lý: 100 lượt/tháng","Video 2K","Video không giới hạn","Phân tích cơ bản","Hỗ trợ email","Lưu trữ không giới hạn"]'),
  ('Professional', 'professional', 150000, '["AI không giới hạn","Nội dung 4K","Không giới hạn dung lượng","Trang cá nhân custom","Phân tích nâng cao","Hỗ trợ 24/7","Huy hiệu xác minh","API access"]');

-- 15. subscriptions
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id         UUID NOT NULL REFERENCES plans(id),
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','expired')),
  start_date      TIMESTAMPTZ DEFAULT NOW(),
  end_date        TIMESTAMPTZ,
  payment_method  TEXT,
  transaction_id  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
