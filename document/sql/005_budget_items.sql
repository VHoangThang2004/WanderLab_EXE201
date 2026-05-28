CREATE TABLE budget_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id    UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  amount      TEXT NOT NULL,
  percentage  INTEGER DEFAULT 0
);

CREATE INDEX idx_budget_items_diary ON budget_items(diary_id);
