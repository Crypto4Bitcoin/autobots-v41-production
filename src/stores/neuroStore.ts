import { create } from 'zustand';

export type BrainState = 'AWAKE_FOCUSED' | 'RELAXED' | 'DROWSY' | 'REM' | 'DEEP_SLEEP' | 'UNKNOWN';

interface NeuroState {
  currentState: BrainState;
  zones: Record<string, number>;
  consciousnessIndex: number;
}

interface NeuroActions {
  updateState: (s: BrainState) => void;
  mapRegion: (zone: string, val: number) => void;
}

export const useNeuroStore = create<NeuroState & NeuroActions>((set) => ({
  currentState: 'AWAKE_FOCUSED',
  zones: { 'frontal': 80, 'occipital': 20, 'temporal': 40 },
  consciousnessIndex: 94.2,

  updateState: (s) => set({ currentState: s }),
  mapRegion: (zone, val) => set((state) => ({ zones: { ...state.zones, [zone]: val } }))
}));