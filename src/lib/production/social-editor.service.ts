import { MemoryStoreService } from "@/lib/academy/memory-store.service"
export class SocialEditorService {
  async editDraft(id: string) { return MemoryStoreService.updateSocialMemory(id, { status: "edited", description: "Edited and tightened for platform fit." }); }
  async sendToProduction(id: string) {
    const record = MemoryStoreService.updateSocialMemory(id, { status: "production_ready" }); if (!record) throw new Error("Social memory record not found");
    return MemoryStoreService.addProduction({ id: crypto.randomUUID(), socialMemoryId: record.id, platform: "youtube", title: record.title, description: record.description, hashtags: record.hashtags, status: "queued", createdAt: new Date().toISOString() });
  }
}
