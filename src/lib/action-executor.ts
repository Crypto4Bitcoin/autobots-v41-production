import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ActionIntent } from '@/lib/types';
import { enqueueRefreshSignals } from '@/lib/jobs/refresh-division';
import { enqueueSimulation } from '@/lib/jobs/run-simulation';
import { enqueueIntegrityScan } from '@/lib/jobs/run-integrity-scan';
import { runVerifierForDivision } from '@/lib/verifier/engine';

export type ActionRequest = {
  intent: ActionIntent;
  divisionSlug: string;
  targetId?: string;
  payload?: Record<string, unknown>;
};

export async function executeAction(request: ActionRequest) {
  const client = getSupabaseServerClient();

  switch (request.intent) {
    case 'refresh-signals':
      return enqueueRefreshSignals(request.divisionSlug);

    case 'run-simulation':
      return enqueueSimulation(request.divisionSlug);

    case 'run-verifier':
      return runVerifierForDivision(request.divisionSlug);

    case 'resolve-issue':
      if (!client) return { ok: true, mode: 'mock' as const, message: `Mock issue resolved: ${request.targetId}` };
      if (!request.targetId) return { ok: false, mode: 'database' as const, message: 'Missing issue target id.' };
      await client
        .from('integrity_issues')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', request.targetId);
      return { ok: true, mode: 'database' as const, message: 'Issue resolved.' };

    case 'approve-relay':
      if (!client) return { ok: true, mode: 'mock' as const, message: `Mock relay approved: ${request.targetId}` };
      if (!request.targetId) return { ok: false, mode: 'database' as const, message: 'Missing relay target id.' };
      await client.from('relay_links').update({ status: 'approved' }).eq('id', request.targetId);
      return { ok: true, mode: 'database' as const, message: 'Relay approved.' };

    case 'reject-relay':
      if (!client) return { ok: true, mode: 'mock' as const, message: `Mock relay rejected: ${request.targetId}` };
      if (!request.targetId) return { ok: false, mode: 'database' as const, message: 'Missing relay target id.' };
      await client.from('relay_links').update({ status: 'rejected' }).eq('id', request.targetId);
      return { ok: true, mode: 'database' as const, message: 'Relay rejected.' };

    case 'seed-database':
      return enqueueIntegrityScan(request.divisionSlug);

    case 'create-entity':
    case 'log-event':
      if (!client) {
        return {
          ok: true,
          mode: 'mock' as const,
          message: `Mock action executed: ${request.intent} for ${request.divisionSlug}`,
        };
      }
      await client.from('action_logs').insert({
        division_slug: request.divisionSlug,
        intent: request.intent,
        target_id: request.targetId ?? null,
        payload: request.payload ?? {},
      });
      return { ok: true, mode: 'database' as const, message: `Action logged: ${request.intent}` };

    default:
      return { ok: false, mode: 'database' as const, message: 'Unsupported action intent.' };
  }
}
