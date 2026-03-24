import { NextResponse } from 'next/server';
import { updateAutoposterControl, getAutoposterControl } from '@/lib/autobots-market';

export async function GET() {
  return NextResponse.json({
    ok: true,
    control: getAutoposterControl(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const control = updateAutoposterControl({
      mode: body.mode,
      enabled: body.enabled,
      releaseEveryMinutes: body.releaseEveryMinutes ?? null,
    });

    return NextResponse.json({
      ok: true,
      control,
    });
  } catch (error) {
    console.error('autoposter control error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to update autoposter control.' },
      { status: 500 }
    );
  }
}
