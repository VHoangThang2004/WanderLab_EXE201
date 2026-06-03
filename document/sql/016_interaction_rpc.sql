-- Các hàm RPC hỗ trợ tăng/giảm số đếm (Likes, Comments) an toàn (Atomic Increment)

CREATE OR REPLACE FUNCTION increment_like(row_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.diaries
  SET likes_count = likes_count + 1
  WHERE id = row_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_like(row_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.diaries
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = row_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_comment(row_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.diaries
  SET comments_count = comments_count + 1
  WHERE id = row_id;
END;
$$;
