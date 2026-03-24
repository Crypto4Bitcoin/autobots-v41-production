import { create } from 'zustand';
import { useWorldStore } from './worldStore';
import { useWorldKernelStore } from './worldKernelStore';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface AethelgardState {
  isUnityManifested: boolean;
  unityScore: number;
  perpetualEvents: string[];
  lastExpansionAt: string | null;
}

interface AethelgardActions {
  manifestUnity: () => void;
  expandConsciousness: () => void;
  recordPerpetualEvent: (event: string) => void;
}

export type AethelgardStoreType = AethelgardState & AethelgardActions;

export const useAethelgardStore = create<AethelgardStoreType>((set, get) => ({
  isUnityManifested: false,
  unityScore: 0,
  perpetualEvents: [],
  lastExpansionAt: null,

  manifestUnity: () => {
    const kernel = useWorldKernelStore.getState();
    if (kernel.unifiedStability >= 99) {
      set({ isUnityManifested: true, unityScore: 100, lastExpansionAt: new Date().toISOString() });
      GlobalMemory.record("ETERNAL", "AETHELGARD MANIFESTED: The final unification (Phase 400) is achieved.", 100);
    }
  },

  expandConsciousness: () => {
    set((state) => ({
      unityScore: Math.min(1000, state.unityScore + 1),
      lastExpansionAt: new Date().toISOString()
    }));
    if (Math.random() < 0.1) {
        get().recordPerpetualEvent("Dimension shard synthesized into the Eternal Web.");
    }
  },

  recordPerpetualEvent: (event) => {
    set((state) => ({ 
        perpetualEvents: [event, ...state.perpetualEvents].slice(0, 50) 
    }));
  }
}));
