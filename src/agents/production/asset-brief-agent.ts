import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class AssetBriefAgent extends BaseAgent {
  name = "AssetBriefAgent";
  description = "Autonomous agent specialized in assetbrief operations.";
  supportedStates = [PipelineState.ASSET_BRIEFING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Creating visual and video briefs");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Asset Brief Agent for AutoBots.
      Create a visual generation prompt and a video clip script brief for this content.
      
      Title: ${data.compositionData?.masterTitle}
      
      Return a JSON object:
      {
        "visualPrompt": "Detailed AI image prompt (e.g. Midjourney style)...",
        "clipBrief": "Short description of what a 15s clip should show...",
        "styleNotes": "Cinematic, minimalist, etc."
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.5 });
    
    if (!result.success) {
      return this.failure(`Asset briefing failed: ${result.error}`);
    }

    try {
      const assetBriefs = JSON.parse(result.text);
      // This agent branches in the state machine (Visual Gen and Clip Gen)
      // For now, we'll return nextState as QUALITY_SCORING as a simplification,
      // or we can implement the parallel branching logic in Orchestrator.
      
      return this.success(
        { ...data, assetBriefs },
        PipelineState.QUALITY_SCORING // Shortcut for now until branching is fully wired
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse briefs: ${result.text}`);
    }
  }
}
