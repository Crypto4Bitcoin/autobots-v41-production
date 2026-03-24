import type { AuditCaseRecord, AuditEvidence, AuditTimelineEntry } from './types';

export function createAuditRecord(input: {
  caseId: string;
  agentId: string | null;
  taskId: string | null;
}): AuditCaseRecord {
  const now = Date.now();

  return {
    caseId: input.caseId,
    agentId: input.agentId,
    taskId: input.taskId,
    status: 'pending',
    recoveryEligible: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAuditEvidence(input: {
  caseId: string;
  label: string;
  value: string;
}): AuditEvidence {
  return {
    id: `evidence-${input.caseId}-${Date.now()}`,
    caseId: input.caseId,
    label: input.label,
    value: input.value,
    createdAt: Date.now(),
  };
}

export function createAuditTimelineEntry(input: {
  caseId: string;
  label: string;
}): AuditTimelineEntry {
  return {
    id: `timeline-${input.caseId}-${Date.now()}`,
    caseId: input.caseId,
    label: input.label,
    createdAt: Date.now(),
  };
}
