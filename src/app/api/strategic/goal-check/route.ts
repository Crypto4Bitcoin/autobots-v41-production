import { NextResponse } from "next/server"
import { GoalConsistencyAnalyzer } from "@/lib/services/goal-consistency-analyzer.service"

export async function POST() {
  try {
    const analyzer = new GoalConsistencyAnalyzer()
    const result = await analyzer.analyze({
      proposalId: "proposal-demo",
      summary: "Increase performance by bypassing explanation layer",
      impacts: ["reduced legibility"],
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}