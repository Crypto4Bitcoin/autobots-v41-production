import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface Discovery {
  id: string;
  topic: string;
  source: string;
  confidence: number;
  status: 'scanning' | 'verified';
}

interface ResearchState {
  discoveries: Discovery[];
  totalInsights: number;
  isScanning: boolean;
}

interface ResearchActions {
  initiateDiscovery: (topic: string) => void;
  verifyDiscovery: (id: string) => void;
  syncResearch: () => void;
}

export type ResearchStoreType = ResearchState & ResearchActions;

export const useResearchStore = create<ResearchStoreType>((set, get) => ({
  discoveries: [
    { id: 'disc-01', topic: 'Neural Lattice Decay', source: 'Shard-A', confidence: 94, status: 'verified' },
    { id: 'disc-02', topic: 'Quantum Lock Fault', source: 'Relay-G', confidence: 72, status: 'scanning' }
  ],
  totalInsights: 1542,
  isScanning: false,

  initiateDiscovery: (topic) => {
    set({ isScanning: true });
    setTimeout(() => {
        set((state) => ({
            isScanning: false,
            totalInsights: state.totalInsights + 1,
            discoveries: [
                ...state.discoveries,
                { id: `disc-${state.discoveries.length + 1}`, topic, source: 'Omniverse Scanner', confidence: 99, status: 'verified' }
            ]
        }));
        GlobalMemory.record("RESEARCH", `New discovery initiated: ${topic}. Civilizational knowledge mesh updated.`, 100);
    }, 2000);
  },

  verifyDiscovery: (id) => {
    set((state) => ({
        discoveries: state.discoveries.map(d => d.id === id ? { ...d, status: 'verified' } : d)
    }));
    GlobalMemory.record("RESEARCH", `Discovery ${id} verified. Knowledge parity locked.`, 100);
  },

  syncResearch: () => {
    GlobalMemory.record("RESEARCH", "Omniversal research synchronized. All discovery models aligned.", 100);
  }
}));
