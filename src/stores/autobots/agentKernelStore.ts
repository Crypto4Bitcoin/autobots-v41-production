
import { create } from 'zustand';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AgentProfile, TaskContract } from '@/lib/world/core-models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useWorldStore } from '@/stores/autobots/worldStore'; // Read from the visual schema state

interface KernelState {
  tickCount: number;
  isRunning: boolean;
  activeTasks: TaskContract[];
  taskHistory: TaskContract[];
  
  // Simulation Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  triggerTick: () => void;
  
  // Agent Logic
  generateTask: () => void;
  assignTask: (taskId: string, agentId: string) => void;
  completeTask: (taskId: string) => void;
}

// Generate random UUID
const uid = () => 'id-' + Math.random().toString(36).substr(2, 9);

export const useAgentKernel = create<KernelState>((set, get) => ({
  tickCount: 0,
  isRunning: false,
  activeTasks: [],
  taskHistory: [],

  startSimulation: () => {
    if (get().isRunning) return;
    set({ isRunning: true });
    // In a real app, this would use requestAnimationFrame or a worker.
    // We simulate the interval loop trigger visually.
  },

  stopSimulation: () => {
    set({ isRunning: false });
  },

  triggerTick: () => {
    if (!get().isRunning) return;
    
    set((state) => {
      // 1. Randomly generate tasks
      const newTasks = [...state.activeTasks];
      if (Math.random() > 0.7) {
        newTasks.push({
          id: uid(),
          title: 'Routine Sync Check',
          requiredRole: 'Any',
          district: 'industrial', // Defaulting for visual testing
          payoutAmount: 100,
          taxAmount: 20,
          status: 'open',
          createdAt: Date.now(),
        });
      }
      return { tickCount: state.tickCount + 1, activeTasks: newTasks };
    });
  },

  generateTask: () => {
    set((state) => ({
      activeTasks: [
        ...state.activeTasks,
        {
          id: uid(),
          title: 'Manual Task Injection',
          requiredRole: 'Any',
          district: 'economic',
          payoutAmount: 500,
          taxAmount: 50,
          status: 'open',
          createdAt: Date.now(),
        }
      ]
    }));
  },

  assignTask: (taskId, agentId) => {
    set((state) => ({
      activeTasks: state.activeTasks.map(t => 
        t.id === taskId ? { ...t, status: 'assigned', assignedAgentId: agentId } : t
      )
    }));
  },

  completeTask: (taskId) => {
    set((state) => {
      const task = state.activeTasks.find(t => t.id === taskId);
      if (!task) return state;
      
      const completedTask = { ...task, status: 'completed' as const, completedAt: Date.now() };
      return {
        activeTasks: state.activeTasks.filter(t => t.id !== taskId),
        taskHistory: [completedTask, ...state.taskHistory].slice(0, 100) // Keep last 100
      };
    });
  }
}));
