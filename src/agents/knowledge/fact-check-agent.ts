import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class FactCheckAgent extends BaseAgent {
  name = "FactCheckAgent";
  description = "Autonomous agent specialized in factcheck operations.";
  supportedStates = [PipelineState.FACT_CHECKING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Verifying claims and facts");

    // For now, this is a pass-through that could be expanded with real verification tools
    return this.success(payload, PipelineState.TREND_ANALYSIS);
  }
}
