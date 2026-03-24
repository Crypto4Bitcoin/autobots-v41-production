import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SovereignWorker {
  id: string;
  name: string;
  shard: string;
  status: 'active' | 'paused' | 'transcending';
  performance: number;
}

interface WorkerState {
  workers: SovereignWorker[];
  totalThroughput: number;
}

interface WorkerActions {
  provisionWorker: (name: string, shard: string) => void;
  toggleWorker: (id: string) => void;
  syncWorkers: () => void;
}

export type WorkerStoreType = WorkerState & WorkerActions;

export const useWorkerStore = create<WorkerStoreType>((set, get) => ({
  workers: [
    { id: 'wrk-01', name: 'Neural Auditor', shard: 'Shard Alpha', status: 'active', performance: 98 },
    { id: 'wrk-02', name: 'Quantum Harvester', shard: 'Shard Gamma', status: 'active', performance: 95 },
    { id: 'wrk-03', name: 'Causal Weaver', shard: 'Shard Beta', status: 'paused', performance: 0 }
  ],
  totalThroughput: 1450.2,

  provisionWorker: (name, shard) => {
    const id = "wrk-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    set((state) => ({ 
        workers: [...state.workers, { id, name, shard, status: 'active', performance: 100 }].slice(0, 20),
        totalThroughput: state.totalThroughput + 100
    }));
    GlobalMemory.record("WORKER", `New sovereign worker provisioned: ${name} on ${shard}. Labor parity verified.`, 100);
  },

  toggleWorker: (id) => {
    set((state) => ({
        workers: state.workers.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active', performance: w.status === 'active' ? 0 : 100 } : w)
    }));
    GlobalMemory.record("WORKER", `Worker ${id} status toggled. Resource allocation adjusted.`, 100);
  },

  syncWorkers: () => {
    GlobalMemory.record("WORKER", "Omniversal workers synchronized. All labor models aligned.", 100);
  }
}));
