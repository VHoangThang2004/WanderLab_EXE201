CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  type            TEXT DEFAULT 'direct'
                    CHECK (type IN ('direct','group')),
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
