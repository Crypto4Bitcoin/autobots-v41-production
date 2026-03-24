import { NextResponse } from "next/server"
import { InterruptPriorityBus } from "@/lib/services/interrupt-priority-bus.service"

export async function POST() {
  try {
    const bus = new InterruptPriorityBus()
    const result = await bus.dispatch({
      target: "evolution",
      level: "pause",
      reason: "Operator issued emergency brake.",
      issuedBy: "operator-console",
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}