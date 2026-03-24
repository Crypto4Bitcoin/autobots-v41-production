import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class ExpansionAgent extends BaseAgent {
  name = "ExpansionAgent";
  description = "Autonomous agent specialized in expansion operations.";
  supportedStates = [PipelineState.EXPANSION];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Brainstorming content expansion and sequels");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Expansion Agent for AutoBots.
      Analyze the success of this content cycle and suggest 3 sequel ideas or related topics to expand the authority.
      
      Topic: ${data.compositionData?.masterTitle}
      
      Return a JSON object:
      {
        "expansionIdeas": ["topic 1", "topic 2", "topic 3"],
        "recommendedFormat": "Newsletter series",
        "nextSteps": "Launch topic 1 in 48 hours"
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.8 });
    
    if (!result.success) {
      return this.failure(`Expansion failed: ${result.error}`);
    }

    try {
      const expansionData = JSON.parse(result.text);
      return this.success(
        { ...data, expansionData },
        PipelineState.MEMORY_UPDATE
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse expansion data: ${result.text}`);
    }
  }
}
