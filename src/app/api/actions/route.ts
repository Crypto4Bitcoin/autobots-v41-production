import { NextResponse } from 'next/server';
import { z } from 'zod';
import { executeAction } from '@/lib/action-executor';

const schema = z.object({
  intent: z.enum([
    'refresh-signals',
    'run-verifier',
    'run-simulation',
    'approve-relay',
    'reject-relay',
    'resolve-issue',
    'create-entity',
    'log-event',
    'seed-database',
  ]),
  divisionSlug: z.string().min(1),
  targetId: z.string().optional(),
  payload: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Invalid action request.', issues: parsed.error.issues }, { status: 400 });
  }

  const result = await executeAction(parsed.data);
  return NextResponse.json(result);
}
