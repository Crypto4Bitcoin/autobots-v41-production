import { create } from 'zustand';

interface SingularityState {
  totalStability: number;
  totalComplexity: number;
  totalResonance: number;
  isUnlocked: boolean;
}

interface SingularityActions {
  syncSingularity: () => void;
  unleashSingularity: () => void;
}

export type SingularityStoreType = SingularityState & SingularityActions;

export const useSingularityStore = create<SingularityStoreType>((set, get) => ({
  totalStability: 0,
  totalComplexity: 0,
  totalResonance: 0,
  isUnlocked: false,

  syncSingularity: () => {
    // Collect from other stores would go here in a real app
    set({ 
        totalStability: 100, 
        totalComplexity: 100, 
        totalResonance: 100 
    });
  },

  unleashSingularity: () => {
    set({ isUnlocked: true });
  }
}));
