import { EvolutionProposal } from "./evolution-proposal-service";

export class DeterminismGuardService {
  static validate(proposal: EvolutionProposal) {
    // Blocks mutations to execution paths that cannot guarantee identical outputs
    if (proposal.proposedChange.targetType === "routing_strategy" && proposal.proposedChange.mutations?.nondeterministic) {
      throw new Error("Determinism Guard Violation: Proposal introduces non-deterministic routing that breaks execution guarantees.");
    }
    return true;
  }
}

export class CostGuardService {
  static validate(proposal: EvolutionProposal) {
    if (proposal.expectedBenefits.costReductionUsd && proposal.expectedBenefits.costReductionUsd < 0) {
      throw new Error("Cost Guard Violation: Proposal projects increased baseline costs beyond acceptable thresholds.");
    }
    return true;
  }
}

export class SafetyGuardService {
  static validate(proposal: EvolutionProposal) {
    const mutations = proposal.proposedChange.mutations;
    if (mutations?.escalatePermissions || mutations?.crossTenantAccess) {
       throw new Error("Safety Guard Violation: Proposal attempts to modify security policies or tenant boundaries.");
    }
    if (mutations?.directProductionWrite) {
       throw new Error("Safety Guard Violation: Proposal attempts unsafe direct production mutation.");
    }
    return true;
  }
}
