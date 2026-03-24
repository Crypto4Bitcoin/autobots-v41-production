import { DBService } from "./supabase-service";

export class MemoryService {
  static async recordPattern(workspaceId: string, category: string, key: string, data: unknown, performance?: unknown) {
    const { error } = await DBService.saveMemoryRecord({
      workspace_id: workspaceId,
      category,
      pattern_key: key,
      pattern_data: data,
      performance_metrics: performance || {}
    });
    
    if (error) console.error("[Memory] Failed to record pattern:", error);
  }

  static async getPatterns(workspaceId: string, category: string) {
    return await DBService.getMemoryRecords(workspaceId, category);
  }
}
