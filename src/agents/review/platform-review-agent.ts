import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class PlatformReviewAgent extends BaseAgent {
  name = "PlatformReviewAgent";
  description = "Autonomous agent specialized in platformreview operations.";
  supportedStates = [PipelineState.PLATFORM_REVIEW];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Final platform-specific formatting check");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    // This agent determines if it needs human review or can go straight to READY_TO_POST.
    const qualityScore = data.qualityScore?.score || 0;
    const isCompliant = data.compliance?.status === "PASS";
    
    const needsReview = qualityScore < 8 || !isCompliant;

    return this.success(
      data,
      needsReview ? PipelineState.NEEDS_REVIEW : PipelineState.READY_TO_POST
    );
  }
}
