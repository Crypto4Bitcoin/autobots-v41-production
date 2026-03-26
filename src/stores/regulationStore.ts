import { create } from 'zustand';

type RhythmState = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH' | 'LOCKED';

interface RegulationState {
  mainBrain: boolean;
  innerBubble: boolean;
  verifierMesh: RhythmState;
  supervisorMesh: RhythmState;
  storageMesh: RhythmState;
  factories: 'IDLE' | 'ACTIVE' | 'OFF';
  avengersMode: 'PASSIVE' | 'INTERCEPT' | 'OFF';
  guardianMesh: {
    watch: boolean;
    verify: boolean;
    disposal: boolean;
  };
  
  // Actions
  setRhythm: (layer: 'verifierMesh' | 'supervisorMesh' | 'storageMesh', state: RhythmState) => void;
  toggleFactory: (state: 'IDLE' | 'ACTIVE' | 'OFF') => void;
  toggleAvengers: (mode: 'PASSIVE' | 'INTERCEPT' | 'OFF') => void;
  toggleGuardian: (part: 'watch' | 'verify' | 'disposal') => void;
  emergencyShutdown: () => void;
}

export const useRegulationStore = create<RegulationState>((set) => ({
  mainBrain: true,
  innerBubble: true,
  verifierMesh: 'LOW',
  supervisorMesh: 'LOW',
  storageMesh: 'LOW',
  factories: 'IDLE',
  avengersMode: 'PASSIVE',
  guardianMesh: {
    watch: true,
    verify: false,
    disposal: false,
  },

  setRhythm: (layer, state) => set({ [layer]: state }),
  toggleFactory: (factories) => set({ factories }),
  toggleAvengers: (avengersMode) => set({ avengersMode }),
  toggleGuardian: (part) => set((state) => ({
    guardianMesh: { ...state.guardianMesh, [part]: !state.guardianMesh[part] }
  })),
  emergencyShutdown: () => set({
    factories: 'OFF',
    verifierMesh: 'OFF',
    supervisorMesh: 'OFF',
    avengersMode: 'OFF',
    guardianMesh: { watch: false, verify: false, disposal: false }
  })
}));
