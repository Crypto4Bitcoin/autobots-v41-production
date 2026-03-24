import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class IntakeAgent extends BaseAgent {
  name = "IntakeAgent";
  description = "Autonomous agent specialized in intake operations.";
  supportedStates = [PipelineState.INPUT_RECEIVED];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Processing raw ingestion");

    // In a real system, payload would contain the source URL or text
    const sourceData = payload as { url?: string; text?: string; type?: string };
    
    // Normalize Classification
    let sourceType = sourceData.type || "UNKNOWN";
    if (sourceData.url) {
      if (sourceData.url.includes("youtube.com") || sourceData.url.includes("youtu.be")) {
        sourceType = "YOUTUBE_VIDEO";
      } else if (sourceData.url.includes("twitter.com") || sourceData.url.includes("x.com")) {
        sourceType = "X_POST";
      } else {
        sourceType = "WEBSITE_URL";
      }
    } else if (sourceData.text) {
      sourceType = "RAW_TEXT";
    }

    return this.success(
      { ...sourceData, detectedType: sourceType },
      PipelineState.CLASSIFYING_INPUT
    );
  }
}
