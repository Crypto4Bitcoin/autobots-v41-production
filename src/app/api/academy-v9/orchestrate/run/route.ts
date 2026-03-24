import { NextResponse } from "next/server"
import { AcademyV9OrchestratorService } from "@/lib/academy-v9/orchestrator.service"

export async function POST() {
  try {
    const service = new AcademyV9OrchestratorService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
