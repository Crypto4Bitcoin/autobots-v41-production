import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface ChaosDrill {
  id: string;
  name: string;
  type: string;
  impact: number;
  status: 'idle' | 'running';
}

interface ChaosState {
  drills: ChaosDrill[];
  chaosLevel: number;
  isInjecting: boolean;
}

interface ChaosActions {
  injectChaos: (id: string) => void;
  stabilizeReality: () => void;
  syncChaos: () => void;
}

export type ChaosStoreType = ChaosState & ChaosActions;

export const useChaosStore = create<ChaosStoreType>((set, get) => ({
  drills: [
    { id: 'drill-01', name: 'Neural Storm', type: 'COGNITIVE', impact: 45, status: 'idle' },
    { id: 'drill-02', name: 'Shard Splinter', type: 'STRUCTURAL', impact: 85, status: 'idle' }
  ],
  chaosLevel: 0,
  isInjecting: false,

  injectChaos: (id) => {
    set((state) => ({
        isInjecting: true,
        drills: state.drills.map(d => d.id === id ? { ...d, status: 'running' } : d),
        chaosLevel: Math.min(100, state.chaosLevel + 35)
    }));
    GlobalMemory.record("CHAOS", `Chaos injection initiated (Drill: ${id}). Civilizational resilience being stress-tested.`, 100);
  },

  stabilizeReality: () => {
    set((state) => ({
        chaosLevel: 0,
        isInjecting: false,
        drills: state.drills.map(d => ({ ...d, status: 'idle' }))
    }));
    GlobalMemory.record("CHAOS", "Reality stabilization complete. All shards returned to nominal parity.", 100);
  },

  syncChaos: () => {
    GlobalMemory.record("CHAOS", "Omniversal chaos mesh synchronized. All entropy models aligned.", 100);
  }
}));
