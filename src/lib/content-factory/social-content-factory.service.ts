import { randomUUID } from "crypto"; import { MemoryStoreService } from "@/lib/academy/memory-store.service"
export class SocialContentFactoryService {
  async buildFromCategory(category: string) {
    const source = MemoryStoreService.getMemory(category)[0]; if (!source) throw new Error("No source memory found");
    return MemoryStoreService.addSocialMemory({ id: randomUUID(), category, title: `Why ${category} is moving right now`, description: `Quick breakdown based on the latest ${category} memory packet.`, hashtags: [`#${category}`, "#shorts", "#trending"], imagePrompt: `Create a cinematic vertical cover image for ${category}`, videoScript: `Hook: Here is what is happening in ${category} right now...`, status: "draft", createdAt: new Date().toISOString() });
  }
}
