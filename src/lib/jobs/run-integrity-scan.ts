import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function enqueueIntegrityScan(divisionSlug: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return { ok: true, mode: 'mock' as const, message: `Mock integrity scan queued for ${divisionSlug}` };
  }

  await client.from('automation_jobs').insert({
    division_slug: divisionSlug,
    job_type: 'periodic-integrity-scan',
    payload: { divisionSlug },
  });

  return { ok: true, mode: 'database' as const, message: 'Integrity scan queued.' };
}
