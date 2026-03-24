import { CommonsShareRecord, ReputationRecord } from "./types"

export class CommonsStoreService {
  private static shares: CommonsShareRecord[] = []
  private static reputations: ReputationRecord[] = []

  static addShare(record: CommonsShareRecord) {
    this.shares.unshift(record)
    return record
  }

  static listShares() {
    return [...this.shares]
  }

  static replaceReputations(records: ReputationRecord[]) {
    this.reputations = [...records]
    return this.reputations
  }

  static listReputations() {
    return [...this.reputations]
  }
}
