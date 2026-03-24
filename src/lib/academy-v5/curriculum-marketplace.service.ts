
import { randomUUID } from "crypto"
import { MarketplacePacket } from "./types"

export class CurriculumMarketplaceService {
  private static packets: MarketplacePacket[] = []

  async publish(input: Omit<MarketplacePacket, "id" | "createdAt" | "rating">) {
    const packet: MarketplacePacket = {
      id: randomUUID(),
      schoolId: input.schoolId,
      category: input.category,
      title: input.title,
      summary: input.summary,
      type: input.type,
      priceWeight: input.priceWeight,
      rating: 0.75,
      createdAt: new Date().toISOString(),
    }

    CurriculumMarketplaceService.packets.unshift(packet)
    return packet
  }

  async list() {
    return [...CurriculumMarketplaceService.packets]
  }
}
