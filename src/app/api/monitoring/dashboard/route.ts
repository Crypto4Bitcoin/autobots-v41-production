import { NextResponse } from "next/server"
import { AgentMonitoringService } from "@/lib/monitoring/agent-monitoring.service"

export async function GET() {
  try {
    const service = new AgentMonitoringService()
    const result = await service.getDashboardState()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}