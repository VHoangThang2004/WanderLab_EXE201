import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing fetch messages...");
  const { data: fetch1, error: err1 } = await supabase.from('messages').select('id, sender_id, receiver_id, content').limit(5);
  console.log("Messages in DB:", fetch1);
  
  if (fetch1 && fetch1.length > 0) {
    const msg = fetch1[0];
    console.log("Trying to delete message", msg.id);
    const { data: del, error: delErr } = await supabase.from('messages').delete().eq('id', msg.id).select();
    console.log("Deleted data:", del);
    console.log("Delete error:", delErr);
  }
}

test();
