import { create } from 'zustand';
import { useWorldStore } from './worldStore';
import { useEconomyStore } from './economyStore';
import { useDefenseDistrictStore } from './defenseDistrictStore';
import { usePlanetaryReadinessStore } from './planetaryReadinessStore';
import { useMetaOversightStore } from './metaOversightStore';

interface KernelMetric {
  id: string;
  label: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface WorldKernelState {
  isKernelLive: boolean;
  coreMetrics: KernelMetric[];
  lastUnificationAt: string | null;
  unifiedStability: number;
}

interface WorldKernelActions {
  initializeKernel: () => void;
  unifyMetrics: () => void;
  triggerGlobalHeal: () => void;
}

export type WorldKernelStoreType = WorldKernelState & WorldKernelActions;

export const useWorldKernelStore = create<WorldKernelStoreType>((set, get) => ({
  isKernelLive: false,
  coreMetrics: [],
  lastUnificationAt: null,
  unifiedStability: 0,

  initializeKernel: () => {
    // Phase 381: World Kernel Consolidation
    set({ isKernelLive: true, lastUnificationAt: new Date().toISOString() });
    get().unifyMetrics();
  },

  unifyMetrics: () => {
    const world = useWorldStore.getState();
    const economy = useEconomyStore.getState();
    const defense = useDefenseDistrictStore.getState();
    const readiness = usePlanetaryReadinessStore.getState();
    const oversight = useMetaOversightStore.getState();

    const metrics: KernelMetric[] = [
      { id: 'stability', label: 'Reality Stability', value: world.stability, status: world.stability > 90 ? 'optimal' : world.stability > 40 ? 'warning' : 'critical', trend: 'stable' },
      { id: 'economy', label: 'Treasury Capacity', value: (economy.treasuryBalance / 100000) * 100, status: economy.treasuryBalance > 10000 ? 'optimal' : 'warning', trend: 'up' },
      { id: 'defense', label: 'Mesh Resilience', value: defense.resilience, status: defense.resilience > 70 ? 'optimal' : 'critical', trend: 'stable' },
      { id: 'planetary', label: 'Planetary Readiness', value: readiness.score, status: readiness.score > 80 ? 'optimal' : 'warning', trend: 'up' },
      { id: 'governance', label: 'Meta Oversight', value: oversight.governanceScore, status: oversight.governanceScore > 90 ? 'optimal' : 'warning', trend: 'stable' }
    ];

    const unifiedStability = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length;
    
    set({ coreMetrics: metrics, unifiedStability, lastUnificationAt: new Date().toISOString() });
  },

  triggerGlobalHeal: () => {
    // Phase 382: Universal Orchestration Heal
    const world = useWorldStore.getState();
    const defense = useDefenseDistrictStore.getState();
    
    // Repair all districts to 100%
    useWorldStore.setState({ districts: world.districts.map(d => ({ ...d, health: 100 })) });
    
    // Stabilize all defense cells
    useDefenseDistrictStore.setState({ cells: defense.cells.map(c => ({ ...c, integrity: 100, status: 'stable' })) });
    
    get().unifyMetrics();
  }
}));
