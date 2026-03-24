import { NextResponse } from 'next/server';
import { autoposterReleaseNext } from '@/lib/autobots-market';

export async function POST() {
  try {
    const result = autoposterReleaseNext();

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error('autoposter release error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to release assets.' },
      { status: 500 }
    );
  }
}
