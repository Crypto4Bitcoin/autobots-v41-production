import { NextResponse } from 'next/server';
import { beginTask } from '@/lib/matrix-world';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId } = body;

    const task = beginTask(taskId);

    if (!task) {
      return NextResponse.json(
        { ok: false, message: 'Task not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      task,
    });
  } catch (error) {
    console.error('Start task error:', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to start task.' },
      { status: 500 }
    );
  }
}
