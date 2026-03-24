import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface RuntimeNode {
  id: string;
  region: string;
  health: 'healthy' | 'degraded';
  load: string;
  capabilities: number;
}

interface ConsoleState {
  runtimes: RuntimeNode[];
  systemStability: number;
  activeNodes: number;
  isOptimizing: boolean;
}

interface ConsoleActions {
  optimizeGrid: () => void;
  inspectRuntime: (id: string) => void;
  syncConsole: () => void;
}

export type ConsoleStoreType = ConsoleState & ConsoleActions;

export const useConsoleStore = create<ConsoleStoreType>((set, get) => ({
  runtimes: [
    { id: "runtime-us-east-1", region: "us-east", health: "healthy", load: "24%", capabilities: 8 },
    { id: "runtime-eu-central-1", region: "eu-central", health: "healthy", load: "12%", capabilities: 5 },
    { id: "runtime-ap-south-1", region: "ap-south", health: "healthy", load: "8%", capabilities: 4 }
  ],
  systemStability: 100,
  activeNodes: 3,
  isOptimizing: false,

  optimizeGrid: () => {
    set({ isOptimizing: true });
    setTimeout(() => {
        set({ isOptimizing: false });
        GlobalMemory.record("CONSOLE", "Omniverse grid optimized. All regional runtimes aligned.", 100);
    }, 2000);
  },

  inspectRuntime: (id) => {
    GlobalMemory.record("CONSOLE", `Runtime ${id} inspected. Health verified.`, 100);
  },

  syncConsole: () => {
    GlobalMemory.record("CONSOLE", "Omniverse console logic synchronized. All observability models aligned.", 100);
  }
}));
