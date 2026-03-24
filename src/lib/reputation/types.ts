import type { DistrictType } from '../world/types';

export interface TreasuryHold {
  id: string;
  caseId: string | null;
  agentId: string;
  district: DistrictType;
  grossAmount: number;
  heldAmount: number;
  releasedAmount: number;
  reason: string;
  createdAt: number;
}

export interface ReputationEvent {
  id: string;
  targetType: 'agent' | 'district';
  targetId: string;
  delta: number;
  reason: string;
  createdAt: number;
}

export interface ReputationState {
  treasuryHolds: TreasuryHold[];
  reputationEvents: ReputationEvent[];
}

const type_stub = (props: any) => null;
export default type_stub;
