import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class TrendDiscoveryAgent extends BaseAgent {
  name = "TrendDiscoveryAgent";
  description = "Analyzes topic relevance against current market trends.";
  supportedStates = [PipelineState.TREND_ANALYSIS];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Checking trend relevance");

    // In a real system, this would call a trends API (e.g., Google Trends, X Trends).
    // For now, it will tag topic relevance.
    return this.success(
      payload, 
      PipelineState.ANGLE_GENERATION,
      { type: "trend_report", data: { trendDetected: true, ...(payload as object) } }
    );
  }
}
