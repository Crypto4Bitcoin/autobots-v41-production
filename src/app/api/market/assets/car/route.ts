import { NextResponse } from 'next/server';
import { createVehiclePlaceholder } from '@/lib/autobots-market';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const asset = createVehiclePlaceholder({
      creatorId: body.creatorId || 'TEAM-VEHICLE-001',
      title: body.title || 'Market Car Placeholder',
      description:
        body.description || 'Temporary vehicle representation using IPFS picture storage.',
    });

    return NextResponse.json({
      ok: true,
      asset,
    });
  } catch (error) {
    console.error('vehicle placeholder error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to create car placeholder asset.' },
      { status: 500 }
    );
  }
}
