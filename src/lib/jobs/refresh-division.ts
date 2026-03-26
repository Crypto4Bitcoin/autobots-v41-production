import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function enqueueRefreshSignals(divisionSlug: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return { ok: true, mode: 'mock' as const, message: `Mock refresh queued for ${divisionSlug}` };
  }

  await client.from('automation_jobs').insert({
    division_slug: divisionSlug,
    job_type: 'refresh-signals',
    payload: { divisionSlug },
  });

  return { ok: true, mode: 'database' as const, message: 'Refresh job queued.' };
}
