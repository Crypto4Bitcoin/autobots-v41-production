import { NextResponse } from 'next/server';
import {
  createQueuedResearchJob,
  createResearchInput,
  resolveResearchUrl,
  runResearchPipeline,
} from '@/lib/research/researchDepartment';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const decisionMode = body.decisionMode === 'BLUE' ? 'BLUE' : 'RED';
    const manualUrl = String(body.url ?? '');
    const agentFrontName = String(body.agentFrontName ?? 'Alpha');
    const automaticDecisionEnabled = Boolean(body.automaticDecisionEnabled ?? true);
    const mode = body.mode === 'control-screen' ? 'control-screen' : 'e2e';

    const resolvedUrl = resolveResearchUrl({
      decisionMode,
      manualUrl,
      agentFrontName,
      automaticDecisionEnabled,
    });

    if (!resolvedUrl) {
      return NextResponse.json(
        { ok: false, message: 'No resolved research URL.' },
        { status: 400 }
      );
    }

    const input = createResearchInput(resolvedUrl);
    const job = createQueuedResearchJob({
      inputId: input.id,
      mode,
      sourceType: input.sourceType,
      decisionMode,
    });

    const completed = await runResearchPipeline({
      job: {
        ...job,
        status: 'processing',
      },
      input,
    });

    return NextResponse.json({
      ok: true,
      input,
      job: completed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Research route failed.',
      },
      { status: 500 }
    );
  }
}
