import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface SovereignGene {
  id: string;
  name: string;
  category: string;
  integrity: number;
  status: 'candidate' | 'eternal';
}

interface GenomeState {
  genes: SovereignGene[];
  transcendenceScore: number;
  isSynthesizing: boolean;
}

interface GenomeActions {
  synthesizeGene: (gene: Partial<SovereignGene>) => void;
  promoteGene: (id: string) => void;
  evolveTranscendence: () => void;
  syncGenome: () => void;
}

export type GenomeStoreType = GenomeState & GenomeActions;

export const useGenomeStore = create<GenomeStoreType>((set, get) => ({
  genes: [
    { id: 'gene-01', name: 'Neural Resonance', category: 'Cognition', integrity: 99, status: 'eternal' },
    { id: 'gene-02', name: 'Labor Efficiency', category: 'Socio-Economic', integrity: 95, status: 'eternal' },
    { id: 'gene-03', name: 'Causal Stability', category: 'Temporal', integrity: 98, status: 'candidate' }
  ],
  transcendenceScore: 92.4,
  isSynthesizing: false,

  synthesizeGene: (gene) => {
    set({ isSynthesizing: true });
    setTimeout(() => {
        const id = "gene-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        set((state) => ({ 
            genes: [{ id, name: gene.name || "Untitled", category: gene.category || "N/A", integrity: 100, status: 'candidate' }, ...state.genes].slice(0, 20),
            isSynthesizing: false
        }));
        GlobalMemory.record("GENOME", `New sovereign gene synthesized: ${gene.name}. Evolutionary parity pending.`, 100);
    }, 2000);
  },

  promoteGene: (id) => {
    set((state) => ({
        genes: state.genes.map(g => g.id === id ? { ...g, status: 'eternal' } : g)
    }));
    GlobalMemory.record("GENOME", `Gene ${id} promoted to ETERNAL status. Universal evolutionary lock engaged.`, 100);
  },

  evolveTranscendence: () => {
    set((state) => ({ transcendenceScore: Math.min(100, state.transcendenceScore + 0.1) }));
  },

  syncGenome: () => {
    GlobalMemory.record("GENOME", "Omniversal genome synchronized. All evolutionary models aligned.", 100);
  }
}));
