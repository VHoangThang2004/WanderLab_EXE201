CREATE TABLE diary_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diary_images_diary ON diary_images(diary_id);
