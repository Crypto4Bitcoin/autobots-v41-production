import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface BioSignal {
  id: string;
  type: 'cardiac' | 'neural' | 'metabolic';
  frequency: number;
  stability: number;
  timestamp: string;
}

interface LifeState {
  signals: BioSignal[];
  researchProgress: number;
  innovationIndex: number;
}

export const useLifeStore = create<LifeState>((set) => ({
  signals: [
    { id: 'bs-01', type: 'cardiac', frequency: 72, stability: 98.4, timestamp: new Date().toISOString() },
    { id: 'bs-02', type: 'neural', frequency: 12, stability: 95.1, timestamp: new Date().toISOString() }
  ],
  researchProgress: 68.2,
  innovationIndex: 82.5
}));