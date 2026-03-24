import { NextResponse } from "next/server"
import { RevenueIntelligenceService } from "@/lib/academy-v9/revenue-intelligence.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new RevenueIntelligenceService()
    const result = await service.ingest(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
