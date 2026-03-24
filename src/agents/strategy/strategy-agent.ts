import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class StrategyAgent extends BaseAgent {
  name = "StrategyAgent";
  description = "Autonomous agent specialized in strategy operations.";
  supportedStates = [PipelineState.CONTENT_STRATEGY];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Developing content strategy");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Strategy Agent for AutoBots.
      Combine the research, angle, and persona into a concrete content strategy.
      
      Angle: ${data.angleData?.chosenAngle}
      Persona: ${data.personaData?.personaName} - ${data.personaData?.description}
      
      Suggest the structure for the content (Hook, Body, CTA).
      
      Return a JSON object:
      {
        "strategyName": "The 3-Step Solution",
        "outline": ["Hook: The problem", "Body: The steps", "CTA: Read more"],
        "keyTakeaways": ["insight 1", "insight 2"],
        "platforms": ["LinkedIn", "Twitter", "Newsletter"]
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.5 });
    
    if (!result.success) {
      return this.failure(`Strategy development failed: ${result.error}`);
    }

    try {
      const strategyData = JSON.parse(result.text);
      return this.success(
        { ...data, strategyData },
        PipelineState.CONTENT_COMPOSITION
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse strategy data: ${result.text}`);
    }
  }
}
