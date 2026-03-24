import { PrototypeArchiveRecord } from "./types"

export class PrototypeArchiveService {
  private static items: PrototypeArchiveRecord[] = []

  static add(record: PrototypeArchiveRecord) {
    this.items.unshift(record)
    return record
  }

  static list() {
    return [...this.items]
  }
}
