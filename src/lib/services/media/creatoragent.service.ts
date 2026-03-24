import { TrendSearchAgent } from "./trendsearchagent.service";
import { TopicSelectionAgent } from "./topicselectionagent.service";
import { ResearchAgent } from "./researchagent.service";
import { ScriptWriterAgent } from "./scriptwriteragent.service";
import { HookEngineerAgent } from "./hookengineeragent.service";
import { VoiceoverAgent } from "./voiceoveragent.service";
import { VisualComposerAgent } from "./visualcomposeragent.service";
import { CaptionOverlayAgent } from "./captionoverlayagent.service";
import { ShortsFormatterAgent } from "./shortsformatteragent.service";
import { SEOAgent } from "./seoagent.service";
import { UploadAgent } from "./uploadagent.service";
import { AnalyticsAgent } from "./analyticsagent.service";
import { ArchiveAgent } from "./archiveagent.service";

export class CreatorAgent {
  static async handleCommand(command: string) {
    console.log(`[CreatorAgent] Processing command: "${command}"`);
    
    // Simple intent parsing
    const cmdLower = command.toLowerCase();
    const isCreateRequest = cmdLower.includes("create") || cmdLower.includes("make") || cmdLower.includes("short") || cmdLower.includes("reel");
    
    if (!isCreateRequest) {
      return { status: "ignored", message: "Not a creation command." };
    }

    const topic = command.replace(/create|make|video|about|30 second|1 minute|short|reel|shorts|reels/gi, "").trim();
    console.log(`[CreatorAgent] Target Topic: ${topic}`);

    const workflow = [
        { id: "SEARCH", agent: TrendSearchAgent, payload: { topic } },
        { id: "SELECT", agent: TopicSelectionAgent, payload: {} },
        { id: "RESEARCH", agent: ResearchAgent, payload: { topic } },
        { id: "SCRIPT", agent: ScriptWriterAgent, payload: {} },
        { id: "HOOK", agent: HookEngineerAgent, payload: {} },
        { id: "VOICEOVER", agent: VoiceoverAgent, payload: {} },
        { id: "VISUALS", agent: VisualComposerAgent, payload: {} },
        { id: "CAPTIONS", agent: CaptionOverlayAgent, payload: {} },
        { id: "FORMAT", agent: ShortsFormatterAgent, payload: {} },
        { id: "SEO", agent: SEOAgent, payload: {} },
        { id: "UPLOAD", agent: UploadAgent, payload: {} },
        { id: "ANALYTICS", agent: AnalyticsAgent, payload: {} },
        { id: "ARCHIVE", agent: ArchiveAgent, payload: {} }
    ];

    const results = [];
    for (const step of workflow) {
        const result = await step.agent.run(step.payload);
        results.push({ step: step.id, ...result });
    }

    return {
      status: "success",
      topic,
      workflow_results: results
    };
  }
}
