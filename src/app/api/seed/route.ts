import { NextResponse } from 'next/server';
import { executeAction } from '@/lib/action-executor';

export async function POST() {
  const result = await executeAction({ intent: 'seed-database', divisionSlug: 'system' });
  return NextResponse.json(result);
}
