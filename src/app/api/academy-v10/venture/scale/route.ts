import { NextResponse } from "next/server"
import { VentureScalingService } from "@/lib/academy-v10/venture-scaling.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new VentureScalingService()
    const result = await service.scale(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
