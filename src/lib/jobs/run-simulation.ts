import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function enqueueSimulation(divisionSlug: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return { ok: true, mode: 'mock' as const, message: `Mock simulation queued for ${divisionSlug}` };
  }

  await client.from('automation_jobs').insert({
    division_slug: divisionSlug,
    job_type: 'run-simulation',
    payload: { divisionSlug },
  });

  return { ok: true, mode: 'database' as const, message: 'Simulation job queued.' };
}
