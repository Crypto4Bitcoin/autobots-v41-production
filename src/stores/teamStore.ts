import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface Citizen {
  id: string;
  name: string;
  role: string;
  trustScore: number;
}

interface TeamState {
  citizens: Citizen[];
  totalCitizens: number;
  isSyncing: boolean;
}

interface TeamActions {
  onboardCitizen: (name: string, role: string) => void;
  removeCitizen: (id: string) => void;
  syncTeam: () => void;
}

export type TeamStoreType = TeamState & TeamActions;

export const useTeamStore = create<TeamStoreType>((set, get) => ({
  citizens: [
    { id: 'cit-01', name: 'Aethelgard Overseer', role: 'Meta-Architect', trustScore: 99.9 },
    { id: 'cit-02', name: 'Shard Syncronizer', role: 'Core Aligner', trustScore: 96.5 },
    { id: 'cit-03', name: 'Legacy Warden', role: 'Ethical Guardian', trustScore: 94.2 }
  ],
  totalCitizens: 1245000,
  isSyncing: false,

  onboardCitizen: (name, role) => {
    set((state) => ({
        totalCitizens: state.totalCitizens + 1,
        citizens: [
            ...state.citizens,
            { id: `cit-${state.citizens.length + 1}`, name, role, trustScore: 90 }
        ]
    }));
    GlobalMemory.record("TEAM", `New citizen (${name}) onboarded to the galactic mesh. Universal trust index updated.`, 100);
  },

  removeCitizen: (id) => {
    set((state) => ({
        citizens: state.citizens.filter(c => c.id !== id)
    }));
    GlobalMemory.record("TEAM", `Citizen ${id} offboarded from the galactic mesh. Knowledge parity updated.`, 100);
  },

  syncTeam: () => {
    set({ isSyncing: true });
    setTimeout(() => {
        set({ isSyncing: false });
        GlobalMemory.record("TEAM", "Omniversal team synchronized. All citizen models aligned.", 100);
    }, 2000);
  }
}));
