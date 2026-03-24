import type { DistrictType } from '../world/types';

export interface AgentRiskForecast {
  agentId: string;
  agentName: string;
  district: DistrictType;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  createdAt: number;
}

export interface DistrictRiskForecast {
  district: DistrictType;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  createdAt: number;
}

export interface TreasuryExposureForecast {
  estimatedHeldAmount: number;
  estimatedReleasedAmount: number;
  estimatedQuarantineRisk: number;
  createdAt: number;
}

export interface PreReviewSignal {
  id: string;
  taskId: string;
  agentId: string | null;
  district: DistrictType;
  label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: number;
}

export interface ForecastingState {
  agentForecasts: AgentRiskForecast[];
  districtForecasts: DistrictRiskForecast[];
  treasuryExposure: TreasuryExposureForecast | null;
  preReviewSignals: PreReviewSignal[];
}

const type_stub = (props: any) => null;
export default type_stub;
