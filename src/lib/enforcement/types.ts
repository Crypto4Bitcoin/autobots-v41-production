export type EnforcementStatus =
  | 'quarantined'
  | 'under_review'
  | 'verified'
  | 'released'
  | 'forfeited';

export interface QuarantinePayout {
  id: string;
  caseId: string;
  agentId: string;
  taskId: string;
  amount: number;
  xpAmount: number;
  status: EnforcementStatus;
  createdAt: number;
  releasedAt?: number;
}

export interface AuditTimelineEvent {
  id: string;
  caseId: string;
  label: string;
  createdAt: number;
}

export interface EnforcementState {
  quarantinedPayouts: QuarantinePayout[];
  auditTimeline: AuditTimelineEvent[];
}

const type_stub = (props: any) => null;
export default type_stub;

export const // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AuditTimelineEvent = (props: any) => null;
export class // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AuditTimelineEventStub { static async execute() { return {}; } }
