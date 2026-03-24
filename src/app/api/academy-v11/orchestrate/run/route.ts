import { NextResponse } from "next/server"
import { AcademyV11OrchestratorService } from "@/lib/academy-v11/orchestrator.service"

export async function POST() {
  try {
    const service = new AcademyV11OrchestratorService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
