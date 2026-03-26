import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface Theory {
  id: string;
  name: string;
  phase: number; // 0-1 (Verification stage)
  confidence: number;
}

interface QuantumState {
  theories: Theory[];
  entanglementLevel: number;
  fieldStability: number;
}

interface QuantumActions {
  proposeTheory: (theory: Theory) => void;
  stabilizeField: (level: number) => void;
}

export const useQuantumStore = create<QuantumState & QuantumActions>((set) => ({
  theories: [
    { id: 't-01', name: 'Superposition Duality', phase: 0.8, confidence: 92 },
    { id: 't-02', name: 'Entropic Gravitation', phase: 0.4, confidence: 78 }
  ],
  entanglementLevel: 85,
  fieldStability: 99.4,

  proposeTheory: (theory) => {
    set((state) => ({ theories: [theory, ...state.theories] }));
    GlobalMemory.record('QUANTUM', `New theory proposed: ${theory.name}. Initiating field verification.`, 100);
  },

  stabilizeField: (level) => {
    set({ fieldStability: level });
  }
}));