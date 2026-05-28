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
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','pending','published','flagged','removed')),
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

-- RLS: Published diaries are public; authors can manage their own
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published diaries are viewable"
  ON diaries FOR SELECT
  USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Users can create diaries"
  ON diaries FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own diaries"
  ON diaries FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete own diaries"
  ON diaries FOR DELETE
  USING (author_id = auth.uid());
