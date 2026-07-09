-- WANDERLAB - CẬP NHẬT ĐỒNG BỘ THỐNG KÊ PROFILE (v4.2)
-- Hướng dẫn: Copy toàn bộ code trong file này và chạy (Run) trên Supabase SQL Editor.

-- 1. Bổ sung các cột thống kê mới vào bảng profiles (nếu chưa có)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS countries_visited INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cities_visited INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS likes_received INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS comments_received INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS saves_received INTEGER DEFAULT 0;

-- 2. Tạo hàm tự động tính toán lại toàn bộ chỉ số cho một user cụ thể
CREATE OR REPLACE FUNCTION public.sync_user_profile_stats(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET 
        -- Số nhật ký đã đăng
        diaries_count = (SELECT count(*) FROM public.diaries WHERE user_id = target_user_id),
        
        -- Số lượng quốc gia duy nhất (distinct) từ các bài nhật ký của user
        countries_visited = (SELECT count(DISTINCT country) FROM public.diaries WHERE user_id = target_user_id AND country IS NOT NULL AND country != ''),
        
        -- Số lượng thành phố duy nhất (distinct) từ location
        cities_visited = (SELECT count(DISTINCT location) FROM public.diaries WHERE user_id = target_user_id AND location IS NOT NULL AND location != ''),
        
        -- Tổng số like nhận được từ tất cả bài nhật ký
        likes_received = (SELECT COALESCE(SUM(likes_count), 0) FROM public.diaries WHERE user_id = target_user_id),
        
        -- Tổng số comment nhận được
        comments_received = (SELECT COALESCE(SUM(comments_count), 0) FROM public.diaries WHERE user_id = target_user_id),
        
        -- Tổng số lượt lưu (bookmark) mà người khác lưu nhật ký của user này
        saves_received = (
            SELECT count(*) 
            FROM public.diary_bookmarks db 
            JOIN public.diaries d ON d.id = db.diary_id 
            WHERE d.user_id = target_user_id
        )
    WHERE id = target_user_id;
END;
$$;

-- 3. Tạo hàm để tự động đồng bộ cho tất cả các user hiện tại trong database
CREATE OR REPLACE FUNCTION public.sync_all_profiles_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT id FROM public.profiles LOOP
        PERFORM public.sync_user_profile_stats(rec.id);
    END LOOP;
END;
$$;

-- 4. Kích hoạt đồng bộ ngay lập tức cho toàn bộ dữ liệu cũ
SELECT public.sync_all_profiles_stats();

-- 5. Tạo Trigger tự động cập nhật profile khi có thay đổi trên bảng diaries
CREATE OR REPLACE FUNCTION trigger_update_profile_stats_from_diaries()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        PERFORM public.sync_user_profile_stats(OLD.user_id);
    ELSE
        PERFORM public.sync_user_profile_stats(NEW.user_id);
    END IF;
    RETURN NULL; -- AFTER trigger
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_diary_changed_update_profile ON public.diaries;
CREATE TRIGGER on_diary_changed_update_profile
AFTER INSERT OR UPDATE OR DELETE ON public.diaries
FOR EACH ROW EXECUTE FUNCTION trigger_update_profile_stats_from_diaries();
