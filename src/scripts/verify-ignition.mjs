import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function check() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing credentials');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log('--- IGNITION VERIFICATION ---');

  const { data: divisions, error, count } = await supabase
    .from('divisions')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('❌ Ignition Check Failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Table "divisions" is LIVE.`);
  console.log(`✅ Division Count: ${count}`);
  console.log('--- SLUGS ---');
  divisions.forEach(d => console.log(`- ${d.slug}`));
  
  if (count === 19) {
    console.log('--- IGNITION COMPLETE ---');
  } else {
    console.warn('⚠️ Warning: Division count mismatch (Expected 19).');
  }
}

check();
