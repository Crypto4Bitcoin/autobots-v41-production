import { NextResponse } from "next/server"
import { IncubationGovernorService } from "@/lib/academy-v7/incubation-governor.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new IncubationGovernorService()
    const result = await service.govern(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
