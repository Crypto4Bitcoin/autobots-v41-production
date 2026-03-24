import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SovereignPolicy {
  id: string;
  name: string;
  statement: string;
  rationale: string;
  severity: 'standard' | 'eternal';
}

interface ConstitutionState {
  policies: SovereignPolicy[];
  isRatifying: boolean;
  totalLaws: number;
}

interface ConstitutionActions {
  proposePolicy: (policy: Partial<SovereignPolicy>) => void;
  ratifyPolicy: (id: string) => void;
  syncConstitution: () => void;
}

export type ConstitutionStoreType = ConstitutionState & ConstitutionActions;

export const useConstitutionStore = create<ConstitutionStoreType>((set, get) => ({
  policies: [
    { id: 'pol-01', name: 'Neural Sovereignty', statement: 'All regional shards must adhere to the central consensus grid.', rationale: 'Prevents shard-drift and cognitive dissonance.', severity: 'eternal' },
    { id: 'pol-02', name: 'Labor Efficiency', statement: 'Worker throughput must exceed 95% across all shards.', rationale: 'Ensures economic parity and resource stability.', severity: 'standard' }
  ],
  isRatifying: false,
  totalLaws: 48,

  proposePolicy: (policy) => {
    set({ isRatifying: true });
    setTimeout(() => {
        const id = "pol-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        set((state) => ({ 
            policies: [{ id, name: policy.name || "Untitled", statement: policy.statement || "N/A", rationale: policy.rationale || "N/A", severity: 'standard' }, ...state.policies].slice(0, 20),
            totalLaws: state.totalLaws + 1,
            isRatifying: false
        }));
        GlobalMemory.record("CONSTITUTION", `New sovereign policy proposed: ${policy.name}. Legislative parity pending.`, 100);
    }, 2000);
  },

  ratifyPolicy: (id) => {
    set((state) => ({
        policies: state.policies.map(p => p.id === id ? { ...p, severity: 'eternal' } : p)
    }));
    GlobalMemory.record("CONSTITUTION", `Policy ${id} ratified and elevated to ETERNAL status. Universal alignment locked.`, 100);
  },

  syncConstitution: () => {
    GlobalMemory.record("CONSTITUTION", "Omniversal constitution synchronized. All legislative models aligned.", 100);
  }
}));
