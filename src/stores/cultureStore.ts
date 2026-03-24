import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface CulturalPersona {
  id: string;
  name: string;
  background: string;
  resonance: number;
}

interface CultureState {
  personas: CulturalPersona[];
  globalResonance: number;
}

interface CultureActions {
  synthesizeNarrative: (personaId: string, baseText: string) => string;
  increaseResonance: (id: string) => void;
  syncCulture: () => void;
}

export type CultureStoreType = CultureState & CultureActions;

export const useCultureStore = create<CultureStoreType>((set, get) => ({
  personas: [
    { id: 'per-01', name: 'The Architect', background: 'Omniversal strategist focused on pure structural integrity.', resonance: 85 },
    { id: 'per-02', name: 'The Poet', background: 'Narrative-driven logic that finds beauty in the mesh.', resonance: 92 }
  ],
  globalResonance: 98.4,

  synthesizeNarrative: (personaId, baseText) => {
    const p = get().personas.find(per => per.id === personaId);
    if (!p) return baseText;
    GlobalMemory.record("CULTURE", `Narrative synthesis complete for persona ${p.name}. Universal heritage updated.`, 100);
    return `${p.name} translates: "${baseText}" into a sovereign galactic directive.`;
  },

  increaseResonance: (id) => {
    set((state) => ({
        personas: state.personas.map(p => p.id === id ? { ...p, resonance: Math.min(100, p.resonance + 5) } : p)
    }));
    GlobalMemory.record("CULTURE", `Persona ${id} resonance increased. Galactic identity parity strengthening.`, 100);
  },

  syncCulture: () => {
    GlobalMemory.record("CULTURE", "Omniversal culture synchronized. All identity models aligned.", 100);
  }
}));
