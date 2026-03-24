import { NextResponse } from "next/server"
import { AcademyV10OrchestratorService } from "@/lib/academy-v10/orchestrator.service"

export async function POST() {
  try {
    const service = new AcademyV10OrchestratorService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
