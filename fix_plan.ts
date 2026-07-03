import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data: subs } = await supabase.from('subscriptions').select('user_id, plan_key').order('updated_at', { ascending: false }).limit(1);
  if (subs && subs.length > 0) {
    const sub = subs[0];
    console.log("Found subscription:", sub);
    const { error } = await supabase.from('profiles').update({ plan: sub.plan_key }).eq('id', sub.user_id);
    if (error) console.error("Error updating profile:", error);
    else console.log("Profile updated successfully! Now reloading app...");
  } else {
    console.log("No subscriptions found.");
  }
}
fix();
