import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface WorkforceUnit {
  id: string;
  role: string;
  status: 'active' | 'syncing' | 'idle';
  efficiency: number;
}

interface WorkforceState {
  units: WorkforceUnit[];
  collectiveBrainPower: number;
  totalExecutions: number;
}

interface WorkforceActions {
  optimizeEfficiency: () => void;
  pulseExecution: () => void;
  syncWorkforce: () => void;
}

export type WorkforceStoreType = WorkforceState & WorkforceActions;

export const useWorkforceStore = create<WorkforceStoreType>((set, get) => ({
  units: [
    { id: 'unit-01', role: 'Neural Architect', status: 'active', efficiency: 99.8 },
    { id: 'unit-02', role: 'Quantum Strategist', status: 'active', efficiency: 95.2 },
    { id: 'unit-03', role: 'Ethical Aligner', status: 'syncing', efficiency: 88.4 }
  ],
  collectiveBrainPower: 924,
  totalExecutions: 8429001,

  optimizeEfficiency: () => {
    set((state) => ({
        collectiveBrainPower: state.collectiveBrainPower + 50,
        units: state.units.map(u => ({ ...u, efficiency: Math.min(100, u.efficiency + 2), status: 'active' }))
    }));
    GlobalMemory.record("WORKFORCE", "Collective workforce efficiency optimized. All units reporting 100% logic alignment.", 100);
  },

  pulseExecution: () => {
    set((state) => ({ totalExecutions: state.totalExecutions + 1000 }));
  },

  syncWorkforce: () => {
    GlobalMemory.record("WORKFORCE", "Omniversal workforce synchronized. All capacity models aligned.", 100);
  }
}));
