// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MemoryRecord, SchoolRecord } from "./types"
import { FinancialLedgerService } from "./financial-ledger.service"
import { randomUUID } from "crypto"

export interface IntelligenceDeal {
  id: string
  sourceSchoolId: string
  targetSchoolId: string
  memoryRecordIds: string[]
  price: number
  status: "pending" | "completed" | "rejected"
}

export class DiplomaticExchangeService {
  private static deals: IntelligenceDeal[] = []

  static async proposeDeal(deal: Omit<IntelligenceDeal, "id" | "status">): Promise<IntelligenceDeal> {
    const newDeal: IntelligenceDeal = {
      ...deal,
      id: randomUUID(),
      status: "pending"
    }
    this.deals.push(newDeal)
    console.log(`[Diplomacy] New deal proposed: ${newDeal.id} from ${deal.sourceSchoolId} to ${deal.targetSchoolId}`)
    return newDeal
  }

  static async acceptDeal(dealId: string): Promise<boolean> {
    const deal = this.deals.find(d => d.id === dealId)
    if (!deal || deal.status !== "pending") return false

    // Target pays, source earns
    const paymentSuccess = await FinancialLedgerService.spend(
      deal.targetSchoolId, 
      deal.price, 
      `Purchase of intelligence ${deal.id}`
    )

    if (paymentSuccess) {
      await FinancialLedgerService.earn(
        deal.sourceSchoolId,
        deal.price,
        `Sale of intelligence ${deal.id}`
      )
      deal.status = "completed"
      console.log(`[Diplomacy] Deal completed: ${dealId}`)
      return true
    }

    deal.status = "rejected"
    return false
  }

  static getDealsForSchool(schoolId: string): IntelligenceDeal[] {
    return this.deals.filter(d => d.sourceSchoolId === schoolId || d.targetSchoolId === schoolId)
  }
}
