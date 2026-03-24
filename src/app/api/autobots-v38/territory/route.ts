
import { NextRequest, NextResponse } from 'next/server';
import { v38NarrativeTerritoryAgent } from '@/lib/autobots-v38/agents/v38-narrative-territory.agent';

export async function GET() {
  const metrics = await v38NarrativeTerritoryAgent.metrics();
  return NextResponse.json({ metrics });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  switch (body.action) {
    case 'create_territory':
      return NextResponse.json({ result: await v38NarrativeTerritoryAgent.createTerritory(body) });

    case 'record_influence':
      return NextResponse.json({ result: await v38NarrativeTerritoryAgent.recordInfluence(body) });

    case 'conflict':
      return NextResponse.json({ result: await v38NarrativeTerritoryAgent.conflict(body.a, body.b, body.reason) });

    default:
      return NextResponse.json({ error: 'Unknown territory action' }, { status: 400 });
  }
}
