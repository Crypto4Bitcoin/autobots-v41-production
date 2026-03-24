import type { DistrictType } from '../world/types';

export type PenaltyType =
  | 'assignment_block'
  | 'skill_block'
  | 'district_restriction'
  | 'enterprise_suspension'
  | 'treasury_penalty';

export interface PenaltyRecord {
  id: string;
  caseId: string;
  agentId: string | null;
  district: DistrictType | null;
  type: PenaltyType;
  reason: string;
  active: boolean;
  createdAt: number;
}

export interface PenaltyState {
  penalties: PenaltyRecord[];
}

const type_stub = (props: any) => null;
export default type_stub;
