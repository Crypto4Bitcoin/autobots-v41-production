import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface Policy {
  id: string;
  name: string;
  enabled: boolean;
  desc: string;
}

interface SettingsState {
  policies: Policy[];
  systemMode: 'autonomous' | 'manual' | 'hybrid';
  encryptionLevel: string;
}

interface SettingsActions {
  togglePolicy: (id: string) => void;
  setSystemMode: (mode: 'autonomous' | 'manual' | 'hybrid') => void;
  calibrateLogic: () => void;
}

export type SettingsStoreType = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStoreType>((set, get) => ({
  policies: [
    { id: 'p-01', name: 'Approval Required', enabled: true, desc: 'Every outbound post must be manually approved.' },
    { id: 'p-02', name: 'Identity Privacy', enabled: false, desc: 'Anonymize agent identities in public logs.' },
    { id: 'p-03', name: 'Auto-Healing', enabled: true, desc: 'Automatically repair broken workflow nodes.' }
  ],
  systemMode: 'hybrid',
  encryptionLevel: 'AES-4096-QUANTUM',

  togglePolicy: (id) => {
    set((state) => ({
        policies: state.policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    }));
    GlobalMemory.record("SETTINGS", `Policy ${id} state modified. System configuration updated.`, 100);
  },

  setSystemMode: (mode) => {
    set({ systemMode: mode });
    GlobalMemory.record("SETTINGS", `System mode transitioned to ${mode.toUpperCase()}. Governance updated.`, 100);
  },

  calibrateLogic: () => {
    GlobalMemory.record("SETTINGS", "LOGIC CALIBRATION: All system policies aligned with the Sovereign baseline.", 100);
  }
}));
