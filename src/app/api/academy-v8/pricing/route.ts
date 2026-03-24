import { NextResponse } from "next/server"
import { PricingTierService } from "@/lib/academy-v8/pricing-tier.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new PricingTierService()
    const result = await service.choose(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
