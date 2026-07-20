-- =========================================================================================
-- WANDERLAB - SCRIPT SỬA LỖI ROW-LEVEL SECURITY (RLS)
-- Lỗi: "new row violates row-level security policy" khi đăng bình luận hoặc nhật ký.
-- Hướng dẫn: Chạy script này trong Supabase SQL Editor để bổ sung các Policy còn thiếu.
-- =========================================================================================

-- 1. Đảm bảo Policy cho Comments được thiết lập đúng (Thêm lại đề phòng bị thiếu)
DROP POLICY IF EXISTS "Users insert own comments" ON comments;
CREATE POLICY "Users insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own comments" ON comments;
CREATE POLICY "Users update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own comments" ON comments;
CREATE POLICY "Users delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 2. Bổ sung Policy INSERT, UPDATE, DELETE cho các bảng con của Diaries (nhật ký)
-- Do trong bản init trước, các bảng này chỉ có SELECT mà chưa có quyền thêm/sửa/xóa

-- Cho bảng diary_days
DROP POLICY IF EXISTS "Users insert own diary days" ON diary_days;
CREATE POLICY "Users insert own diary days" ON diary_days FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users update own diary days" ON diary_days;
CREATE POLICY "Users update own diary days" ON diary_days FOR UPDATE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users delete own diary days" ON diary_days;
CREATE POLICY "Users delete own diary days" ON diary_days FOR DELETE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

-- Cho bảng diary_budget_breakdown
DROP POLICY IF EXISTS "Users insert own diary budget" ON diary_budget_breakdown;
CREATE POLICY "Users insert own diary budget" ON diary_budget_breakdown FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users update own diary budget" ON diary_budget_breakdown;
CREATE POLICY "Users update own diary budget" ON diary_budget_breakdown FOR UPDATE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users delete own diary budget" ON diary_budget_breakdown;
CREATE POLICY "Users delete own diary budget" ON diary_budget_breakdown FOR DELETE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

-- Cho bảng diary_images
DROP POLICY IF EXISTS "Users insert own diary images" ON diary_images;
CREATE POLICY "Users insert own diary images" ON diary_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users update own diary images" ON diary_images;
CREATE POLICY "Users update own diary images" ON diary_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users delete own diary images" ON diary_images;
CREATE POLICY "Users delete own diary images" ON diary_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM diaries WHERE id = diary_id AND user_id = auth.uid())
);

-- 3. Bổ sung TOÀN BỘ Policy cho mảng Itineraries (Chưa có trong bản init)

-- Cho bảng itineraries chính
DROP POLICY IF EXISTS "Itineraries viewable" ON itineraries;
CREATE POLICY "Itineraries viewable" ON itineraries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own itineraries" ON itineraries;
CREATE POLICY "Users insert own itineraries" ON itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own itineraries" ON itineraries;
CREATE POLICY "Users update own itineraries" ON itineraries FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own itineraries" ON itineraries;
CREATE POLICY "Users delete own itineraries" ON itineraries FOR DELETE USING (auth.uid() = user_id);

-- Cho bảng itinerary_days
DROP POLICY IF EXISTS "Itinerary days viewable" ON itinerary_days;
CREATE POLICY "Itinerary days viewable" ON itinerary_days FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own itinerary days" ON itinerary_days;
CREATE POLICY "Users insert own itinerary days" ON itinerary_days FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users update own itinerary days" ON itinerary_days;
CREATE POLICY "Users update own itinerary days" ON itinerary_days FOR UPDATE USING (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users delete own itinerary days" ON itinerary_days;
CREATE POLICY "Users delete own itinerary days" ON itinerary_days FOR DELETE USING (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

-- Cho bảng itinerary_budget_breakdown
DROP POLICY IF EXISTS "Itinerary budget viewable" ON itinerary_budget_breakdown;
CREATE POLICY "Itinerary budget viewable" ON itinerary_budget_breakdown FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own itinerary budget" ON itinerary_budget_breakdown;
CREATE POLICY "Users insert own itinerary budget" ON itinerary_budget_breakdown FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users update own itinerary budget" ON itinerary_budget_breakdown;
CREATE POLICY "Users update own itinerary budget" ON itinerary_budget_breakdown FOR UPDATE USING (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users delete own itinerary budget" ON itinerary_budget_breakdown;
CREATE POLICY "Users delete own itinerary budget" ON itinerary_budget_breakdown FOR DELETE USING (
  EXISTS (SELECT 1 FROM itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);
