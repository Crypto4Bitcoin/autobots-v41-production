import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enqueueRefreshSignals } from '@/lib/jobs/refresh-division';
import { enqueueSimulation } from '@/lib/jobs/run-simulation';
import { enqueueIntegrityScan } from '@/lib/jobs/run-integrity-scan';

const schema = z.object({
  jobType: z.enum(['refresh-signals', 'run-simulation', 'periodic-integrity-scan']),
  divisionSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Invalid job request.' }, { status: 400 });
  }

  const { jobType, divisionSlug } = parsed.data;

  if (jobType === 'refresh-signals') {
    return NextResponse.json(await enqueueRefreshSignals(divisionSlug));
  }
  if (jobType === 'run-simulation') {
    return NextResponse.json(await enqueueSimulation(divisionSlug));
  }
  return NextResponse.json(await enqueueIntegrityScan(divisionSlug));
}
