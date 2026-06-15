-- ==========================================
-- TẠO BẢNG TIN NHẮN (MESSAGES)
-- ==========================================

DO $$ BEGIN CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Người dùng có thể đọc tin nhắn mà họ gửi hoặc nhận
CREATE POLICY "Users can view their own messages" 
ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Người dùng có thể gửi tin nhắn đi
CREATE POLICY "Users can insert messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Người dùng có thể cập nhật trạng thái tin nhắn mà họ nhận (ví dụ: đánh dấu là đã đọc)
CREATE POLICY "Users can update received messages" 
ON messages FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
