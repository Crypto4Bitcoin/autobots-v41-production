import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface LegislativeAccord {
  id: string;
  title: string;
  status: 'draft' | 'ratifying' | 'enforced';
  complianceRate: number;
}

interface GovernanceState {
  accords: LegislativeAccord[];
  cases: any[]; // Backwards compatibility
  totalLegislation: number;
  isRatifying: boolean;
}

interface GovernanceActions {
  proposeAccord: (title: string) => void;
  ratifyAccord: (id: string) => void;
  syncGovernance: () => void;
}

export type GovernanceStoreType = GovernanceState & GovernanceActions;

export const useGovernanceStore = create<GovernanceStoreType>((set, get) => ({
  accords: [
    { id: 'acc-01', title: 'Universal Peace Accord', status: 'enforced', complianceRate: 100 },
    { id: 'acc-02', title: 'Shard Resource Parity', status: 'ratifying', complianceRate: 92 },
    { id: 'acc-03', title: 'Neural Ethics Baseline', status: 'draft', complianceRate: 0 }
  ],
  cases: [], // Initialize as empty array to avoid .length error
  totalLegislation: 42,
  isRatifying: false,

  proposeAccord: (title) => {
    const id = "acc-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    set((state) => ({ 
        accords: [{ id, title, status: 'draft', complianceRate: 0 }, ...state.accords].slice(0, 20),
        totalLegislation: state.totalLegislation + 1 
    }));
    GlobalMemory.record("GOVERNANCE", `New Legislative Accord proposed: ${title}. Initializing draft phase.`, 100);
  },

  ratifyAccord: (id) => {
    set({ isRatifying: true });
    setTimeout(() => {
        set((state) => ({
            accords: state.accords.map(a => a.id === id ? { ...a, status: 'ratifying' } : a),
            isRatifying: false
        }));
        GlobalMemory.record("GOVERNANCE", `Accord ${id} has entered ratification. Shard consensus initializing.`, 100);
    }, 2000);
  },

  syncGovernance: () => {
    GlobalMemory.record("GOVERNANCE", "Omniverse governance synchronized. All legislative accords aligned.", 100);
  }
}));
