import { NextResponse } from "next/server"
import { MarketValidationService } from "@/lib/academy-v7/market-validation.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new MarketValidationService()
    const result = await service.validate(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
