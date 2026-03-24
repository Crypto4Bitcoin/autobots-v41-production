import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface GalacticBriefing {
  id: string;
  title: string;
  summary: string;
  shard: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

interface BriefingState {
  briefings: GalacticBriefing[];
  totalBriefings: number;
  isSyncing: boolean;
}

interface BriefingActions {
  syncShards: () => void;
  addBriefing: (info: Partial<GalacticBriefing>) => void;
  syncBriefings: () => void;
}

export type BriefingStoreType = BriefingState & BriefingActions;

export const useBriefingStore = create<BriefingStoreType>((set, get) => ({
  briefings: [
    { id: 'br-01', title: 'Shard Parity Achieved', summary: 'All regional clusters in Shard-ALPHA have reported 100% logic alignment.', shard: 'ALPHA', priority: 'high', timestamp: Date.now() },
    { id: 'br-02', title: 'Deep Context Relay', summary: 'Cross-shard behavioral insights being projected into the meta-layer.', shard: 'OMEGA', priority: 'medium', timestamp: Date.now() - 7200000 }
  ],
  totalBriefings: 124,
  isSyncing: false,

  syncShards: () => {
    set({ isSyncing: true });
    setTimeout(() => {
        set({ isSyncing: false });
        GlobalMemory.record("BRIEFING", "Shard parity synchronization complete. All regional briefings harmonized.", 100);
    }, 2000);
  },

  addBriefing: (info) => {
    set((state) => ({
        totalBriefings: state.totalBriefings + 1,
        briefings: [
            { 
                id: `br-${state.totalBriefings + 1}`, 
                title: info.title || 'New Intelligence Update', 
                summary: info.summary || 'Strategic awareness increased in the regional mesh.', 
                shard: info.shard || 'CORE', 
                priority: info.priority || 'medium', 
                timestamp: Date.now() 
            },
            ...state.briefings
        ]
    }));
  },

  syncBriefings: () => {
    GlobalMemory.record("BRIEFING", "Omniversal briefings synchronized. All awareness models aligned.", 100);
  }
}));
