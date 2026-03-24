import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface GalacticInsight {
  id: string;
  summary: string;
  category: string;
  reliability: number;
  source: string;
  timestamp: number;
}

interface InsightState {
  insights: GalacticInsight[];
  totalInsights: number;
  isLearning: boolean;
}

interface InsightActions {
  generateInsight: (category: string) => void;
  explainInsight: (id: string) => string[];
  syncInsights: () => void;
}

export type InsightStoreType = InsightState & InsightActions;

export const useInsightStore = create<InsightStoreType>((set, get) => ({
  insights: [
    { id: 'ins-01', summary: 'Neural Resonance achieved 100% parity across Shard-ALPHA.', category: 'Neural', reliability: 99.5, source: 'Core Engine', timestamp: Date.now() },
    { id: 'ins-02', summary: 'Regional stability decay detected in Shard-OMEGA resolved by auto-healing.', category: 'Structural', reliability: 85.2, source: 'Defense Relay', timestamp: Date.now() - 3600000 }
  ],
  totalInsights: 4288,
  isLearning: false,

  generateInsight: (category) => {
    set({ isLearning: true });
    setTimeout(() => {
        set((state) => ({ 
            isLearning: false, 
            totalInsights: state.totalInsights + 1,
            insights: [
                { id: `ins-${state.totalInsights + 1}`, summary: `New ${category} insight synthesized. Civilizational knowledge mesh updated.`, category, reliability: 95, source: 'Meta-Oversight', timestamp: Date.now() },
                ...state.insights.slice(0, 9)
            ]
        }));
        GlobalMemory.record("INSIGHT", `New galatic insight generated in category: ${category}. Universal knowledge parity updated.`, 100);
    }, 2000);
  },

  explainInsight: (id) => {
    const insight = get().insights.find(i => i.id === id);
    if (!insight) return ["Analyzing..."];
    return [
        `Consensus reached at ${new Date(insight.timestamp).toLocaleTimeString()}.`,
        `Cross-shard verification: COMPLETE.`,
        `Reliability locked at ${insight.reliability.toFixed(1)}%.`,
        `Identity of source: ${insight.source} confirmed.`
    ];
  },

  syncInsights: () => {
    GlobalMemory.record("INSIGHT", "Omniversal insights synchronized. All knowledge models aligned.", 100);
  }
}));
