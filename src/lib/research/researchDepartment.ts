import type {
  ResearchJob,
  ResearchLinkInput,
  ResearchMode,
  ResearchSourceType,
  DecisionMode,
} from '@/types/research';
import {
  buildAutomaticSearchUrl,
  buildSummaryPack,
  captureThreeScreenshots,
  detectResearchSourceType,
  publishSummaryToTargets,
  uploadScreenshotsToIPFS,
} from '@/lib/research/researchAdapters';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function createResearchInput(url: string): ResearchLinkInput {
  return {
    id: makeId('RIN'),
    url,
    sourceType: detectResearchSourceType(url),
    createdAt: now(),
  };
}

export function resolveResearchUrl(params: {
  decisionMode: DecisionMode;
  manualUrl: string;
  agentFrontName: string;
  automaticDecisionEnabled: boolean;
}) {
  if (params.decisionMode === 'RED') {
    return params.manualUrl.trim();
  }

  if (params.decisionMode === 'BLUE' && params.automaticDecisionEnabled) {
    return buildAutomaticSearchUrl(params.agentFrontName);
  }

  return '';
}

export function createQueuedResearchJob(params: {
  inputId: string;
  mode: ResearchMode;
  sourceType: ResearchSourceType;
  decisionMode: DecisionMode;
}): ResearchJob {
  return {
    id: makeId('RJB'),
    inputId: params.inputId,
    mode: params.mode,
    decisionMode: params.decisionMode,
    status: 'queued',
    sourceType: params.sourceType,
    screenshots: [],
    summaryPack: null,
    publishedTargets: [],
    errorMessage: null,
    createdAt: now(),
    updatedAt: now(),
  };
}

export async function runResearchPipeline(params: {
  job: ResearchJob;
  input: ResearchLinkInput;
}) {
  try {
    const screenshots = await captureThreeScreenshots({
      url: params.input.url,
      mode: params.job.mode,
    });

    const uploaded = await uploadScreenshotsToIPFS(
      screenshots,
      `${params.job.id}:${params.input.url}`
    );

    const summaryPack = await buildSummaryPack({
      url: params.input.url,
      sourceType: params.input.sourceType,
      screenshots: uploaded,
    });

    const publishedTargets = await publishSummaryToTargets({
      summary: summaryPack,
      targets: ['youtube', 'x', 'facebook'],
    });

    const completedJob: ResearchJob = {
      ...params.job,
      status: 'done',
      screenshots: uploaded,
      summaryPack,
      publishedTargets,
      updatedAt: now(),
    };

    return completedJob;
  } catch (error) {
    const failedJob: ResearchJob = {
      ...params.job,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown research pipeline error',
      updatedAt: now(),
    };

    return failedJob;
  }
}

export class runResearchPipelineStub { static async execute() { return {}; } }
