
import { NextResponse } from "next/server"
import { MarketConceptService } from "@/lib/academy-v6/market-concept.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new MarketConceptService()
    const result = await service.generateFromLatest(body.category)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
