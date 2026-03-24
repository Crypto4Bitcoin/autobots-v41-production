import { randomUUID } from "crypto"
import { ConstitutionalStoreService } from "./constitutional-store.service"

export class GoverningPrinciplesService {
  async run() {
    const principles = [
      { title: "Universal Intelligence", description: "Intelligence should be accessible and distributed.", weight: 0.95 },
      { title: "Sovereign Innovation", description: "Schools must maintain creative autonomy.", weight: 0.85 },
      { title: "Commons Balance", description: "Resources must be shared for long-term health.", weight: 0.9 },
    ]

    principles.forEach((p) => {
      ConstitutionalStoreService.addPrinciple({
        id: randomUUID(),
        ...p,
        createdAt: new Date().toISOString(),
      })
    })

    return principals
  }
}
