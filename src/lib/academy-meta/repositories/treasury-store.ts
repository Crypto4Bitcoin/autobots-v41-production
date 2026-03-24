export class TreasuryStore {
  private records: unknown[] = [];
  async add(record: unknown) { this.records.push(record); return record; }
  async getAll() { return this.records; }
}
export const treasuryStore = new TreasuryStore();
