import { NextResponse } from 'next/server';
import { runIRSVerification } from '@/lib/matrix-world';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId } = body;

    const result = runIRSVerification(taskId);

    if (!result) {
      return NextResponse.json(
        { ok: false, message: 'Task not found or verification failed to run.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error('IRS verify error:', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to run IRS verification.' },
      { status: 500 }
    );
  }
}
