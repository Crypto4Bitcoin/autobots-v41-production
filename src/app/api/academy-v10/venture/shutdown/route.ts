import { NextResponse } from "next/server"
import { VentureShutdownService } from "@/lib/academy-v10/venture-shutdown.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new VentureShutdownService()
    const result = await service.shutdown(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
