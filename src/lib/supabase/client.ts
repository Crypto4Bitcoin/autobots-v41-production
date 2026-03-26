import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;

  browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
  return browserClient;
}
