import { NextResponse } from "next/server"
import { CrossVentureStrategyService } from "@/lib/academy-v10/cross-venture-strategy.service"

export async function POST() {
  try {
    const service = new CrossVentureStrategyService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
