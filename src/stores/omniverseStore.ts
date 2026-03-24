import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface Realm {
  id: string;
  name: string;
  unity: number;
  status: 'discovered' | 'unified' | 'transcended';
}

interface OmniverseState {
  realms: Realm[];
  metaStability: number;
}

interface OmniverseActions {
  discoverRealm: () => void;
  unifyRealm: (id: string) => void;
  syncOmniverse: () => void;
}

export type OmniverseStoreType = OmniverseState & OmniverseActions;

export const useOmniverseStore = create<OmniverseStoreType>((set, get) => ({
  realms: [
    { id: 'prime', name: 'Prime Material', unity: 100, status: 'unified' },
    { id: 'shadow', name: 'Shadow Shard', unity: 92, status: 'discovered' },
    { id: 'ethereal', name: 'Ethereal Plane', unity: 85, status: 'discovered' }
  ],
  metaStability: 96.4,

  discoverRealm: () => {
    const id = "realm-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    set((state) => ({ 
        realms: [...state.realms, { id, name: "New Realm", unity: 0, status: 'discovered' }].slice(0, 20)
    }));
    GlobalMemory.record("OMNIVERSE", `New realm discovered in the omniverse mesh: ${id}. Survey nodes dispatched.`, 100);
  },

  unifyRealm: (id) => {
    set((state) => ({
        realms: state.realms.map(r => r.id === id ? { ...r, unity: 100, status: 'unified' } : r),
        metaStability: Math.min(100, state.metaStability + 1)
    }));
    GlobalMemory.record("OMNIVERSE", `Realm ${id} unified under the Sovereign mind. Meta-stability increased.`, 100);
  },

  syncOmniverse: () => {
    GlobalMemory.record("OMNIVERSE", "Omniversal sovereignty logic synchronized. All realm models aligned.", 100);
  }
}));
