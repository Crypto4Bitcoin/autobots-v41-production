import { randomUUID } from "crypto"
import { CommonsStoreService } from "./commons-store.service"

export class ReputationSystemService {
  async run() {
    const shares = CommonsStoreService.listShares()
    const schools = [...new Set(shares.flatMap((x) => [x.source, x.target]))]

    const reps = schools.map((schoolId, idx) => ({
      id: randomUUID(),
      schoolId,
      score: Number((0.55 + idx * 0.08).toFixed(2)),
      createdAt: new Date().toISOString(),
    }))

    CommonsStoreService.replaceReputations(reps)
    return reps
  }
}
