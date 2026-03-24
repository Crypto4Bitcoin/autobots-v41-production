import { create } from 'zustand';
import type {
  InternetResearchTeamState,
  InternetResearchJob,
  InternetResearchBrain,
} from '@/types/internetResearch';
import { runInternetResearchJob } from '@/lib/research/internetResearchPipeline';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function buildBrain(teamId: string): InternetResearchBrain {
  return {
    id: `BRN-${teamId}`,
    teamId,
    maxAssets: 1000,
    storedAssets: 0,
    storagePercent: 0,
    valueScore: 0,
    linksStored: 0,
    picturesStored: 0,
    locked: true,
  };
}

type InternetResearchTeamActions = {
  setEnabled: (value: boolean) => void;
  setCurrentQuery: (value: string) => void;
  runJob: () => Promise<InternetResearchJob | null>;
  clearJobs: () => void;
};

type InternetResearchTeamStore = InternetResearchTeamState & InternetResearchTeamActions;

export const useInternetResearchTeamStore = create<InternetResearchTeamStore>((set, get) => ({
  teamId: 'TEAM-INTERNET-RESEARCH-001',
  teamName: 'InternetResearchAgent Team',
  enabled: true,
  currentQuery: '',
  jobs: [],
  brain: buildBrain('TEAM-INTERNET-RESEARCH-001'),
  lastRunAt: null,

  setEnabled: (value) => {
    set({ enabled: value });
  },

  setCurrentQuery: (value) => {
    set({ currentQuery: value });
  },

  runJob: async () => {
    const { enabled, currentQuery, teamId, brain } = get();

    if (!enabled || !currentQuery.trim()) return null;

    const queuedJob: InternetResearchJob = {
      id: makeId('IRJ'),
      sourceQuery: currentQuery,
      status: 'queued',
      assets: [],
      composedPack: null,
      verified: false,
      marketPack: null,
      createdAt: now(),
      updatedAt: now(),
    };

    set({
      jobs: [queuedJob, ...get().jobs],
      lastRunAt: now(),
    });

    const finished = await runInternetResearchJob(queuedJob);

    const linksStored = finished.assets.filter((a) => a.type === 'link').length;
    const picturesStored = finished.assets.filter((a) => a.type === 'picture').length;
    const newStoredAssets = Math.min(brain.maxAssets, brain.storedAssets + finished.assets.length);

    const nextBrain: InternetResearchBrain = {
      ...brain,
      storedAssets: newStoredAssets,
      storagePercent: Math.floor((newStoredAssets / brain.maxAssets) * 100),
      linksStored: brain.linksStored + linksStored,
      picturesStored: brain.picturesStored + picturesStored,
      valueScore: brain.valueScore + finished.assets.length * 2 + (finished.verified ? 10 : 0),
    };

    set({
      jobs: get().jobs.map((job) => (job.id === queuedJob.id ? finished : job)),
      brain: nextBrain,
      lastRunAt: now(),
    });

    return finished;
  },

  clearJobs: () => {
    set({
      jobs: [],
      lastRunAt: null,
    });
  },
}));