import { AcademyRegistryService } from "@/lib/academy/academy-registry.service"; import { MemoryStoreService } from "@/lib/academy/memory-store.service"
export class AgentMonitoringService {
  async getDashboardState() {
    const agents = AcademyRegistryService.getAllAgents();
    return { generatedAt: new Date().toISOString(), totalAgents: agents.length, activeAgents: agents.filter((a) => a.status !== "idle").length, avgLearningScore: agents.reduce((sum, a) => sum + a.learningScore, 0) / agents.length, avgPerformanceScore: agents.reduce((sum, a) => sum + a.performanceScore, 0) / agents.length, agents, memoryCount: MemoryStoreService.getMemory().length, socialDraftCount: MemoryStoreService.getSocialMemory("draft").length, socialEditedCount: MemoryStoreService.getSocialMemory("edited").length, productionQueuedCount: MemoryStoreService.getProduction("queued").length };
  }
}
