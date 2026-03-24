import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SovereignAgreement {
  id: string;
  parties: string[];
  resource: string;
  status: 'negotiating' | 'finalized';
}

interface DiplomacyState {
  agreements: SovereignAgreement[];
  totalNegotiations: number;
  isNegotiating: boolean;
}

interface DiplomacyActions {
  proposeAgreement: (parties: string[], resource: string) => void;
  finalizeAgreement: (id: string) => void;
  syncDiplomacy: () => void;
}

export type DiplomacyStoreType = DiplomacyState & DiplomacyActions;

export const useDiplomacyStore = create<DiplomacyStoreType>((set, get) => ({
  agreements: [
    { id: 'acc-01', parties: ['Alpha Prime', 'Omega Shard'], resource: 'Neural Shards', status: 'finalized' },
    { id: 'acc-02', parties: ['Beta Core', 'Gamma Relay'], resource: 'Labour Grid', status: 'negotiating' }
  ],
  totalNegotiations: 4822,
  isNegotiating: false,

  proposeAgreement: (parties, resource) => {
    set({ isNegotiating: true });
    setTimeout(() => {
        const id = "acc-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        set((state) => ({ 
            agreements: [{ id, parties, resource, status: 'negotiating' }, ...state.agreements].slice(0, 20),
            totalNegotiations: state.totalNegotiations + 1,
            isNegotiating: false
        }));
        GlobalMemory.record("DIPLOMACY", `New sovereign accord proposed for ${resource}. Legislative parity pending.`, 100);
    }, 2000);
  },

  finalizeAgreement: (id) => {
    set((state) => ({
        agreements: state.agreements.map(a => a.id === id ? { ...a, status: 'finalized' } : a)
    }));
    GlobalMemory.record("DIPLOMACY", `Accord ${id} finalized and elevated to ETERNAL status. Universal alliance locked.`, 100);
  },

  syncDiplomacy: () => {
    GlobalMemory.record("DIPLOMACY", "Omniversal diplomacy synchronized. All legislative models aligned.", 100);
  }
}));
