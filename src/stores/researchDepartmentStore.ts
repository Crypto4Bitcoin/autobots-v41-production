import { create } from 'zustand';
import type {
  ResearchDepartmentState,
  ResearchMode,
  ResearchJob,
  DecisionMode,
} from '@/types/research';
import {
  createQueuedResearchJob,
  createResearchInput,
  resolveResearchUrl,
  runResearchPipeline,
} from '@/lib/research/researchDepartment';

type ResearchDepartmentActions = {
  setCurrentInputUrl: (url: string) => void;
  setDecisionMode: (mode: DecisionMode) => void;
  setAutomaticDecisionEnabled: (value: boolean) => void;
  setSelectedMode: (mode: ResearchMode) => void;
  setAgentFrontName: (value: string) => void;
  submitResearch: () => Promise<ResearchJob | null>;
  clearResearchJobs: () => void;
};

type ResearchDepartmentStore = ResearchDepartmentState & ResearchDepartmentActions;

export const useResearchDepartmentStore = create<ResearchDepartmentStore>((set, get) => ({
  departmentId: 'RESEARCH-DEPT-001',
  decisionMode: 'RED',
  automaticDecisionEnabled: true,
  selectedMode: 'e2e',
  status: 'idle',
  currentInputUrl: '',
  agentFrontName: 'Alpha',
  inputs: [],
  jobs: [],
  lastRunAt: null,

  setCurrentInputUrl: (url) => {
    set({ currentInputUrl: url });
  },

  setDecisionMode: (mode) => {
    set({ decisionMode: mode });
  },

  setAutomaticDecisionEnabled: (value) => {
    set({ automaticDecisionEnabled: value });
  },

  setSelectedMode: (mode) => {
    set({ selectedMode: mode });
  },

  setAgentFrontName: (value) => {
    set({ agentFrontName: value });
  },

  submitResearch: async () => {
    const {
      currentInputUrl,
      decisionMode,
      selectedMode,
      agentFrontName,
      automaticDecisionEnabled,
    } = get();

    const resolvedUrl = resolveResearchUrl({
      decisionMode,
      manualUrl: currentInputUrl,
      agentFrontName,
      automaticDecisionEnabled,
    });

    if (!resolvedUrl) return null;

    const input = createResearchInput(resolvedUrl);
    const queuedJob = createQueuedResearchJob({
      inputId: input.id,
      mode: selectedMode,
      sourceType: input.sourceType,
      decisionMode,
    });

    set({
      status: 'running',
      inputs: [input, ...get().inputs],
      jobs: [queuedJob, ...get().jobs],
      lastRunAt: new Date().toISOString(),
    });

    const processingJob: ResearchJob = {
      ...queuedJob,
      status: 'processing',
      updatedAt: new Date().toISOString(),
    };

    set({
      jobs: get().jobs.map((job) => (job.id === queuedJob.id ? processingJob : job)),
    });

    const completed = await runResearchPipeline({
      job: processingJob,
      input,
    });

    set({
      status: completed.status === 'failed' ? 'error' : 'idle',
      jobs: get().jobs.map((job) => (job.id === completed.id ? completed : job)),
      lastRunAt: new Date().toISOString(),
    });

    return completed;
  },

  clearResearchJobs: () => {
    set({
      jobs: [],
      inputs: [],
      status: 'idle',
    });
  },
}));
