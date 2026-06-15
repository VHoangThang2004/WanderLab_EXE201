import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjhmutmbfmcycnoeeobx.supabase.co';
const supabaseKey = 'sb_publishable_GBfodt6Z5TmoWNNRXOs3VQ_2ydKzU9V';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: b, error } = await supabase.from('diary_bookmarks').select('*').limit(1);
  console.log("Bookmarks schema sample:", b, error);
}

test();
