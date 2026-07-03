import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function fix() {
  // Get latest subscription
  const subRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/subscriptions?select=user_id,plan_key&order=updated_at.desc&limit=1`, {
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
    }
  });
  const subs = await subRes.json();
  
  if (subs && subs.length > 0) {
    const sub = subs[0];
    console.log("Found subscription:", sub);
    
    // Update profile
    const updateRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${sub.user_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ plan: sub.plan_key })
    });
    
    if (updateRes.ok) {
      console.log("Profile updated successfully!");
    } else {
      console.error("Failed to update profile:", await updateRes.text());
    }
  } else {
    console.log("No subscriptions found.");
  }
}

fix();
