import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentSession() {
  const client = getSupabaseServerClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session ?? null;
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Authentication required.');
  }
  return session;
}
