import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class ViralityScorerAgent extends BaseAgent {
  name = "ViralityScorerAgent";
  description = "Autonomous agent specialized in viralityscorer operations.";
  supportedStates = [PipelineState.VIRALITY_SCORING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Predicting virality and engagement");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Virality Scorer Agent for AutoBots.
      Predict the engagement potential of this content.
      
      Return a JSON object:
      {
        "viralityScore": 0.0-10.0,
        "explanation": "Why it will or won't go viral",
        "hookStrength": 0.0-10.0,
        "suggestions": ["Add a question at the end", "Use more whitespace"]
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.3 });
    
    if (!result.success) {
      return this.failure(`Virality scoring failed: ${result.error}`);
    }

    try {
      const virality = JSON.parse(result.text);
      return this.success(
        { ...data, viralityScore: virality },
        PipelineState.COMPLIANCE_CHECK
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse virality score: ${result.text}`);
    }
  }
}
