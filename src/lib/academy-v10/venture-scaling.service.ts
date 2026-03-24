import { VentureStoreService } from "./venture-store.service"

export class VentureScalingService {
  async scale(input: { ventureId: string }) {
    const venture = VentureStoreService.update(input.ventureId, { status: "scaling" })
    return venture
  }
}
