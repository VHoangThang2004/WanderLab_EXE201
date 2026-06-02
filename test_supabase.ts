import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data, error } = await supabase
    .from('diaries')
    .select(`
      id,
      location,
      cover_image_url,
      created_at,
      description,
      group_size,
      likes_count,
      comments_count,
      author:profiles(id, full_name, avatar_url),
      diary_likes(user_id),
      diary_bookmarks(user_id)
    `)
    .limit(1);

  console.log('Error:', error);
  console.log('Data:', data);
}

testFetch();
