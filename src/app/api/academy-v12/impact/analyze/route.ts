import { NextResponse } from "next/server"
import { ImpactIntelligenceService } from "@/lib/academy-v12/impact-intelligence.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new ImpactIntelligenceService()
    const result = await service.analyze(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
