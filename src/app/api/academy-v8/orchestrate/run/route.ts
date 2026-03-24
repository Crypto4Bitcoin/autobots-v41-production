import { NextResponse } from "next/server"
import { AcademyV8OrchestratorService } from "@/lib/academy-v8/orchestrator.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new AcademyV8OrchestratorService()
    const result = await service.run({
      prototypeId: body.prototypeId ?? "proto-v8-demo",
      title: body.title ?? "AI Marketplace Bot Product",
      category: body.category ?? "ai",
      prototypeScore: body.prototypeScore ?? 0.84,
    })
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
