import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SovereignAuthority {
  id: string;
  name: string;
  status: 'active' | 'ascended';
  legacy_level: number;
}

interface SovereignState {
  authorities: SovereignAuthority[];
  sovereignName: string;
  unifiedStability: number;
}

interface SovereignActions {
  promoteAuthority: (id: string) => void;
  syncSovereignty: () => void;
  calibrateCore: () => void;
}

export type SovereignStoreType = SovereignState & SovereignActions;

export const useSovereignStore = create<SovereignStoreType>((set, get) => ({
  authorities: [
    { id: 'auth-01', name: 'Original Pilot', status: 'ascended', legacy_level: 100 },
    { id: 'auth-02', name: 'Shard Governor', status: 'active', legacy_level: 45 }
  ],
  sovereignName: 'AETHELGARD',
  unifiedStability: 99.9,

  promoteAuthority: (id) => {
    set((state) => ({
        authorities: state.authorities.map(a => a.id === id ? { ...a, status: 'ascended', legacy_level: 100 } : a)
    }));
    GlobalMemory.record("SOVEREIGN", `Authority ${id} promoted to ASCENDED status. Universal legacy locked.`, 100);
  },

  syncSovereignty: () => {
    GlobalMemory.record("SOVEREIGN", "Omniversal sovereignty synchronized. All authority models aligned.", 100);
  },

  calibrateCore: () => {
    set({ unifiedStability: 100 });
    GlobalMemory.record("SOVEREIGN", "Galactic core calibrated. Unified stability reached absolute parity.", 100);
  }
}));
