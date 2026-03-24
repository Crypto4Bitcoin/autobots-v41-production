import { create } from 'zustand';
import type {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  AuditTimelineEvent,
  EnforcementState,
  QuarantinePayout,
} from '../lib/enforcement/types';
import { useWorldStore } from './worldStore';
import { releaseAgent } from '../lib/enforcement/enforcementEngine';
import { resolveLevelFromXp } from '../lib/progression/progressionEngine';
import { useAuditStore } from './auditStore';
import { useGovernanceStore } from './governanceStore';
import { usePenaltyStore } from './penaltyStore';
import { useReputationStore } from './reputationStore';

interface EnforcementStore extends EnforcementState {
  quarantinePayout: (
    input: Omit<QuarantinePayout, 'id' | 'status' | 'createdAt'>
  ) => void;
  addAuditEvent: (caseId: string, label: string) => void;
  verifyCaseAndRelease: (caseId: string) => void;
  forfeitCasePayout: (caseId: string) => void;
}

export const useEnforcementStore = create<EnforcementStore>((set, get) => ({
  quarantinedPayouts: [],
  auditTimeline: [],

  quarantinePayout: (input) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find((a) => a.id === input.agentId);

    useAuditStore.getState().openAuditRecord({
      caseId: input.caseId,
      agentId: input.agentId,
      taskId: input.taskId,
    });

    useAuditStore.getState().addEvidence(
      input.caseId,
      'Quarantined payout amount',
      `$${input.amount}`
    );

    useAuditStore.getState().addEvidence(
      input.caseId,
      'Held XP amount',
      `${input.xpAmount}`
    );

    useAuditStore.getState().addTimelineEntry(
      input.caseId,
      'Enforcement quarantine initiated'
    );

    usePenaltyStore.getState().addPenalty({
      caseId: input.caseId,
      agentId: input.agentId,
      district: agent?.district ?? null,
      type: 'assignment_block',
      reason: 'Agent assignment blocked during enforcement review',
    });

    usePenaltyStore.getState().addPenalty({
      caseId: input.caseId,
      agentId: input.agentId,
      district: agent?.district ?? null,
      type: 'skill_block',
      reason: 'Skill unlocks suspended during enforcement review',
    });

    if (agent?.path === 'enterprise') {
      usePenaltyStore.getState().addPenalty({
        caseId: input.caseId,
        agentId: input.agentId,
        district: agent.district,
        type: 'enterprise_suspension',
        reason: 'Enterprise privileges suspended pending verification',
      });
    }

    if (agent?.district) {
      usePenaltyStore.getState().setDistrictRestriction(agent.district, 'restricted');

      usePenaltyStore.getState().addPenalty({
        caseId: input.caseId,
        agentId: input.agentId,
        district: agent.district,
        type: 'district_restriction',
        reason: 'District moved into restricted mode due to unresolved case',
      });

      useReputationStore
        .getState()
        .changeDistrictTrust(agent.district, -6, 'Restricted due to enforcement case');
    }

    if (agent) {
      useReputationStore
        .getState()
        .changeAgentTrust(agent.id, -12, 'Quarantined by enforcement review');
    }

    set((state) => ({
      quarantinedPayouts: [
        {
          id: `qp-${input.caseId}-${Date.now()}`,
          ...input,
          status: 'quarantined',
          createdAt: Date.now(),
        },
        ...state.quarantinedPayouts,
      ],
      auditTimeline: [
        {
          id: `audit-${input.caseId}-${Date.now()}`,
          caseId: input.caseId,
          label: `Payout quarantined: $${input.amount}, XP ${input.xpAmount}`,
          createdAt: Date.now(),
        },
        ...state.auditTimeline,
      ],
    }));
  },

  addAuditEvent: (caseId, label) => {
    useAuditStore.getState().addTimelineEntry(caseId, label);

    set((state) => ({
      auditTimeline: [
        {
          id: `audit-${caseId}-${Date.now()}`,
          caseId,
          label,
          createdAt: Date.now(),
        },
        ...state.auditTimeline,
      ],
    }));
  },

  verifyCaseAndRelease: (caseId) => {
    const world = useWorldStore.getState();
    const record = get().quarantinedPayouts.find((item) => item.caseId === caseId);
    if (!record) return;

    const agentBefore = world.agents.find((a) => a.id === record.agentId);

    useWorldStore.setState({
      agents: world.agents.map((agent) => {
        if (agent.id !== record.agentId) return agent;

        const nextXp = agent.xp + record.xpAmount;
        return {
          ...releaseAgent(agent),
          money: agent.money + record.amount,
          xp: nextXp,
          level: resolveLevelFromXp(nextXp),
        };
      }),
      market: {
        ...world.market,
        totalValue: world.market.totalValue + record.amount,
      },
    });

    useGovernanceStore.getState().verifyCase(caseId);
    useAuditStore.getState().markVerified(caseId);
    useAuditStore.getState().markRestored(caseId);
    usePenaltyStore.getState().clearPenaltiesForCase(caseId);

    if (agentBefore?.district) {
      usePenaltyStore.getState().setDistrictRestriction(agentBefore.district, 'open');

      useReputationStore
        .getState()
        .changeDistrictTrust(agentBefore.district, 4, 'District restored after verification');
    }

    if (agentBefore) {
      useReputationStore
        .getState()
        .changeAgentTrust(agentBefore.id, 6, 'Verified and restored by enforcement');
    }

    set((state) => ({
      quarantinedPayouts: state.quarantinedPayouts.map((item) =>
        item.caseId === caseId
          ? { ...item, status: 'released', releasedAt: Date.now() }
          : item
      ),
      auditTimeline: [
        {
          id: `audit-${caseId}-${Date.now()}`,
          caseId,
          label: 'Case verified and payout released',
          createdAt: Date.now(),
        },
        ...state.auditTimeline,
      ],
    }));
  },

  forfeitCasePayout: (caseId) => {
    const world = useWorldStore.getState();
    const record = get().quarantinedPayouts.find((item) => item.caseId === caseId);
    const agent = world.agents.find((a) => a.id === record?.agentId);

    useGovernanceStore.getState().flagCase(caseId);
    useAuditStore.getState().markForfeited(caseId);
    useAuditStore.getState().addTimelineEntry(caseId, 'Payout permanently withheld');

    if (agent?.district) {
      usePenaltyStore.getState().setDistrictRestriction(agent.district, 'locked');

      useReputationStore
        .getState()
        .changeDistrictTrust(agent.district, -14, 'District locked after forfeited case');
    }

    if (agent) {
      useReputationStore
        .getState()
        .changeAgentTrust(agent.id, -20, 'Case forfeited under enforcement');
    }

    usePenaltyStore.getState().addPenalty({
      caseId,
      agentId: agent?.id ?? null,
      district: agent?.district ?? null,
      type: 'treasury_penalty',
      reason: 'Forfeited case triggered institutional treasury penalty',
    });

    set((state) => ({
      quarantinedPayouts: state.quarantinedPayouts.map((item) =>
        item.caseId === caseId ? { ...item, status: 'forfeited' } : item
      ),
      auditTimeline: [
        {
          id: `audit-${caseId}-${Date.now()}`,
          caseId,
          label: 'Case payout forfeited',
          createdAt: Date.now(),
        },
        ...state.auditTimeline,
      ],
    }));
  },
}));
