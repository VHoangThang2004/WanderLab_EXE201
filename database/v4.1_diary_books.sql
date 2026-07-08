-- v4.1: Bảng Cuốn Nhật Ký (Diary Books)

CREATE TABLE IF NOT EXISTS diary_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS diary_book_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES diary_books(id) ON DELETE CASCADE,
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS cho diary_books
ALTER TABLE diary_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public diary_books viewable" ON diary_books FOR SELECT USING (true);
CREATE POLICY "Users insert own diary_books" ON diary_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own diary_books" ON diary_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own diary_books" ON diary_books FOR DELETE USING (auth.uid() = user_id);

-- RLS cho diary_book_entries
ALTER TABLE diary_book_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public diary_book_entries viewable" ON diary_book_entries FOR SELECT USING (true);
CREATE POLICY "Users manage own diary_book_entries" ON diary_book_entries 
FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM diary_books WHERE id = book_id)
);

-- Triggers for updated_at
CREATE TRIGGER update_diary_books_updated_at BEFORE UPDATE ON diary_books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
