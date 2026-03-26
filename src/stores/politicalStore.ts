import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface Official {
  id: string;
  name: string;
  role: string;
  sentiment: string; // 'Bullish' | 'Bearish' | 'Neutral'
  policyWeight: number;
}

interface PoliticalState {
  officials: Official[];
  electionCycleProgress: number;
  publicSentimentIndex: number;
}

export const usePoliticalStore = create<PoliticalState>((set) => ({
  officials: [
    { id: 'o-01', name: 'The President', role: 'Executive', sentiment: 'Neutral', policyWeight: 98 },
    { id: 'o-02', name: 'Senate Majority', role: 'Legislative', sentiment: 'Bearish', policyWeight: 82 }
  ],
  electionCycleProgress: 35,
  publicSentimentIndex: 44.5
}));