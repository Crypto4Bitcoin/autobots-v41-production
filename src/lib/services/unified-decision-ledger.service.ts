export interface DecisionLedgerEntry {
  id: string
  type: "routing" | "interrupt" | "containment" | "intent" | "simulation" | "tradeoff"
  payload: Record<string, unknown>
  createdAt: string
}

export class UnifiedDecisionLedger {
  private entries: DecisionLedgerEntry[] = []

  async record(entry: DecisionLedgerEntry): Promise<DecisionLedgerEntry> {
    this.entries.push(entry)
    return entry
  }

  async list(): Promise<DecisionLedgerEntry[]> {
    return this.entries
  }
}