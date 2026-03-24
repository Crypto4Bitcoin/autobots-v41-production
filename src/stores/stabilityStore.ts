import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface StabilityDomain {
  name: string;
  score: number;
  status: 'nominal' | 'calibrating' | 'locked';
}

interface StabilityState {
  domains: StabilityDomain[];
  globalResilience: number;
}

interface StabilityActions {
  runDrill: (domainName: string) => void;
  calibrateReality: () => void;
  syncStability: () => void;
}

export type StabilityStoreType = StabilityState & StabilityActions;

export const useStabilityStore = create<StabilityStoreType>((set, get) => ({
  domains: [
    { name: 'Neural Nexus', score: 100, status: 'locked' },
    { name: 'Resource Grid', score: 95, status: 'nominal' },
    { name: 'Shard Consensus', score: 98, status: 'nominal' }
  ],
  globalResilience: 98.4,

  runDrill: (domainName) => {
    set((state) => ({
        domains: state.domains.map(d => d.name === domainName ? { ...d, status: 'calibrating' } : d)
    }));
    setTimeout(() => {
        set((state) => ({
            domains: state.domains.map(d => d.name === domainName ? { ...d, score: 100, status: 'locked' } : d),
            globalResilience: Math.min(100, state.globalResilience + 0.5)
        }));
        GlobalMemory.record("STABILITY", `Stability drill completed in ${domainName}. Resilience parity restored.`, 100);
    }, 2000);
  },

  calibrateReality: () => {
    set({ globalResilience: 100 });
    GlobalMemory.record("STABILITY", "Omniversal reality calibrated. All stability models aligned at 100% parity.", 100);
  },

  syncStability: () => {
    GlobalMemory.record("STABILITY", "Omniversal stability synchronized. All equilibrium models aligned.", 100);
  }
}));
