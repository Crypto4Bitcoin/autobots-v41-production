import { create } from 'zustand';
import type { SimulationDecision, SimulationState } from '../lib/simulation/types';
import { simulateTaskRouting } from '../lib/simulation/simulationEngine';
import { useWorldStore } from './worldStore';
import { usePenaltyStore } from './penaltyStore';
import { usePolicyStore } from './policyStore';
import { shouldBlockAssignment } from '../lib/policy/policyEngine';

interface SimulationStore extends SimulationState {
  setStrategy: (strategy: SimulationState['strategy']) => void;
  simulateTask: (input: {
    taskId: string;
    requiredRole: string;
    payoutAmount: number;
  }) => SimulationDecision;
  clearDecisions: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  decisions: [],
  strategy: 'balanced',

  setStrategy: (strategy) => set({ strategy }),

  simulateTask: (input) => {
    const world = useWorldStore.getState();
    const penalties = usePenaltyStore.getState().penalties;
    const fallbackStrategy = get().strategy;
    const compiledPolicy = usePolicyStore.getState().compiledPolicy;

    const strategy = compiledPolicy?.simulationPreference ?? fallbackStrategy;

    const decision = simulateTaskRouting({
      taskId: input.taskId,
      requiredRole: input.requiredRole,
      payoutAmount: input.payoutAmount,
      agents: world.agents,
      districts: world.districts,
      penalties,
      strategy,
    });

    const selected = decision.candidates.find((candidate) => candidate.selected);

    let patchedDecision = decision;

    if (
      selected &&
      compiledPolicy &&
      shouldBlockAssignment(
        selected.projectedRisk,
        compiledPolicy.assignmentRiskTolerance
      )
    ) {
      patchedDecision = {
        ...decision,
        selectedAgentId: null,
        selectedAgentName: null,
        reasons: [
          `Policy blocked assignment: projected risk ${selected.projectedRisk} exceeds tolerance ${compiledPolicy.assignmentRiskTolerance}`,
          ...decision.reasons,
        ],
        candidates: decision.candidates.map((candidate) => ({
          ...candidate,
          selected: false,
        })),
      };
    }

    set((state) => ({
      decisions: [patchedDecision, ...state.decisions].slice(0, 20),
    }));

    return patchedDecision;
  },

  clearDecisions: () => set({ decisions: [] }),
}));
