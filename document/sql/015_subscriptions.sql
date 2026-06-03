CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id         UUID NOT NULL REFERENCES plans(id),
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','cancelled','expired')),
  start_date      TIMESTAMPTZ DEFAULT NOW(),
  end_date        TIMESTAMPTZ,
  payment_method  TEXT,                  -- "vnpay", "momo"
  transaction_id  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
