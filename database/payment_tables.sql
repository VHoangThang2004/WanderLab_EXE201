-- ==========================================
-- WANDERLAB - PAYMENT & SUBSCRIPTION TABLES
-- ==========================================

-- Cập nhật ENUM user_plan để hỗ trợ các gói mới (plus, pro)
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'plus';
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'pro';

-- 1. Bảng lưu trữ danh sách các Gói (Plans)
CREATE TABLE public.plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_key TEXT UNIQUE NOT NULL, -- vd: 'starter', 'professional'
    name TEXT NOT NULL,
    price_vnd BIGINT NOT NULL,
    billing_period TEXT NOT NULL DEFAULT 'tháng',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed data mẫu
INSERT INTO public.plans (plan_key, name, price_vnd, features) VALUES
('plus', 'Plus', 19000, '["Giới hạn sử dụng gấp 2.5 lần gói Free", "Đính kèm video phân giải cao 1080p", "Trải nghiệm không quảng cáo", "Huy hiệu Plus nổi bật"]'),
('pro', 'Pro', 29000, '["Giới hạn sử dụng gấp 2.5 lần gói Plus", "Đính kèm video siêu nét 2160p (4K)", "Trải nghiệm không quảng cáo", "Huy hiệu Pro đẳng cấp"]');

-- 2. Bảng lưu trữ trạng thái đăng ký Gói của User (Subscriptions)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_key TEXT NOT NULL REFERENCES public.plans(plan_key) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id) -- Mỗi user chỉ có 1 subscription active ở 1 thời điểm
);

-- 3. Bảng lưu trữ Giao dịch Thanh toán (Payment Transactions)
CREATE TABLE public.payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_key TEXT NOT NULL,
    order_code BIGINT UNIQUE NOT NULL, -- Mã đơn hàng kiểu BIGINT bắt buộc cho PayOS
    amount BIGINT NOT NULL, -- Số tiền thực tế (VND)
    provider TEXT NOT NULL DEFAULT 'payos',
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'CANCELLED'
    checkout_url TEXT, -- Link thanh toán (QR code) trả về từ PayOS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Plans: Ai cũng xem được
CREATE POLICY "Cho phép đọc plans" ON public.plans FOR SELECT USING (true);

-- Subscriptions: User chỉ xem được sub của mình
CREATE POLICY "User đọc sub của mình" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payment Transactions: User chỉ xem được giao dịch của mình
CREATE POLICY "User đọc giao dịch của mình" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
-- Cho phép user tạo giao dịch mới (khi request tạo link)
CREATE POLICY "User tạo giao dịch" ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- User có thể update status = CANCELLED
CREATE POLICY "User cập nhật giao dịch" ON public.payment_transactions FOR UPDATE USING (auth.uid() = user_id);
