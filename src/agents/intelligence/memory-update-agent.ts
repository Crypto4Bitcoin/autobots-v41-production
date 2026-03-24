import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

import { MemoryService } from "@/lib/services/memory-service";

export class MemoryUpdateAgent extends BaseAgent {
  name = "MemoryUpdateAgent";
  description = "Autonomous agent specialized in memoryupdate operations.";
  supportedStates = [PipelineState.MEMORY_UPDATE];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, workspaceId, payload } = input;
    await this.log(pipelineItemId, "Updating persistent memory patterns");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Memory Update Agent for AutoBots.
      Extract reusable patterns from this successful content cycle.
      
      Return a JSON object:
      {
        "contentPatterns": ["pattern 1"],
        "audienceInsights": ["insight 1"],
        "promptRefinement": "Suggested tweak to CompositionAgent prompt..."
      }
    `;

    const result = await this.providerRouter.chat(prompt, { temperature: 0.2, strategy: 'cost' });
    
    if (!result.success) {
      return this.failure(`Memory update failed: ${result.error}`);
    }

    try {
      const memoryData = JSON.parse(result.text);
      
      // Quality Guard: Only persist if performance threshold is met (Mock check)
      const performanceScore = data.qualityScore || 0.8; // Assume 0.8 if not provided
      if (performanceScore < 0.7) {
        await this.log(pipelineItemId, "Memory threshold not met. Skipping persistence.");
        return this.success({ ...data, memorySkipped: true }, PipelineState.COMPLETED);
      }

      // Persist to memory_records
      await MemoryService.recordPattern(
        workspaceId,
        "content", 
        `pattern_${pipelineItemId}`, 
        memoryData
      );
      
      return this.success(
        { ...data, memoryData },
        PipelineState.COMPLETED
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse memory data: ${result.text}`);
    }
  }
}
