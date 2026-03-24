import { RecommendationResult, WorkflowTemplate } from "../types/assembly-types";
import { WorkflowMemoryService } from "./workflow-memory-service";

export class WorkflowRecommendationService {
  private static templates: WorkflowTemplate[] = [
    {
      id: "media-short-001",
      name: "Trend-to-Short Video",
      description: "Automated research, script, and video production for trending topics.",
      packSlug: "media",
      capabilityIds: ["search.web", "media.render", "social.publish"],
      suggestedDag: { nodes: ["discover", "script", "render", "publish"], edges: [] }
    },
    {
      id: "research-comp-001",
      name: "Competitor Intelligence",
      description: "Deep dive comparison of market competitors.",
      packSlug: "research",
      capabilityIds: ["search.web", "research.analyze", "slack.post"],
      suggestedDag: { nodes: ["discover", "analyze", "report", "deliver"], edges: [] }
    }
  ];

  /**
   * Recommends a workflow template or vertical pack based on a natural language goal.
   */
  static async recommend(goal: string, workspaceId: string = "default"): Promise<RecommendationResult[]> {
    const text = goal.toLowerCase();
    const results: RecommendationResult[] = [];
    
    // Fetch historical patterns for this workspace
    const patterns = await WorkflowMemoryService.getTopPatterns(workspaceId);

    // 1. Template Matches
    for (const template of this.templates) {
      if (text.includes(template.packSlug) || text.includes(template.name.toLowerCase())) {
        const history = patterns.find(p => p.id === template.id);
        const baseConfidence = 0.9;
        // Boost/Penalize based on historical success
        const scoreAdjust = history ? (history.successRate - 0.8) : 0;
        
        results.push({
          type: "template",
          targetId: template.id,
          displayName: template.name,
          reason: history && history.successRate > 0.9 
            ? `Top performing template in this category (${Math.round(history.successRate * 100)}% success).`
            : `Matches your interest in ${template.packSlug} automation.`,
          confidence: Math.min(1.0, baseConfidence + scoreAdjust)
        });
      }
    }

    // 2. Intent-Based Heuristics
    if (text.includes("build") || text.includes("assemble") || text.includes("custom")) {
       results.push({
         type: "assembly",
         displayName: "Custom DAG Assembly",
         reason: "You requested a custom builder experience.",
         confidence: 0.85
       });
    }

    if (results.length === 0) {
      results.push({
        type: "pack",
        targetId: "media",
        displayName: "Media Production Pack",
        reason: "Generic starting point for content workflows.",
        confidence: 0.5
      });
    }

    return results.sort((a,b) => b.confidence - a.confidence);
  }

  static getTemplate(id: string): WorkflowTemplate | null {
    return this.templates.find(t => t.id === id) || null;
  }
}
