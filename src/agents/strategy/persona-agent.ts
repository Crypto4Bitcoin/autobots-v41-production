import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class PersonaAgent extends BaseAgent {
  name = "PersonaAgent";
  description = "Autonomous agent specialized in persona operations.";
  supportedStates = [PipelineState.PERSONA_MODELING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Modeling target audience persona");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    const angle = data.angleData?.chosenAngle || "General";

    const prompt = `
      You are the Persona Agent for AutoBots.
      Define the ideal target audience persona for this content angle: "${angle}".
      
      Research: ${JSON.stringify(data.researchPack?.summary || {})}
      
      Return a JSON object:
      {
        "personaName": "The Busy Professional",
        "description": "Who they are and why they care",
        "painPoints": ["time management", "overwhelm"],
        "desires": ["efficiency", "clarity"],
        "tonePreference": "Informative yet punchy"
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.5 });
    
    if (!result.success) {
      return this.failure(`Persona modeling failed: ${result.error}`);
    }

    try {
      const personaData = JSON.parse(result.text);
      return this.success(
        { ...data, personaData },
        PipelineState.CONTENT_STRATEGY
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse persona data: ${result.text}`);
    }
  }
}
