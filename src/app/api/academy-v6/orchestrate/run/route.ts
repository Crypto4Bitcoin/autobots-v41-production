
import { NextResponse } from "next/server"
import { AcademyV6OrchestratorService } from "@/lib/academy-v6/orchestrator.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new AcademyV6OrchestratorService()
    const result = await service.run(body.category || "ai")
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
