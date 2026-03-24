import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";

export class ClassifyAgent extends BaseAgent {
  name = "ClassifyAgent";
  description = "Autonomous agent specialized in classify operations.";
  supportedStates = [PipelineState.CLASSIFYING_INPUT];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Classifying input for routing");

    const data = payload as { detectedType: string; url?: string; text?: string };
    
    // AI Classification Prompt
    const prompt = `
      You are the Classification Agent for AutoBots. 
      Analyze the following source and determine the next pipeline stage.
      
      Source Type: ${data.detectedType}
      URL: ${data.url || "N/A"}
      Text Preview: ${data.text ? data.text.substring(0, 500) : "N/A"}
      
      Next Stage Rules:
      - If it is a Video (YouTube) or Audio file, go to EXTRACTING_MEDIA.
      - If it is a Website/Article or raw text, go to RESEARCHING.
      - If it is an image or social post link, go to RESEARCHING.
      
      Return ONLY a JSON object:
      {
        "nextStage": "EXTRACTING_MEDIA" | "RESEARCHING" | "FAILED",
        "reason": "Brief explanation"
      }
    `;

    const result = await this.providerRouter.chat(prompt, { 
      temperature: 0,
      taskClass: 'classification'
    });
    
    if (!result.success) {
      return this.failure(`AI Classification failed: ${result.error}`);
    }

    try {
      const parsed = JSON.parse(result.text);
      const nextState = PipelineState[parsed.nextStage as keyof typeof PipelineState];
      
      if (!nextState) {
        return this.failure(`Invalid next stage returned: ${parsed.nextStage}`);
      }

      return this.success(
        { ...data, classificationReason: parsed.reason },
        nextState
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse AI classification: ${result.text}`);
    }
  }
}
