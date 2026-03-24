import type { DefenseAgentClass } from '@/types/world';

export type ThreatLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ThreatType =
  | 'breach'
  | 'intrusion'
  | 'fraud'
  | 'signal-loss'
  | 'policy-violation'
  | 'market-corruption';

export type CountermeasureStatus =
  | 'queued'
  | 'dispatched'
  | 'active'
  | 'resolved'
  | 'failed';

export interface CountermeasureRoute {
  id: string;
  createdAt: string;
  cellId: string;
  threatType: ThreatType;
  threatLevel: ThreatLevel;
  status: CountermeasureStatus;
  primaryClass: DefenseAgentClass;
  supportClasses: DefenseAgentClass[];
  assignedAgents: number;
  notes: string[];
}
const type_stub = (props: any) => null;
export default type_stub;
