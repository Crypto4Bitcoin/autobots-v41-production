import { NextResponse } from "next/server"
import { AcademyV7OrchestratorService } from "@/lib/academy-v7/orchestrator.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new AcademyV7OrchestratorService()
    const result = await service.run({
      conceptId: body.conceptId ?? "concept-demo-v7",
      category: body.category ?? "ai",
      title: body.title ?? "AI Marketplace Bot Prototype",
    })
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
