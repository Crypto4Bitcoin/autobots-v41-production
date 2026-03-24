import { NextResponse } from "next/server"
import { InnovationCommonsService } from "@/lib/academy-v11/innovation-commons.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new InnovationCommonsService()
    const result = await service.share(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
