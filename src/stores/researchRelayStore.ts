import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface ResearchPacket {
  id: string;
  from: string;
  to: string;
  data: string;
  confidence: number;
  timestamp: string;
}

interface RelayState {
  packets: ResearchPacket[];
  activeLabs: string[];
}

interface RelayActions {
  emitPacket: (from: string, to: string, data: string) => void;
  processPacket: (id: string) => void;
}

export const useResearchRelayStore = create<RelayState & RelayActions>((set) => ({
  packets: [],
  activeLabs: ['QUANTUM', 'LEGACY', 'POWER', 'LIFE', 'COGNITIVE'],

  emitPacket: (from, to, data) => {
    const packet: ResearchPacket = {
      id: `pkt-${Date.now()}`,
      from, to, data,
      confidence: 85 + Math.random() * 15,
      timestamp: new Date().toISOString()
    };
    set((state) => ({ packets: [packet, ...state.packets].slice(0, 50) }));
    GlobalMemory.record('RELAY', `Research relay: ${from} -> ${to}. Data: ${data.substring(0, 20)}...`, 90);
  },

  processPacket: (id) => {
    set((state) => ({
      packets: state.packets.filter(p => p.id !== id)
    }));
  }
}));