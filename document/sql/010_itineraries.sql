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
