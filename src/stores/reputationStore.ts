import { create } from 'zustand';
import type { DistrictType } from '../lib/world/types';
import type { ReputationState } from '../lib/reputation/types';
import {
  clampTrustScore,
  getPayoutMultiplierFromTrust,
  getTreasuryHoldRateFromTrust,
} from '../lib/reputation/reputationEngine';
import { useWorldStore } from './worldStore';
import { calculateTrustDecay, calculateTrustRecovery } from '../lib/security/trustEngine';

interface ReputationStore extends ReputationState {
  addTreasuryHold: (input: {
    caseId: string | null;
    agentId: string;
    district: DistrictType;
    grossAmount: number;
    reason: string;
  }) => { heldAmount: number; releasedAmount: number };
  changeAgentTrust: (agentId: string, delta: number, reason: string) => void;
  applyTrustDecay: (agentId: string, failureCount: number, riskLevel: number) => void;
  applyTrustRecovery: (agentId: string, successStreak: number) => void;
  changeDistrictTrust: (district: DistrictType, delta: number, reason: string) => void;
  getAgentPayoutPreview: (agentId: string, grossAmount: number) => {
    multiplier: number;
    adjustedGross: number;
    heldAmount: number;
    releasedAmount: number;
  };
}

export const useReputationStore = create<ReputationStore>((set, get) => ({
  treasuryHolds: [],
  reputationEvents: [],

  addTreasuryHold: (input) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find((a) => a.id === input.agentId);
    const trustScore = agent?.trustScore ?? 75;
    const multiplier = getPayoutMultiplierFromTrust(trustScore);
    const adjustedGross = Math.round(input.grossAmount * multiplier);
    const holdRate = getTreasuryHoldRateFromTrust(trustScore);
    const heldAmount = Math.round(adjustedGross * holdRate);
    const releasedAmount = adjustedGross - heldAmount;
    set((state) => ({
      treasuryHolds: [{ id: "hld-" + Date.now(), ...input, grossAmount: adjustedGross, heldAmount, releasedAmount, createdAt: Date.now() }, ...state.treasuryHolds],
    }));
    return { heldAmount, releasedAmount };
  },

  changeAgentTrust: (agentId, delta, reason) => {
    const world = useWorldStore.getState();
    useWorldStore.setState({
      agents: world.agents.map((agent) =>
        agent.id === agentId ? { ...agent, trustScore: clampTrustScore(agent.trustScore + delta) } : agent
      ),
    });
    set((state) => ({
      reputationEvents: [{ id: "rep-" + Date.now(), targetType: 'agent', targetId: agentId, delta, reason, createdAt: Date.now() }, ...state.reputationEvents],
    }));
  },

  applyTrustDecay: (agentId, failures, risk) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find(a => a.id === agentId);
    if (!agent) return;
    const newTrust = calculateTrustDecay(agent.trustScore, failures, risk);
    const delta = newTrust - agent.trustScore;
    if (delta !== 0) get().changeAgentTrust(agentId, delta, "Automated Threat Decay (Phase 123)");
  },

  applyTrustRecovery: (agentId, streak) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find(a => a.id === agentId);
    if (!agent) return;
    const newTrust = calculateTrustRecovery(agent.trustScore, streak);
    const delta = newTrust - agent.trustScore;
    if (delta !== 0) get().changeAgentTrust(agentId, delta, "Performance Recovery (Phase 123)");
  },

  changeDistrictTrust: (district, delta, reason) => {
    const world = useWorldStore.getState();
    useWorldStore.setState({
      districts: world.districts.map((item) =>
        item.id === district ? { ...item, trustScore: clampTrustScore(item.trustScore + delta) } : item
      ),
    });
    set((state) => ({
      reputationEvents: [{ id: "repd-" + Date.now(), targetType: 'district', targetId: district, delta, reason, createdAt: Date.now() }, ...state.reputationEvents],
    }));
  },

  getAgentPayoutPreview: (agentId, grossAmount) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find((a) => a.id === agentId);
    const trustScore = agent?.trustScore ?? 75;
    const multiplier = getPayoutMultiplierFromTrust(trustScore);
    const adjustedGross = Math.round(grossAmount * multiplier);
    const holdRate = getTreasuryHoldRateFromTrust(trustScore);
    const heldAmount = Math.round(adjustedGross * holdRate);
    const releasedAmount = adjustedGross - heldAmount;
    return { multiplier, adjustedGross, heldAmount, releasedAmount };
  },
}));
