import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { logDomainEvent } from '../lib/domainLogger';
import { registerHandler } from '../lib/domainCommands';

interface StrategicScenario {
  id: string;
  name: string;
  horizon_years: number;
  outcomes: {
    stability: number;
    growth: number;
    alignment: number;
    narrative: string;
  };
}

interface RehearsalState {
  scenarios: StrategicScenario[];
  selectedScenario: StrategicScenario | null;
  isSimulating: boolean;
}

interface RehearsalActions {
  selectScenario: (id: string) => void;
  runRehearsal: (id: string) => void;
  syncRehearsal: () => void;
}

export type RehearsalStoreType = RehearsalState & RehearsalActions;

export const useRehearsalStore = create<RehearsalStoreType>((set, get) => ({
  scenarios: [
    { 
        id: 'scen-01', 
        name: 'Omniversal Expansion', 
        horizon_years: 100,
        outcomes: {
            stability: 0.98,
            growth: 1.0,
            alignment: 0.95,
            narrative: "Planetary networks reach peak efficiency across all regional clusters."
        }
    },
    { 
        id: 'scen-02', 
        name: 'Shard Sovereign Lock', 
        horizon_years: 50,
        outcomes: {
            stability: 1.0,
            growth: 0.85,
            alignment: 1.0,
            narrative: "Identity parity achieved across all civilization boundaries."
        }
    }
  ],
  selectedScenario: null,
  isSimulating: false,

  selectScenario: (id) => {
    const sc = get().scenarios.find(s => s.id === id);
    set({ selectedScenario: sc || null });
  },

  runRehearsal: (id) => {
    set({ isSimulating: true });
    
    logDomainEvent({
        domain: 'rehearsal',
        action: 'simulation_started',
        status: 'started',
        payload: { scenarioId: id }
    });

    setTimeout(() => {
        set({ isSimulating: false });
        
        logDomainEvent({
            domain: 'rehearsal',
            action: 'simulation_complete',
            status: 'success',
            payload: { scenarioId: id }
        });
        
        GlobalMemory.record("REHEARSAL", `Strategic rehearsal complete for scenario ${id}. Timeline parity confirmed.`, 100);
    }, 2000);
  },

  syncRehearsal: () => {
    logDomainEvent({
        domain: 'rehearsal',
        action: 'sync_rehearsal',
        status: 'success'
    });
    GlobalMemory.record("REHEARSAL", "Omniversal rehearsal synchronized. All strategic models aligned.", 100);
  }
}));

// Command Governance Registration
registerHandler('REHEARSAL_INITIATE_SIM', (payload) => {
  const { scenarioId } = payload;
  useRehearsalStore.getState().runRehearsal(scenarioId);
});
