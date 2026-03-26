import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface MindNode {
  id: string;
  name: string;
  era: string;
  keyContributions: string[];
  activeResearch: string;
}

interface LegacyState {
  masters: MindNode[];
  conceptualOverlap: number;
  lineageStrength: number;
}

interface LegacyActions {
  addContribution: (id: string, contribution: string) => void;
  relinkLineage: () => void;
}

export const useLegacyStore = create<LegacyState & LegacyActions>((set, get) => ({
  masters: [
    { id: 'm-01', name: 'Leonardo da Vinci', era: 'Renaissance', keyContributions: ['Engineering', 'Anatomical Mapping'], activeResearch: 'Pattern Symbology' },
    { id: 'm-02', name: 'Nikola Tesla', era: 'Industrial', keyContributions: ['Alternating Current', 'Radiant Energy'], activeResearch: 'Scalar Waves' },
    { id: 'm-03', name: 'Albert Einstein', era: 'Modern', keyContributions: ['Special Relativity', 'Photoelectric Force'], activeResearch: 'Unified Field' }
  ],
  conceptualOverlap: 64.2,
  lineageStrength: 98,

  addContribution: (id, contribution) => {
    set((state) => ({
      masters: state.masters.map(m => m.id === id ? { ...m, keyContributions: [...m.keyContributions, contribution] } : m)
    }));
    GlobalMemory.record('LEGACY', `Historical lineage expanded: ${contribution} added to ${id}.`, 100);
  },

  relinkLineage: () => {
    const strength = Math.min(100, get().lineageStrength + 1);
    set({ lineageStrength: strength });
    GlobalMemory.record('LEGACY', 'Cross-era conceptual relink successful. Historical logic aligned.', 100);
  }
}));