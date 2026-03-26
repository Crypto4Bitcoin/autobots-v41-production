import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkIntegrity() {
  const PROD_URL = process.env.NEXT_PUBLIC_APP_URL;
  const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('--- ACTIVE INTEGRITY CHECK (SOVEREIGN V4) ---');

  if (!PROD_URL) {
    console.warn('?? NEXT_PUBLIC_APP_URL not set. Falling back to https://autobots-v41-production.vercel.app');
  }
  const targetUrl = PROD_URL || 'https://autobots-v41-production.vercel.app';

  // 1. Production Health
  console.log(`1. Checking Edge Health: ${targetUrl}/api/health`);
  try {
    const health = await axios.get(`${targetUrl}/api/health`);
    if (health.status === 200) {
      console.log('? Edge Health: 200 OK');
      if (health.data.state === 'SOVEREIGN_IDLE') {
        console.log('? State: SOVEREIGN_IDLE (Ready for Ignition)');
      } else {
        console.warn('?? State: Unexpected Payload', health.data);
      }
    }
  } catch (e: any) {
    console.error('? Edge Health: 404/FAIL (DEPLOYMENT_NOT_FOUND or OFFLINE)');
  }

  // 2. Database Core
  console.log('2. Checking Database Spine (Supabase)...');
  if (!SB_URL || !SB_KEY) {
    console.error('? DB Credentials Missing in .env.local');
  } else {
    const supabase = createClient(SB_URL, SB_KEY);
    const { data, count, error } = await supabase.from('divisions').select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('? DB Spine: Table not found or access denied', error.message);
    } else if (count !== 19) {
      console.warn(`?? DB Spine: Division count mismatch (Expected 19, found ${count})`);
    } else {
      console.log('? DB Spine: 19 Divisions Registered (Locked)');
    }
  }

  // 3. Regulation Layer
  console.log(`3. Checking Regulation Interface: ${targetUrl}/control`);
  try {
    const control = await axios.get(`${targetUrl}/control`);
    if (control.status === 200) {
      console.log('? Regulation Layer: Route Persistent');
    }
  } catch (e: any) {
    console.warn('?? Regulation Layer: Route not verified or restricted');
  }

  console.log('--- INTEGRITY CHECK COMPLETE ---');
}

checkIntegrity();
