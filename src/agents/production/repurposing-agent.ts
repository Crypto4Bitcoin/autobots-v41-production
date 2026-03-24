import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class RepurposingAgent extends BaseAgent {
  name = "RepurposingAgent";
  description = "Autonomous agent specialized in repurposing operations.";
  supportedStates = [PipelineState.REPURPOSING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Repurposing master content for platforms");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    const masterContent = data.compositionData?.masterBody || "";
    
    const prompt = `
      You are the Repurposing Agent for AutoBots.
      Rewrite the following master content for these platforms: Twitter (X), LinkedIn, and Instagram.
      
      Master Content: ${masterContent}
      
      Return a JSON object:
      {
        "twitter": "Short, punchy thread or post...",
        "linkedin": "Professional, insightful post...",
        "instagram": "Visual-first caption with emojis..."
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.7 });
    
    if (!result.success) {
      return this.failure(`Repurposing failed: ${result.error}`);
    }

    try {
      const platformVariants = JSON.parse(result.text);
      return this.success(
        { ...data, platformVariants },
        PipelineState.ASSET_BRIEFING
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse variants: ${result.text}`);
    }
  }
}
