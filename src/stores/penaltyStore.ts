import { create } from 'zustand';
import type { DistrictRestrictionLevel, DistrictType } from '../lib/world/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PenaltyRecord, PenaltyState, PenaltyType } from '../lib/penalties/types';
import { useWorldStore } from './worldStore';

interface PenaltyStore extends PenaltyState {
  addPenalty: (input: {
    caseId: string;
    agentId: string | null;
    district: DistrictType | null;
    type: PenaltyType;
    reason: string;
  }) => void;
  clearPenaltiesForCase: (caseId: string) => void;
  setDistrictRestriction: (districtId: DistrictType, level: DistrictRestrictionLevel) => void;
}

export const usePenaltyStore = create<PenaltyStore>((set) => ({
  penalties: [],

  addPenalty: (input) =>
    set((state) => ({
      penalties: [
        {
          id: `penalty-${input.caseId}-${Date.now()}`,
          ...input,
          active: true,
          createdAt: Date.now(),
        },
        ...state.penalties,
      ],
    })),

  clearPenaltiesForCase: (caseId) =>
    set((state) => ({
      penalties: state.penalties.map((penalty) =>
        penalty.caseId === caseId ? { ...penalty, active: false } : penalty
      ),
    })),

  setDistrictRestriction: (districtId, level) => {
    const world = useWorldStore.getState();

    useWorldStore.setState({
      districts: world.districts.map((district) =>
        district.id === districtId
          ? { ...district, restrictionLevel: level }
          : district
      ),
    });
  },
}));
