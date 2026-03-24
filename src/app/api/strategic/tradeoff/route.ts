import { NextResponse } from "next/server"
import { TradeoffTransparencyEngine } from "@/lib/services/tradeoff-transparency-engine.service"

export async function POST() {
  try {
    const engine = new TradeoffTransparencyEngine()
    const result = await engine.explain({
      decisionId: "decision-demo",
      selectedOption: "Regional reroute",
      sacrificed: ["latency"],
      reason: "resilience priority was higher than latency priority",
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}