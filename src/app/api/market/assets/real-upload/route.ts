import { NextResponse } from 'next/server';
import { createRealWorldUpload } from '@/lib/autobots-market';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const asset = createRealWorldUpload({
      userId: body.userId || 'REAL-USER-001',
      title: body.title || 'Untitled Upload',
      description: body.description || 'Real-world upload stored as IPFS state object.',
      kind: body.kind || 'real_upload',
    });

    return NextResponse.json({
      ok: true,
      asset,
    });
  } catch (error) {
    console.error('real upload error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to create real-world upload.' },
      { status: 500 }
    );
  }
}
