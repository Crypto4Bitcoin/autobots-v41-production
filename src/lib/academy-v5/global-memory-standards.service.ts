
import { randomUUID } from "crypto"
import { StandardizedMemoryPacket } from "./types"

export class GlobalMemoryStandardsService {
  private static packets: StandardizedMemoryPacket[] = []

  async standardize(input: Omit<StandardizedMemoryPacket, "id" | "standardizedAt">) {
    const packet: StandardizedMemoryPacket = {
      id: randomUUID(),
      sourceSchoolId: input.sourceSchoolId,
      category: input.category,
      schemaVersion: input.schemaVersion,
      packetType: input.packetType,
      payload: input.payload,
      standardizedAt: new Date().toISOString(),
    }

    GlobalMemoryStandardsService.packets.unshift(packet)
    return packet
  }

  async list() {
    return [...GlobalMemoryStandardsService.packets]
  }
}
