import { create } from 'zustand';
import { calculateFirewallScaling } from '../lib/defense/intrusionResponse';
import { useWorldStore } from './worldStore';

export type CellStatus = 'stable' | 'alert' | 'breach' | 'reinforced' | 'quarantined';

export interface DefenseCell { 
  id: string; 
  x: number; 
  y: number; 
  status: CellStatus; 
  integrity: number; 
  assignedAgents: string[]; 
  threatClasses: string[] 
}

interface DefenseDistrictState { 
  cells: DefenseCell[]; 
  resilience: number; 
  lastBreachAt: string | null; 
  memoryLog: string[] 
}

interface DefenseDistrictActions { 
  reinforceCell: (cellId: string, agentIds: string[], threatClasses: string[]) => void; 
  triggerAlert: (cellId: string) => void; 
  resolveCell: (cellId: string) => void; 
  tick: () => void; 
  generateThreats: () => void; 
  addLogEntry: (message: string) => void; 
  quarantineAgent: (agentId: string) => void 
}

export type DefenseDistrictStore = DefenseDistrictState & DefenseDistrictActions;

const initialCells = Array.from({ length: 81 }).map((_, i) => ({ 
  id: 'cell-' + i, 
  x: i % 9, 
  y: Math.floor(i / 9), 
  status: 'stable' as CellStatus, 
  integrity: 100, 
  assignedAgents: [], 
  threatClasses: [] 
}));

export const useDefenseDistrictStore = create<DefenseDistrictStore>((set, get) => ({
  cells: initialCells,
  resilience: 100,
  lastBreachAt: null,
  memoryLog: ["System initialized. Grid clean."],
  reinforceCell: (id, aids, tcs) => set((s) => ({ 
    cells: s.cells.map((c) => c.id === id ? { 
      ...c, 
      status: 'reinforced', 
      integrity: Math.min(100, c.integrity + 20), 
      assignedAgents: [...new Set([...c.assignedAgents, ...aids])], 
      threatClasses: [...new Set([...c.threatClasses, ...tcs])] 
    } : c) 
  })),
  triggerAlert: (id) => set((s) => ({ 
    cells: s.cells.map((c) => c.id === id ? { 
      ...c, 
      status: 'alert', 
      integrity: Math.max(0, c.integrity - 10) 
    } : c) 
  })),
  resolveCell: (id) => set((s) => ({ 
    cells: s.cells.map((c) => c.id === id ? { 
      ...c, 
      status: 'stable', 
      integrity: 100, 
      assignedAgents: [], 
      threatClasses: [] 
    } : c) 
  })),
  addLogEntry: (msg) => set((s) => ({ 
    memoryLog: [msg, ...s.memoryLog].slice(0, 50) 
  })),
  quarantineAgent: (aid) => {
    get().addLogEntry(`AGENT QUARANTINE: ${aid} isolated due to trust breach.`);
  },
  generateThreats: () => {
    const { cells, addLogEntry } = get();
    const candidateIdx = Math.floor(Math.random() * cells.length);
    if (cells[candidateIdx].status === 'stable') {
      set((s) => ({ 
        cells: s.cells.map((c, i) => i === candidateIdx ? { ...c, status: 'alert', integrity: 80 } : c) 
      }));
      addLogEntry(`THREAT DETECTED in Sector ${Math.floor(candidateIdx / 9) + 1}`);
    }
  },
  tick: () => {
    const world = useWorldStore.getState();
    set((state) => {
      const newCells = state.cells.map((c) => 
        (c.status === 'alert' || c.status === 'breach') 
          ? { ...c, integrity: Math.max(0, c.integrity - 2), status: (c.integrity <= 2 ? 'breach' : c.status) as CellStatus } 
          : c
      );
      const avgInt = newCells.reduce((acc, c) => acc + c.integrity, 0) / 81;
      const scaledResilience = calculateFirewallScaling(avgInt, world.stability);
      return { cells: newCells, resilience: Math.floor(scaledResilience) };
    });
  },
}));
