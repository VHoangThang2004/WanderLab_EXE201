CREATE TABLE conversation_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);
