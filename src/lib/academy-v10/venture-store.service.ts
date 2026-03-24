import { VentureRecord } from "./types"

export class VentureStoreService {
  private static ventures: VentureRecord[] = []

  static add(record: VentureRecord) {
    this.ventures.unshift(record)
    return record
  }

  static list() {
    return [...this.ventures]
  }

  static update(id: string, patch: Partial<VentureRecord>) {
    this.ventures = this.ventures.map((v) => (v.id === id ? { ...v, ...patch } : v))
    return this.ventures.find((v) => v.id === id)
  }
}
