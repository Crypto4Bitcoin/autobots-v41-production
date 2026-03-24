import { create } from 'zustand';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AuditCaseRecord, AuditEvidence, AuditState, AuditTimelineEntry } from '../lib/audit/types';
import {
  createAuditEvidence,
  createAuditRecord,
  createAuditTimelineEntry,
} from '../lib/audit/auditEngine';

interface AuditStore extends AuditState {
  openAuditRecord: (input: {
    caseId: string;
    agentId: string | null;
    taskId: string | null;
  }) => void;
  addEvidence: (caseId: string, label: string, value: string) => void;
  addTimelineEntry: (caseId: string, label: string) => void;
  markVerified: (caseId: string) => void;
  markForfeited: (caseId: string) => void;
  markRestored: (caseId: string) => void;
  archiveCase: (caseId: string) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  records: [],
  evidence: [],
  timeline: [],

  openAuditRecord: (input) =>
    set((state) => ({
      records: [createAuditRecord(input), ...state.records],
      timeline: [
        createAuditTimelineEntry({
          caseId: input.caseId,
          label: 'Audit record opened',
        }),
        ...state.timeline,
      ],
    })),

  addEvidence: (caseId, label, value) =>
    set((state) => ({
      evidence: [
        createAuditEvidence({ caseId, label, value }),
        ...state.evidence,
      ],
    })),

  addTimelineEntry: (caseId, label) =>
    set((state) => ({
      timeline: [
        createAuditTimelineEntry({ caseId, label }),
        ...state.timeline,
      ],
    })),

  markVerified: (caseId) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.caseId === caseId
          ? { ...record, status: 'verified', updatedAt: Date.now() }
          : record
      ),
      timeline: [
        createAuditTimelineEntry({
          caseId,
          label: 'Case marked verified',
        }),
        ...state.timeline,
      ],
    })),

  markForfeited: (caseId) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.caseId === caseId
          ? {
              ...record,
              status: 'forfeited',
              recoveryEligible: false,
              updatedAt: Date.now(),
            }
          : record
      ),
      timeline: [
        createAuditTimelineEntry({
          caseId,
          label: 'Case marked forfeited',
        }),
        ...state.timeline,
      ],
    })),

  markRestored: (caseId) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.caseId === caseId
          ? { ...record, status: 'restored', updatedAt: Date.now() }
          : record
      ),
      timeline: [
        createAuditTimelineEntry({
          caseId,
          label: 'Recovery flow completed',
        }),
        ...state.timeline,
      ],
    })),

  archiveCase: (caseId) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.caseId === caseId
          ? { ...record, status: 'archived', updatedAt: Date.now() }
          : record
      ),
      timeline: [
        createAuditTimelineEntry({
          caseId,
          label: 'Case archived',
        }),
        ...state.timeline,
      ],
    })),
}));
