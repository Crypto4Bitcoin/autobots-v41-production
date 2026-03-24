import { NextResponse } from 'next/server';
import { createMatrixWorker, assignInitialComputerTask } from '@/lib/matrix-world';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = body?.username || 'guest-user';

    const worker = createMatrixWorker(username);
    const task = assignInitialComputerTask(worker.id);

    return NextResponse.json({
      ok: true,
      message: 'Worker created and assigned to Matrix computer lane.',
      worker,
      task,
    });
  } catch (error) {
    console.error('Matrix onboarding error:', error);

    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to create matrix worker.',
      },
      { status: 500 }
    );
  }
}
