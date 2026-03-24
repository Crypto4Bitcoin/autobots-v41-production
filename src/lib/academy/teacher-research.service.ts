import { randomUUID } from "crypto"; import { AcademyRegistryService } from "./academy-registry.service"; import { MemoryStoreService } from "./memory-store.service"
export class TeacherResearchService {
  async performResearch(agentId: string) {
    const agents = AcademyRegistryService.getAllAgents(); const agent = agents.find((a) => a.id === agentId); if (!agent) throw new Error("Agent not found");
    AcademyRegistryService.updateAgent(agentId, { status: "researching" });
    const record = MemoryStoreService.addMemory({ id: randomUUID(), category: agent.category, title: `${agent.category.toUpperCase()} trend update`, summary: `${agent.name} researched new material for ${agent.category}.`, sourceUrl: "https://example.com/source", storedAt: new Date().toISOString(), confidence: 0.84 });
    AcademyRegistryService.updateAgent(agentId, { status: "idle", totalActions: agent.totalActions + 1, performanceScore: Math.min(1, agent.performanceScore + 0.01), learningScore: Math.min(1, agent.learningScore + 0.01), skillLevel: Math.min(10, agent.skillLevel + 0.05) });
    return record;
  }
}
