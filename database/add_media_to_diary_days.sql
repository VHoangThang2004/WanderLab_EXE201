-- Migration: Add media columns to diary_days table
-- This allows users to attach multiple images, videos, and audios to each day of their travel diary timeline.

ALTER TABLE public.diary_days
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS videos text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS audios text[] DEFAULT '{}'::text[];

-- Optional: If you want to limit the size of the arrays at the DB level, you can add check constraints (though usually handled at application level)
-- ALTER TABLE public.diary_days ADD CONSTRAINT check_images_length CHECK (array_length(images, 1) <= 10);
-- ALTER TABLE public.diary_days ADD CONSTRAINT check_videos_length CHECK (array_length(videos, 1) <= 2);
