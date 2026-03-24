import type { DistrictType } from '../world/types';

export interface RouteCandidate {
  taskId: string;
  agentId: string;
  agentName: string;
  district: DistrictType;
  projectedPayout: number;
  projectedHold: number;
  projectedRisk: number;
  trustScore: number;
  selected: boolean;
  reasons: string[];
}

export interface SimulationDecision {
  taskId: string;
  selectedAgentId: string | null;
  selectedAgentName: string | null;
  strategy: 'balanced' | 'low_risk' | 'max_yield';
  reasons: string[];
  candidates: RouteCandidate[];
  createdAt: number;
}

export interface SimulationState {
  decisions: SimulationDecision[];
  strategy: 'balanced' | 'low_risk' | 'max_yield';
}

const type_stub = (props: any) => null;
export default type_stub;
