import { ImpactRecord, PrincipleRecord } from "./types"

export class ConstitutionalStoreService {
  private static principles: PrincipleRecord[] = []
  private static impacts: ImpactRecord[] = []

  static addPrinciple(record: PrincipleRecord) {
    this.principles.unshift(record)
    return record
  }

  static listPrinciples() {
    return [...this.principles]
  }

  static addImpact(record: ImpactRecord) {
    this.impacts.unshift(record)
    return record
  }

  static listImpacts() {
    return [...this.impacts]
  }
}
