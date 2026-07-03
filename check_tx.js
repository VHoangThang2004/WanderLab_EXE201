import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function checkTable() {
  const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/payment_transactions?select=*&limit=1`, {
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
    }
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
checkTable();
