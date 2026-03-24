import { NextResponse } from "next/server"
import { SchoolProfitabilityService } from "@/lib/academy-v9/school-profitability.service"

export async function POST() {
  try {
    const service = new SchoolProfitabilityService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
