import { MemoryStoreService } from "@/lib/academy/memory-store.service"
export class AutoPosterService { async queueAllReady() { return MemoryStoreService.getProduction("queued").map((item) => ({ ...item, status: "scheduled" as const, scheduledAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() })); } }
