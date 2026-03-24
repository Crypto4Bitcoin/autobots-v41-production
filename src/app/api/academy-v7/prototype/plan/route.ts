import { NextResponse } from "next/server"
import { PrototypePlannerService } from "@/lib/academy-v7/prototype-planner.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new PrototypePlannerService()
    const result = await service.plan(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
