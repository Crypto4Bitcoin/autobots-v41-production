import { Agent, AgentInput, AgentOutput } from "../types/agent-types";
import { SearchService } from "../services/search-service";

export class TrendScoutAgent implements Agent {
  name = "TrendScoutAgent";
  description = "Researches real-time internet trends using Bing/Search services.";
  pack = "media"; // Vertical: Media Automation Pack

  async process(input: AgentInput): Promise<AgentOutput> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = input.payload as any;
    const topic = payload.topic || "AI and productivity";
    console.log(`[TrendScoutAgent] Researching latest trends for: ${topic}`);

    const searchResults = await SearchService.search(topic);

    return {
      status: "success",
      output: { 
        topic,
        topTrends: searchResults.map(r => r.title),
        sources: searchResults.map(r => r.url)
      },
      artifact: {
        type: "trend_report",
        data: { searchResults }
      }
    };
  }
}
