
import { create } from 'zustand';

type EntityType = 'agent' | 'district' | 'memory' | 'milestone' | null;

interface SelectionState {
  selectedType: EntityType;
  selectedId: string | null;
  hoveredType: EntityType;
  hoveredId: string | null;
  setSelection: (type: EntityType, id: string | null) => void;
  clearSelection: () => void;
  setHover: (type: EntityType, id: string | null) => void;
  clearHover: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedType: null,
  selectedId: null,
  hoveredType: null,
  hoveredId: null,
  setSelection: (type, id) => set({ selectedType: type, selectedId: id }),
  clearSelection: () => set({ selectedType: null, selectedId: null }),
  setHover: (type, id) => set({ hoveredType: type, hoveredId: id }),
  clearHover: () => set({ hoveredType: null, hoveredId: null }),
}));
