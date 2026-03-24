import { AllocationRecord, RevenueRecord } from "./types"

export class RevenueStoreService {
  private static revenues: RevenueRecord[] = []
  private static allocations: AllocationRecord[] = []

  static addRevenue(record: RevenueRecord) {
    this.revenues.unshift(record)
    return record
  }

  static getRevenue() {
    return [...this.revenues]
  }

  static replaceAllocations(records: AllocationRecord[]) {
    this.allocations = [...records]
    return this.allocations
  }

  static getAllocations() {
    return [...this.allocations]
  }
}
