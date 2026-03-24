import { NextResponse } from 'next/server';
import { getMarketSnapshot } from '@/lib/autobots-market';

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      snapshot: getMarketSnapshot(),
    });
  } catch (error) {
    console.error('market snapshot error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to load market snapshot.' },
      { status: 500 }
    );
  }
}
