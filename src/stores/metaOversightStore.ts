import { create } from 'zustand';

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  source: string;
  timestamp: string;
}

interface MetaOversightState {
  governanceScore: number;
  activeAlerts: number;
  alerts: Alert[];
  lastOversightTick: string | null;
}

interface MetaOversightActions {
  triggerAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  resolveAlert: (id: string) => void;
  updateGovernance: (score: number) => void;
  tickOversight: (scoreMod: number) => void;
}

export type MetaOversightStoreType = MetaOversightState & MetaOversightActions;

export const useMetaOversightStore = create<MetaOversightStoreType>((set, get) => ({
  governanceScore: 100,
  activeAlerts: 0,
  alerts: [],
  lastOversightTick: null,

  triggerAlert: (alert) => {
    const aid = Math.random().toString(36).substr(2, 9);
    set((state) => ({ 
      alerts: [{ ...alert, id: aid, timestamp: new Date().toISOString() }, ...state.alerts].slice(0, 50),
      activeAlerts: state.activeAlerts + 1
    }));
  },

  resolveAlert: (id) => {
    set((state) => ({ 
      alerts: state.alerts.filter(a => a.id !== id),
      activeAlerts: Math.max(0, state.activeAlerts - 1)
    }));
  },

  updateGovernance: (score) => set({ governanceScore: score }),

  tickOversight: (scoreMod) => {
    set((state) => ({ 
      lastOversightTick: new Date().toISOString(),
      governanceScore: Math.min(100, Math.max(0, state.governanceScore + scoreMod))
    }));
  }
}));
