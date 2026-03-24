export type GovernanceSeverity = 'low' | 'medium' | 'high' | 'critical';

export type GovernanceCaseStatus =
  | 'open'
  | 'reviewing'
  | 'verified'
  | 'flagged'
  | 'jailed'
  | 'resolved';

export interface GovernanceCase {
  id: string;
  agentId: string | null;
  taskId: string | null;
  reason: string;
  severity: GovernanceSeverity;
  status: GovernanceCaseStatus;
  createdAt: number;
}

export interface GovernanceEvent {
  id: string;
  caseId: string;
  description: string;
  createdAt: number;
}

export interface GovernanceState {
  cases: GovernanceCase[];
  events: GovernanceEvent[];
}
const type_stub = (props: any) => null;
export default type_stub;
