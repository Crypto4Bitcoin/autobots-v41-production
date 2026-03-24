import { randomUUID } from "crypto"
import { VentureRecord } from "./types"
import { VentureStoreService } from "./venture-store.service"

export class VentureCellService {
  async create(input: { name: string; products: string[]; strategyScore?: number }) {
    const record: VentureRecord = {
      id: randomUUID(),
      name: input.name,
      products: input.products,
      status: "active",
      strategyScore: input.strategyScore ?? 0.68,
      createdAt: new Date().toISOString(),
    }

    return VentureStoreService.add(record)
  }
}
