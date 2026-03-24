import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface Objective {
  name: string;
  description: string;
  weight: number;
  version: number;
}

interface Decision {
  source_layer: string;
  timestamp: string;
  explanation: string;
  intent_alignment: number;
}

interface ControlState {
  objectives: Objective[];
  decisions: Decision[];
  isTriggering: boolean;
}

interface ControlActions {
  triggerAction: (action: string, payload: any) => void;
  syncControl: () => void;
}

export type ControlStoreType = ControlState & ControlActions;

export const useControlStore = create<ControlStoreType>((set, get) => ({
  objectives: [
    { name: 'Omniverse Stability', description: 'Maintain 100% stability across all shards.', weight: 1.0, version: 1 },
    { name: 'Sovereign Alignment', description: 'Ensure all decisions align with the constitutional baseline.', weight: 0.8, version: 1 }
  ],
  decisions: [
    { source_layer: 'Meta-Logic', timestamp: new Date().toISOString(), explanation: 'Shard 02 stabilization verified.', intent_alignment: 0.98 },
    { source_layer: 'World Kernel', timestamp: new Date().toISOString(), explanation: 'Legislative parity enforced.', intent_alignment: 0.95 }
  ],
  isTriggering: false,

  triggerAction: (action, payload) => {
    set({ isTriggering: true });
    setTimeout(() => {
        set((state) => ({ 
            decisions: [{ source_layer: 'Operator', timestamp: new Date().toISOString(), explanation: `Action triggered: ${action}. Payload synchronized.`, intent_alignment: 1.0 }, ...state.decisions].slice(0, 20),
            isTriggering: false
        }));
        GlobalMemory.record("CONTROL", `Action triggered: ${action}. Sovereign intent updated.`, 100);
    }, 2000);
  },

  syncControl: () => {
    GlobalMemory.record("CONTROL", "Omniverse control logic synchronized. All operational models aligned.", 100);
  }
}));
