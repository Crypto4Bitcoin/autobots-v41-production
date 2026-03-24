export type AuditCaseOutcome =
  | 'pending'
  | 'verified'
  | 'forfeited'
  | 'restored'
  | 'archived';

export interface AuditEvidence {
  id: string;
  caseId: string;
  label: string;
  value: string;
  createdAt: number;
}

export interface AuditTimelineEntry {
  id: string;
  caseId: string;
  label: string;
  createdAt: number;
}

export interface AuditCaseRecord {
  caseId: string;
  agentId: string | null;
  taskId: string | null;
  status: AuditCaseOutcome;
  recoveryEligible: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AuditState {
  records: AuditCaseRecord[];
  evidence: AuditEvidence[];
  timeline: AuditTimelineEntry[];
}

const type_stub = (props: any) => null;
export default type_stub;
