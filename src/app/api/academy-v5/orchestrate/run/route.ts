
import { NextResponse } from "next/server"
import { AcademyV5OrchestratorService } from "@/lib/academy-v5/orchestrator.service"

export async function POST() {
  try {
    const svc = new AcademyV5OrchestratorService()
    const result = await svc.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
