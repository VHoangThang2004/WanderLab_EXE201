-- WANDERLAB DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor

-- 1. FIX LIKES TABLE (interactionService uses 'diary_likes')
CREATE TABLE IF NOT EXISTS diary_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  reaction_type TEXT DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, diary_id)
);

-- If table already exists, just add the reaction_type column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='diary_likes' AND column_name='reaction_type') THEN
    ALTER TABLE diary_likes ADD COLUMN reaction_type TEXT DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry'));
  END IF;
END $$;


-- 2. CREATE FUNCTION & TRIGGER FOR LIKES COUNT (Because code uses RPC)
CREATE OR REPLACE FUNCTION increment_like(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE diaries
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_like(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE diaries
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comment(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE diaries
  SET comments_count = COALESCE(comments_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;


-- 3. FIX BOOKMARKS TABLE (code uses 'diary_bookmarks')
CREATE TABLE IF NOT EXISTS diary_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, diary_id)
);


-- 4. ENABLE REALTIME cho bảng comments và diary_likes để cập nhật UI tự động (tùy chọn)
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table diary_likes;
