import { NextResponse } from "next/server"
import { BotPackagerService } from "@/lib/academy-v8/bot-packager.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new BotPackagerService()
    const result = await service.package(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
