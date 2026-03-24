import { VentureStoreService } from "./venture-store.service"

export class VentureShutdownService {
  async shutdown(input: { ventureId: string }) {
    const venture = VentureStoreService.update(input.ventureId, { status: "shutdown" })
    return venture
  }
}
