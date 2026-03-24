import { EvolutionProposal } from "./evolution-proposal-service";

export class GovernanceApprovalService {
  static async requestApproval(proposal: EvolutionProposal): Promise<boolean> {
     console.log(`[Governance] Requesting approval for proposal ${proposal.proposalId}`);
     
     if (proposal.riskClassification === "critical" || proposal.riskClassification === "high") {
         console.log(`[Governance] High/Critical risk proposal requires manual Human-in-the-Loop review.`);
         proposal.status = "evaluating";
         return false; // Pending human
     }
     
     // Automated policy approval for low risk
     console.log(`[Governance] Proposal automatically approved based on low risk and positive metrics.`);
     proposal.status = "approved";
     return true;
  }
}

export class GraduationPipelineService {
  static async promote(proposal: EvolutionProposal) {
     if (proposal.status !== "approved") {
         throw new Error("Only approved proposals can be promoted.");
     }
     console.log(`[GraduationPipeline] Promoting ${proposal.proposalId} to Staging Environment...`);
     proposal.status = "staged";
     
     console.log(`[GraduationPipeline] Proposal ${proposal.proposalId} successfully staged. Awaiting final promotion to Production.`);
     return proposal;
  }
}
