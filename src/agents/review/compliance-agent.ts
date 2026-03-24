import { BaseAgent } from "../base-agent";
import { AgentInput, AgentOutput } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";

export class ComplianceAgent extends BaseAgent {
  name = "ComplianceAgent";
  description = "Validates content against safety guidelines and platform policies.";
  supportedStates = [PipelineState.COMPLIANCE_CHECK];

  async process(input: AgentInput): Promise<AgentOutput> {
    const { pipelineItemId, payload } = input;
    await this.log(pipelineItemId, "Running safety and platform compliance checks");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = payload as any;
    
    const prompt = `
      You are the Compliance Agent for AutoBots.
      Check the content for:
      - Hate speech, harassment, or toxicity
      - Platform policy violations
      - Copyright/Trademark red flags
      
      Return a JSON object:
      {
        "status": "PASS" | "FAIL" | "WARNING",
        "redFlags": ["flag 1"],
        "policyNotes": "Specific advice"
      }
    `;

    const result = await this.chatWithPolicy(prompt, input, { temperature: 0 });
    
    if (!result.success) {
      return this.failure(`Compliance check failed: ${result.error}`);
    }

    try {
      const compliance = JSON.parse(result.text);
      return this.success(
        { ...data, compliance },
        PipelineState.PLATFORM_REVIEW
      );
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return this.failure(`Failed to parse compliance: ${result.text}`);
    }
  }
}
