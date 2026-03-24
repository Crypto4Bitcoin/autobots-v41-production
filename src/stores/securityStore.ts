import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SecurityState {
  threatLevel: number;
  defenseReadiness: number;
  isSanitizing: boolean;
  isTriggeringContainment: boolean;
}

interface SecurityActions {
  detectThreat: (type: string) => void;
  triggerContainment: () => void;
  syncSecurity: () => void;
}

export type SecurityStoreType = SecurityState & SecurityActions;

export const useSecurityStore = create<SecurityStoreType>((set, get) => ({
  threatLevel: 0,
  defenseReadiness: 100,
  isSanitizing: false,
  isTriggeringContainment: false,

  detectThreat: (type) => {
    set({ threatLevel: Math.min(100, get().threatLevel + 25) });
    GlobalMemory.record("SECURITY", `Hostile pattern detected: ${type}. Defense readiness elevated.`, 100);
  },

  triggerContainment: () => {
    set({ isTriggeringContainment: true, isSanitizing: true });
    setTimeout(() => {
        set({ threatLevel: 0, isTriggeringContainment: false, isSanitizing: false });
        GlobalMemory.record("SECURITY", "Containment protocols complete. All hostile patterns purged from the mesh.", 100);
    }, 2000);
  },

  syncSecurity: () => {
    GlobalMemory.record("SECURITY", "Omniversal security synchronized. All defense models aligned.", 100);
  }
}));
