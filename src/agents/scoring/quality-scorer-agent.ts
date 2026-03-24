import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class QualityScorerAgent extends BaseAgent {
  name = "QualityScorerAgent";
  description = "Autonomous agent specialized in qualityscorer operations.";
  supportedStates = [PipelineState.QUALITY_SCORING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Executing quality assessment");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    const content = data.compositionData?.masterBody || "";
    
    const prompt = `
      You are the Quality Scorer Agent for AutoBots.
      Evaluate the following content for:
      - Clarity
      - Grammar
      - Fact-alignment
      - Professionalism
      
      Content: ${content}
      
      Return a JSON object:
      {
        "score": 0.0-10.0,
        "feedback": "Specific improvements or praise",
        "passed": true/false
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0 });
    
    if (!result.success) {
      return this.failure(`Quality scoring failed: ${result.error}`);
    }

    try {
      const scoring = JSON.parse(result.text);
      return this.success(
        { ...data, qualityScore: scoring },
        PipelineState.VIRALITY_SCORING
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse quality score: ${result.text}`);
    }
  }
}
