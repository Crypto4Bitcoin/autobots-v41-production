import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService } from "@/lib/services/supabase-service";

export class ResearchAgent extends BaseAgent {
  name = "ResearchAgent";
  description = "Autonomous agent specialized in research operations.";
  supportedStates = [PipelineState.RESEARCHING];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Synthesizing research pack");

    const data = payload as { url?: string; text?: string; detectedType: string };
    
    // In a real system, we'd use a web scraper or search tool here.
    // For now, we'll use the available text or metadata to generate a strategy.
    
    const prompt = `
      You are the Research Agent for AutoBots.
      Analyze the source material and build a factual foundation.
      
      Type: ${data.detectedType}
      URL: ${data.url || "N/A"}
      Source Content: ${data.text ? data.text : "No text provided. Use the URL/Type context if available."}
      
      Return a JSON object with:
      {
        "summary": "Full overview of the topic",
        "keyClaims": ["claim 1", "claim 2"],
        "facts": ["fact 1", "fact 2"],
        "keywords": ["tag1", "tag2"],
        "audienceNotes": ["audience segment 1"],
        "confidence": 0.0-1.0
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.2 });
    
    if (!result.success) {
      return this.failure(`Research failed: ${result.error}`);
    }

    try {
      const researchPack = JSON.parse(result.text);
      
      // Store research pack in DB (Stage Output)
      // Note: In production, DBService would have a method for research_packs
      
      return this.success(
        { ...data, researchPack },
        PipelineState.FACT_CHECKING
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse research data: ${result.text}`);
    }
  }
}
