import { Agent, AgentInput, AgentOutput, ProviderResult, Artifact } from "@/lib/types/agent-types";
import { PipelineState } from "@/lib/types/enums";
import { ProviderRouter, ProviderOptions } from "@/ai/provider-router";
import { DBService } from "@/lib/services/supabase-service";

export abstract class BaseAgent implements Agent {
  abstract name: string;
  abstract description: string;
  abstract supportedStates: PipelineState[];
  protected providerRouter: ProviderRouter;

  constructor() {
    this.providerRouter = ProviderRouter.createFromEnv();
  }

  abstract process(input: AgentInput): Promise<AgentOutput>;

  protected async chatWithPolicy(prompt: string, input: AgentInput, options?: ProviderOptions): Promise<ProviderResult> {
    const combinedOptions: ProviderOptions = {
      ...options,
      strategy: input.context?.providerStrategy
    };
    return this.providerRouter.chat(prompt, combinedOptions);
  }

  protected async log(pipelineItemId: string, message: string, details?: unknown) {
    await DBService.logAudit({
      pipeline_item_id: pipelineItemId,
      workspace_id: "unknown", // Should be passed in or improved
      action: "AGENT_LOG",
      actor: this.name,
      details: { message, ...details }
    });
  }

  protected success(output: unknown, nextState?: PipelineState, artifact?: Partial<Artifact>, metadata?: unknown): AgentOutput {
    return {
      status: "success",
      output,
      nextState,
      artifact,
      metadata
    };
  }

  protected failure(error: unknown, metadata?: unknown): AgentOutput {
    return {
      status: "failed",
      output: error,
      metadata
    };
  }
}

export const BaseAgent = {} as any;
