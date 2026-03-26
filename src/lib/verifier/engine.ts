import { getSupabaseServerClient } from '@/lib/supabase/server';
import { calculateVerifierConfidence, detectContradictions, shouldRaiseIssue, staleDataHours } from '@/lib/verifier/checks';

export async function runVerifierForDivision(divisionSlug: string) {
  const client = getSupabaseServerClient();
  if (!client) {
    return { ok: true, mode: 'mock' as const, message: `Mock verifier ran for ${divisionSlug}` };
  }

  const { data: sources } = await client.from('source_records').select('*').eq('division_slug', divisionSlug);
  const { data: queueRows } = await client.from('verifier_queue').select('*').eq('division_slug', divisionSlug).limit(100);

  const sourceMap = new Map((sources ?? []).map((row) => [row.id, row] as const));

  for (const row of queueRows ?? []) {
    const source = row.source_record_id ? sourceMap.get(row.source_record_id) : undefined;
    const contradictions = detectContradictions([row.payload?.primaryValue, row.payload?.secondaryValue, row.payload?.referenceValue]);
    const staleHours = staleDataHours(source?.verified_at);
    const confidence = calculateVerifierConfidence(source?.source_count ?? 0, source?.verified_at, contradictions);

    await client
      .from('verifier_queue')
      .update({
        contradiction_count: contradictions,
        stale_hours: staleHours,
        confidence_score: confidence,
        status: shouldRaiseIssue(confidence, staleHours, contradictions) ? 'failed' : 'passed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    if (shouldRaiseIssue(confidence, staleHours, contradictions)) {
      await client.from('integrity_issues').insert({
        division_slug: divisionSlug,
        issue_type: contradictions > 0 ? 'conflict' : staleHours > 48 ? 'stale' : 'verifier',
        severity: confidence < 35 ? 'high' : 'medium',
        description: `Verifier failed for ${row.entity_kind}:${row.entity_id}`,
        affected_modules: ['verifier-engine', 'verifier-queue'],
      });
    }
  }

  return { ok: true, mode: 'database' as const, message: `Verifier processed ${(queueRows ?? []).length} rows.` };
}
