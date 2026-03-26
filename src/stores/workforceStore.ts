import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { useEconomyStore } from './economyStore';

export interface WorkforceAgent {
  id: string;
  name: string;
  role: 'Content' | 'Finance' | 'Research' | 'Compliance' | 'Sales';
  status: 'idle' | 'active' | 'syncing';
  efficiency: number;
}

export interface WorkforceJob {
  id: string;
  title: string;
  role: 'Content' | 'Finance' | 'Research' | 'Compliance' | 'Sales';
  status: 'idle' | 'active' | 'complete' | 'failed';
  value: number; // Value in Sovereign Credits
}

interface WorkforceState {
  agents: WorkforceAgent[];
  jobs: WorkforceJob[];
  totalValueGenerated: number;
  studyMode: boolean;
  isMetaBrainActive: boolean;
}

interface WorkforceActions {
  assignJob: (jobId: string, agentId: string) => void;
  executeJob: (jobId: string) => void;
  optimizeAgents: () => void;
  toggleStudyMode: () => void;
  activateMetaBrain: () => void;
}

export type WorkforceStoreType = WorkforceState & WorkforceActions;

export const useWorkforceStore = create<WorkforceStoreType>((set, get) => ({
  agents: [
    { id: 'a-01', name: 'Neural-Scribe', role: 'Content', status: 'idle', efficiency: 94.2 },
    { id: 'a-02', name: 'Al-Khwarizmi', role: 'Finance', status: 'idle', efficiency: 99.8 },
    { id: 'a-03', name: 'Heisenberg-0', role: 'Research', status: 'idle', efficiency: 91.4 },
    { id: 'a-04', name: 'Law-OS', role: 'Compliance', status: 'idle', efficiency: 98.6 },
    { id: 'a-05', name: 'Mercury-Outreach', role: 'Sales', status: 'idle', efficiency: 92.9 }
  ],
  jobs: [
    { id: 'j-01', title: 'Viral Script Generation', role: 'Content', status: 'idle', value: 450 },
    { id: 'j-02', title: 'Prosperity Mesh Audit', role: 'Finance', status: 'idle', value: 1200 },
    { id: 'j-03', title: 'Market Sentiment Scan', role: 'Research', status: 'idle', value: 800 },
    { id: 'j-04', title: 'GDPR-Mesh Compliance', role: 'Compliance', status: 'idle', value: 1500 },
    { id: 'j-05', title: 'Outbound Referral Funnel', role: 'Sales', status: 'idle', value: 2400 }
  ],
  totalValueGenerated: 0,
  studyMode: false,
  isMetaBrainActive: false,

  assignJob: (jobId, agentId) => {
    set((state) => ({
      jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: 'active' } : j),
      agents: state.agents.map(a => a.id === agentId ? { ...a, status: 'active' } : a)
    }));
    GlobalMemory.record('WORKFORCE', `Job ${jobId} assigned to agent ${agentId}.`, 80);
  },

  executeJob: (jobId) => {
    const job = get().jobs.find(j => j.id === jobId);
    if (!job || job.status === 'complete') return;

    // 1. Mark Job Complete
    set((state) => ({
      jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: 'complete' } : j),
      totalValueGenerated: state.totalValueGenerated + job.value
    }));

    // 2. Inject Value into Economy (Prosperity Gain)
    useEconomyStore.getState().purchaseCredits(job.value);

    // 3. Emit IRS Pulse (Truth preservation)
    useEconomyStore.getState().recordPulse(`WORKFORCE_${job.role.toUpperCase()}`, job.value);

    // 4. Record to Global Memory
    GlobalMemory.record('WORKFORCE', `Execution complete: ${job.title}. Value Generated: ${job.value} Credits.`, 100);
  },

  optimizeAgents: () => {
    set((state) => ({
      agents: state.agents.map(a => ({ ...a, efficiency: Math.min(100, a.efficiency + 2) }))
    }));
    GlobalMemory.record('WORKFORCE', 'Agent efficiency optimized. Universal productivity increased.', 100);
  },

  toggleStudyMode: () => {
    set((state) => ({ studyMode: !state.studyMode }));
  },

  activateMetaBrain: () => {
    set({ isMetaBrainActive: true });
    GlobalMemory.record('WORKFORCE', 'Meta-Brain Aggregator activated. Collective intelligence online.', 100);
  }
}));