import { z } from "zod";
import { PipelineState } from "../types/enums";
import { 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  WorkspacePolicyConfig, 
  AgentExecutionContext, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  AgentInput 
} from "../types/agent-types";
import { TuningMetrics } from "./optimization-service";

export const WorkspacePolicySchema = z.object({
  providerStrategyDefault: z.enum(["cheap_first", "balanced", "quality_first"]).default("balanced"),
  complianceModeDefault: z.enum(["standard", "strict"]).default("standard"),
  mandatoryReviewPlatforms: z.array(z.string()).default([]),
  sensitiveKeywordRules: z.object({
    forceReview: z.boolean().default(true),
    keywords: z.array(z.string()).default([])
  }).default({
    forceReview: true,
    keywords: []
  }),
  queueLoadRules: z.object({
    skipOptionalStagesAboveDepth: z.number().nullable().default(null),
    optionalStages: z.array(z.nativeEnum(PipelineState)).default([])
  }).default({
    skipOptionalStagesAboveDepth: null,
    optionalStages: []
  })
});

export class PolicyService {
  static getExecutionContext(params: {
    workspacePolicy: unknown;
    itemMetadata: unknown;
    targetState: PipelineState;
    queueDepth: number;
    contentPreview?: string;
    tuningMetrics?: TuningMetrics | null
  }): AgentExecutionContext {
    const policy = WorkspacePolicySchema.parse(params.workspacePolicy);
    const item = params.itemMetadata;
    const tuning = params.tuningMetrics;
    
    const context: AgentExecutionContext = {
      policyFlags: [],
      providerStrategy: policy.providerStrategyDefault,
      requiresHumanReview: false,
      skipOptionalStages: false,
      complianceMode: policy.complianceModeDefault,
      riskLevel: "low",
      reasonCodes: []
    };

    // 1. Cost Routing logic
    if (item.cost_mode === "eco") {
      context.providerStrategy = "cheap_first";
      context.reasonCodes.push("cost_mode_eco");
    }

    // 2. Performance Tuning Bias
    // If we're in a high-stakes run but a provider is underperforming, boost to quality
    if (tuning?.recommendedBias) {
      // Find which agents are involved in this targetState (simplification)
      // If any relevant bias is 'demote', and we were at 'balanced', move to 'quality_first'
      if (Object.values(tuning.recommendedBias).includes("demote") && context.providerStrategy === "balanced") {
        context.providerStrategy = "quality_first";
        context.reasonCodes.push("performance_demotion_fallback");
      }
    }

    // 3. Review & Compliance Triggers
    // Platform-based
    if (item.platform && policy.mandatoryReviewPlatforms.includes(item.platform)) {
      context.requiresHumanReview = true;
      context.riskLevel = "high";
      context.reasonCodes.push("platform_requires_review");
    }

    // Keyword-based
    if (params.contentPreview && policy.sensitiveKeywordRules.keywords.length > 0) {
      const hasSensitive = policy.sensitiveKeywordRules.keywords.some(k => 
        params.contentPreview?.toLowerCase().includes(k.toLowerCase())
      );
      if (hasSensitive && policy.sensitiveKeywordRules.forceReview) {
        context.requiresHumanReview = true;
        context.riskLevel = "high";
        context.reasonCodes.push("sensitive_keyword_match");
      }
    }

    // 3. Queue Load & Skipping
    if (policy.queueLoadRules.skipOptionalStagesAboveDepth !== null && 
        params.queueDepth > policy.queueLoadRules.skipOptionalStagesAboveDepth) {
      if (policy.queueLoadRules.optionalStages.includes(params.targetState)) {
        context.skipOptionalStages = true;
        context.reasonCodes.push("queue_depth_high");
      }
    }

    // 4. Final Risk Level Adjustment
    if (context.requiresHumanReview) {
      context.policyFlags.push("STRICT_COMPLIANCE");
    }
    if (context.providerStrategy === "cheap_first") {
      context.policyFlags.push("ECONOMY_MODE");
    }

    return context;
  }
}
