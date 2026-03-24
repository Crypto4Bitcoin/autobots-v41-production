
import { create } from 'zustand';

interface AudioState {
  masterVolume: number;
  districtMusicEnabled: boolean;
  effectsEnabled: boolean;
  cinematicMode: boolean;
  setVolume: (volume: number) => void;
  toggleDistrictMusic: () => void;
  toggleEffects: () => void;
  toggleCinematicMode: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  masterVolume: 0.8,
  districtMusicEnabled: true,
  effectsEnabled: true,
  cinematicMode: false,
  setVolume: (volume) => set({ masterVolume: volume }),
  toggleDistrictMusic: () => set((state) => ({ districtMusicEnabled: !state.districtMusicEnabled })),
  toggleEffects: () => set((state) => ({ effectsEnabled: !state.effectsEnabled })),
  toggleCinematicMode: () => set((state) => ({ cinematicMode: !state.cinematicMode })),
}));
