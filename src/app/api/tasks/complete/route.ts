import { NextResponse } from 'next/server';
import { bridgeToPublicIPFS, storeInPrivateIPFS } from '@/lib/ipfs-bridge';
import { completeTaskAndReward, runIRSVerification } from '@/lib/matrix-world';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      workerId,
      taskId,
      fileName = 'task-output.json',
      content = '{}',
      publishPublic = false,
      autoIRS = true,
    } = body;

    const privateResult = await storeInPrivateIPFS({
      workerId,
      taskId,
      fileName,
      content,
    });

    let finalResult = privateResult;

    if (publishPublic) {
      finalResult = await bridgeToPublicIPFS({
        workerId,
        taskId,
        fileName,
        content,
      });
    }

    const completed = completeTaskAndReward({
      taskId,
      fileName,
      cid: finalResult.cid,
      storageMode: finalResult.network,
      pinned: finalResult.pinned,
      verified: finalResult.verified,
    });

    if (!completed) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Task completion failed.',
        },
        { status: 404 }
      );
    }

    let irsResult = null;

    if (autoIRS) {
      irsResult = runIRSVerification(taskId);
    }

    return NextResponse.json({
      ok: true,
      autoIRS,
      storage: finalResult,
      completed,
      irsResult,
    });
  } catch (error) {
    console.error('Complete task error:', error);

    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to complete task.',
      },
      { status: 500 }
    );
  }
}
