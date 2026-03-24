import { NextResponse } from "next/server"
import { VentureCellService } from "@/lib/academy-v10/venture-cell.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new VentureCellService()
    const result = await service.create(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
