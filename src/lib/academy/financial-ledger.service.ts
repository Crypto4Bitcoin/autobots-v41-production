import { CreditRecord } from "./types"
import { randomUUID } from "crypto"

export class FinancialLedgerService {
  private static ledger: CreditRecord[] = []
  private static balances: Record<string, number> = {}

  static async earn(entityId: string, amount: number, purpose: string) {
    this.record(entityId, amount, "earn", purpose)
  }

  static async spend(entityId: string, amount: number, purpose: string): Promise<boolean> {
    const balance = this.balances[entityId] || 0
    if (balance < amount) {
      console.warn(`[Ledger] Insufficient credits for ${entityId}: ${balance} < ${amount}`)
      return false
    }
    this.record(entityId, -amount, "spend", purpose)
    return true
  }

  static getBalance(entityId: string): number {
    return this.balances[entityId] || 0
  }

  private static record(entityId: string, amount: number, type: CreditRecord["type"], purpose: string) {
    const record: CreditRecord = {
      id: randomUUID(),
      entityId,
      amount,
      type,
      purpose,
      timestamp: new Date().toISOString(),
    }
    this.ledger.push(record)
    this.balances[entityId] = (this.balances[entityId] || 0) + amount
    console.log(`[Ledger] ${type}: ${entityId} | ${amount} credits | ${purpose}`)
  }

  static getHistory(entityId: string): CreditRecord[] {
    return this.ledger.filter(r => r.entityId === entityId)
  }
}
