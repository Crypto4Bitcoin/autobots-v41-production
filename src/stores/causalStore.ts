import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface CausalSignal {
  id: string;
  event: string;
  timestamp: number;
  severity: 'nominal' | 'warning' | 'critical';
  source_layer: string;
}

interface CausalState {
  graph: CausalSignal[];
  selectedChain: CausalSignal[];
  narrative: string;
  isSyncing: boolean;
}

interface CausalActions {
  inspectEvent: (id: string) => void;
  generateCausalChain: () => void;
  syncCausal: () => void;
}

export type CausalStoreType = CausalState & CausalActions;

export const useCausalStore = create<CausalStoreType>((set, get) => ({
  graph: [
    { id: 'sig-01', event: 'Neural Calibration', timestamp: Date.now(), severity: 'nominal', source_layer: 'Core' },
    { id: 'sig-02', event: 'Shard Desync', timestamp: Date.now() - 5000, severity: 'warning', source_layer: 'Relay' },
    { id: 'sig-03', event: 'Sovereign Lock', timestamp: Date.now() - 10000, severity: 'nominal', source_layer: 'Governance' }
  ],
  selectedChain: [],
  narrative: "",
  isSyncing: false,

  inspectEvent: (id) => {
    const signal = get().graph.find(s => s.id === id);
    if (signal) {
        set({ selectedChain: [signal], narrative: `Causal lineage for ${signal.event} trace confirmed. Temporal parity locked.` });
    }
  },

  generateCausalChain: () => {
    set({ isSyncing: true });
    setTimeout(() => {
        set({ isSyncing: false });
        GlobalMemory.record("CAUSAL", "New causal chain generated. Universal temporal parity synchronized.", 100);
    }, 2000);
  },

  syncCausal: () => {
    GlobalMemory.record("CAUSAL", "Omniversal causal mesh synchronized. All temporal models aligned.", 100);
  }
}));
