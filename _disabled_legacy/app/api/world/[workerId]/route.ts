import { NextResponse } from 'next/server';
import { getWorldSnapshot } from '@/lib/matrix-world';

type Context = {
  params: Promise<{ workerId: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const { workerId } = await context.params;
    const snapshot = getWorldSnapshot(workerId);

    if (!snapshot) {
      return NextResponse.json(
        { ok: false, message: 'Worker not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      snapshot,
    });
  } catch (error) {
    console.error('World snapshot error:', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to load world snapshot.' },
      { status: 500 }
    );
  }
}
