CREATE TABLE plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,              -- "Free", "Starter", "Professional"
  key         TEXT UNIQUE NOT NULL,       -- "free", "starter", "professional"
  price_monthly INTEGER NOT NULL,        -- 0, 50000, 150000 (VND)
  features    JSONB DEFAULT '[]',
  is_active   BOOLEAN DEFAULT true
);

-- Seed data
INSERT INTO plans (name, key, price_monthly, features) VALUES
  ('Free', 'free', 0, '["AI trợ lý: 5-10 lượt/ngày","Đăng tải Full HD","Giới hạn video","Tạo nhật ký","Chia sẻ cộng đồng"]'),
  ('Starter', 'starter', 50000, '["AI trợ lý: 100 lượt/tháng","Video 2K","Video không giới hạn","Phân tích cơ bản","Hỗ trợ email","Lưu trữ không giới hạn"]'),
  ('Professional', 'professional', 150000, '["AI không giới hạn","Nội dung 4K","Không giới hạn dung lượng","Trang cá nhân custom","Phân tích nâng cao","Hỗ trợ 24/7","Huy hiệu xác minh","API access"]');
