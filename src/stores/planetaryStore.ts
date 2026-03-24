import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface PlanetaryNode {
  id: string;
  location: string;
  type: string;
  load: number;
  status: 'online' | 'terraforming' | 'locked';
}

interface PlanetaryState {
  nodes: PlanetaryNode[];
  coreResonance: number;
  isTerraforming: boolean;
}

interface PlanetaryActions {
  routeWorkload: (nodeId: string) => void;
  expandCore: () => void;
  syncPlanetaryMesh: () => void;
}

export type PlanetaryStoreType = PlanetaryState & PlanetaryActions;

export const usePlanetaryStore = create<PlanetaryStoreType>((set, get) => ({
  nodes: [
    { id: 'node-01', location: 'Mars North', type: 'Primary Relay', load: 45, status: 'online' },
    { id: 'node-02', location: 'Europa Core', type: 'Quantum Link', load: 12, status: 'online' },
    { id: 'node-03', location: 'Titan Base', type: 'Logic Anchor', load: 78, status: 'online' }
  ],
  coreResonance: 98.2,
  isTerraforming: false,

  routeWorkload: (nodeId) => {
    set((state) => ({
        nodes: state.nodes.map(n => n.id === nodeId ? { ...n, load: (n.load + 5) % 100 } : n)
    }));
    GlobalMemory.record("PLANETARY", `Workload routed to planetary node ${nodeId}. Resource distribution optimized.`, 100);
  },

  expandCore: () => {
    set({ isTerraforming: true });
    setTimeout(() => {
        set((state) => ({ 
            coreResonance: Math.min(100, state.coreResonance + 0.5),
            isTerraforming: false 
        }));
        GlobalMemory.record("PLANETARY", "Planetary core expanded. Terraforming protocols complete across all shards.", 100);
    }, 2000);
  },

  syncPlanetaryMesh: () => {
    GlobalMemory.record("PLANETARY", "Omniversal planetary mesh synchronized. All regional relays aligned.", 100);
  }
}));
