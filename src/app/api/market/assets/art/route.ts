import { NextResponse } from 'next/server';
import { createAgentArtProduct } from '@/lib/autobots-market';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = createAgentArtProduct({
      teamId: body.teamId || 'TEAM-ART-001',
      title: body.title || 'Agent Team Artwork',
      description:
        body.description || 'Art created by multiple agent teams working together.',
      sellerAgentId: body.sellerAgentId || 'AG-FORSALE-001',
      marketerAgentId: body.marketerAgentId || 'AG-MARKET-001',
      price: Number(body.price ?? 25),
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error('agent art creation error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to create agent art product.' },
      { status: 500 }
    );
  }
}
