import { NextResponse } from 'next/server';
import { executeAction } from '@/lib/action-executor';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { divisionSlug?: string };
  const divisionSlug = body.divisionSlug ?? 'loophole-detection';
  const result = await executeAction({ intent: 'run-simulation', divisionSlug });
  return NextResponse.json(result);
}
