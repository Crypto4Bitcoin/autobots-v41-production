import { NextResponse } from "next/server"
import { StrategicObjectiveSimulator } from "@/lib/services/strategic-objective-simulator.service"

export async function POST() {
  try {
    const simulator = new StrategicObjectiveSimulator()
    const result = await simulator.simulate({
      proposalId: "proposal-demo",
      horizonCycles: 10,
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}