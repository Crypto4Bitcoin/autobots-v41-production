import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class AngleAgent extends BaseAgent {
  name = "AngleAgent";
  description = "Autonomous agent specialized in angle operations.";
  supportedStates = [PipelineState.ANGLE_GENERATION];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Brainstorming content angles");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    const research = data.researchPack;

    const prompt = `
      You are the Angle Agent for AutoBots.
      Based on the following research, suggest the strongest narrative angle.
      
      Research Summary: ${research?.summary || "N/A"}
      Key Claims: ${research?.keyClaims?.join(", ") || "N/A"}
      Keywords: ${research?.keywords?.join(", ") || "N/A"}
      
      Suggest 3-5 angles (e.g., curiosity, contrarian, educational, urgent, personal).
      Pick the BEST one for maximum engagement.
      
      Return a JSON object:
      {
        "chosenAngle": "Educational",
        "rationale": "Why this angle wins",
        "hookPreview": "A sample hook for this angle",
        "alternateAngles": ["Angle 1", "Angle 2"]
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.7 });
    
    if (!result.success) {
      return this.failure(`Angle generation failed: ${result.error}`);
    }

    try {
      const angleData = JSON.parse(result.text);
      return this.success(
        { ...data, angleData },
        PipelineState.CONTENT_STRATEGY
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse angle data: ${result.text}`);
    }
  }
}
