import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

export interface GridCell {
  id: string;
  depth: number; // 1-3 (9x9x9)
  status: 'online' | 'analyzing' | 'locked';
  signal: number;
}

export interface Division {
  id: string;
  name: string;
  slug: string;
  cells: GridCell[];
  masterScore: number;
}

interface MetaBrainState {
  divisions: Record<string, Division>;
  activeCellId: string | null;
}

interface MetaBrainActions {
  initializeDivision: (slug: string, name: string) => void;
  updateCellSignal: (divSlug: string, cellId: string, signal: number) => void;
  computeMasterScore: (divSlug: string) => void;
}

export const useMetaBrainStore = create<MetaBrainState & MetaBrainActions>((set, get) => ({
  divisions: {},
  activeCellId: null,

  initializeDivision: (slug, name) => {
    // Generate 729 cells (9x9x9)
    const cells: GridCell[] = [];
    for (let i = 0; i < 729; i++) {
      cells.push({
        id: `c-${i}`,
        depth: (i % 3) + 1,
        status: 'online',
        signal: Math.random() * 100
      });
    }
    set((state) => ({
      divisions: {
        ...state.divisions,
        [slug]: { id: `div-${slug}`, name, slug, cells, masterScore: 50 }
      }
    }));
    GlobalMemory.record('METABRAIN', `Division ${name} initialized with 9x9x9 (729 cells) grid lock.`, 100);
  },

  updateCellSignal: (slug, cellId, signal) => {
    set((state) => {
      const div = state.divisions[slug];
      if (!div) return state;
      const newCells = div.cells.map(c => c.id === cellId ? { ...c, signal } : c);
      return {
        divisions: { ...state.divisions, [slug]: { ...div, cells: newCells } }
      };
    });
  },

  computeMasterScore: (slug) => {
    const div = get().divisions[slug];
    if (!div) return;
    const avg = div.cells.reduce((acc, c) => acc + c.signal, 0) / div.cells.length;
    set((state) => ({
      divisions: { ...state.divisions, [slug]: { ...div, masterScore: avg } }
    }));
  }
}));