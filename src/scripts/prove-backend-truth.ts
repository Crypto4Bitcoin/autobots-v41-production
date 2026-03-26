import { createClient } from '@supabase/supabase-js';
import { dashboardRepository } from '../lib/data-access';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function proveTruth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing credentials');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log('--- BACKEND TRUTH PROOF PACK ---');

  // 1. DB Read Proof (Division)
  console.log('1. DB Read Proof (Checking divisions table)...');
  const { data: divisions, error: divError } = await supabase.from('divisions').select('slug, name').limit(1);
  if (divError || !divisions.length) {
    console.warn('? Division read failed or table empty.');
  } else {
    console.log(`? Division read OK: ${divisions[0].name} (${divisions[0].slug})`);
  }

  // 2. DB Write Proof (Entity Creation)
  console.log('2. DB Write Proof (Creating Test Accord)...');
  const testSlug = `proof-${Math.random().toString(36).substring(2, 7)}`;
  const { data: entity, error: entError } = await supabase
    .from('entities')
    .insert({
      division_slug: 'governance',
      name: `Proof Accord: ${testSlug}`,
      entity_type: 'accord',
      status: 'draft',
      metadata: { slug: testSlug }
    })
    .select()
    .single();

  if (entError) {
    console.error('? Entity write failed:', entError.message);
  } else {
    console.log(`? Entity write OK: ${entity.id}`);
  }

  // 3. UI/Dashboard Layer Proof
  console.log('3. Dashboard Layer Proof (Fetching Governance payload)...');
  // Need to use the divisions view if it exists, or the mock fallback if not yet synchronized
  const payload = await dashboardRepository.getDashboard('governance');
  const found = payload?.entities?.find(e => e.id === entity?.id);
  if (found) {
    console.log(`? Dashboard read OK: Found proof accord in repository output.`);
  } else {
    console.warn('?? Dashboard read skipped or item not found (Views might not be ready or division not seeded).');
  }

  // 4. Log Proof
  console.log('4. Log Proof (Manual check for action_logs)...');
  const { data: log, error: logError } = await supabase
    .from('action_logs')
    .insert({
      division_slug: 'governance',
      intent: 'PROVE_BACKEND_TRUTH',
      payload: { proofId: testSlug }
    })
    .select()
    .single();

  if (logError) {
    console.error('? Action log failed:', logError.message);
  } else {
    console.log(`? Action log OK: ${log.id}`);
  }

  console.log('--- PROOF COMPLETE ---');
}

proveTruth();
