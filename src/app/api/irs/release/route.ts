import { NextResponse } from 'next/server';
import { releaseWorkerFromJail } from '@/lib/matrix-world';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workerId } = body;

    const worker = releaseWorkerFromJail(workerId);

    if (!worker) {
      return NextResponse.json(
        { ok: false, message: 'Worker not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      worker,
    });
  } catch (error) {
    console.error('IRS release error:', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to release worker.' },
      { status: 500 }
    );
  }
}
