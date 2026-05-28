CREATE TABLE diary_days (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL,
  title       TEXT NOT NULL,
  activities  JSONB DEFAULT '[]',
  budget      TEXT
);

CREATE INDEX idx_diary_days_diary ON diary_days(diary_id);
