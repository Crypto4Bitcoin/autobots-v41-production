import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface PowerNode {
  id: string;
  name: string;
  type: 'individual' | 'network' | 'institution';
  influence: number;
  assets: string[];
}

interface PowerState {
  nodes: PowerNode[];
  globalDominanceIndex: number;
  networkConnectivity: number;
}

export const usePowerStore = create<PowerState>((set) => ({
  nodes: [
    { id: 'p-01', name: 'PayPal Mafia', type: 'network', influence: 94, assets: ['Fintech', 'AI', 'SpaceX'] },
    { id: 'p-02', name: 'Dubai Sovereign Wealth', type: 'institution', influence: 88, assets: ['Real Estate', 'Global Ports'] },
    { id: 'p-03', name: 'Silicon Valley Elite', type: 'network', influence: 91, assets: ['Semiconductors', 'Cloud Mesh'] }
  ],
  globalDominanceIndex: 72,
  networkConnectivity: 89.2
}));