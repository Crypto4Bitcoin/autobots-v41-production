import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class CompositionAgent extends BaseAgent {
  name = "CompositionAgent";
  description = "Composes master content based on strategy, persona, and angle.";
  supportedStates = [PipelineState.CONTENT_COMPOSITION];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Composing master content");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Composition Agent for AutoBots.
      Write the MASTER content based on the following strategy.
      
      Strategy: ${data.strategyData?.strategyName} - ${data.strategyData?.outline?.join(", ")}
      Persona: ${data.personaData?.personaName}
      Angle: ${data.angleData?.chosenAngle}
      
      Generate a high-quality, professional piece of content.
      
      Return a JSON object:
      {
        "masterTitle": "Generated Title",
        "masterBody": "The full content body...",
        "tone": "Professional",
        "wordCount": 300
      }
    `;

    const result = await this.chatWithPolicy(prompt, input, { temperature: 0.6 });
    
    if (!result.success) {
      return this.failure(`Composition failed: ${result.error}`);
    }

    try {
      const compositionData = JSON.parse(result.text);
      return this.success(
        { ...data, compositionData },
        PipelineState.REPURPOSING,
        { type: "composition_draft", data: compositionData }
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse composition data: ${result.text}`);
    }
  }
}
