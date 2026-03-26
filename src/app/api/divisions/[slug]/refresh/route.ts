import { NextResponse } from 'next/server';
import { executeAction } from '@/lib/action-executor';

export async function POST(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const result = await executeAction({ intent: 'refresh-signals', divisionSlug: slug });
  return NextResponse.json(result);
}
