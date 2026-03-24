import { NextResponse } from "next/server"
import { GlobalRoutingIntelligence } from "@/lib/services/global-routing-intelligence.service"
import { RegionAffinityEngine } from "@/lib/services/region-affinity-engine.service"

export async function POST() {
  try {
    const routing = new GlobalRoutingIntelligence()
    const affinity = new RegionAffinityEngine()

    const affinityResult = await affinity.evaluate({
      missionId: "mission-demo",
      preferredRegion: "us-east-1",
    })

    const decision = await routing.decide({
      missionId: "mission-demo",
      requestedRegion: affinityResult.primaryRegion,
      capability: "workflow_execution",
    })

    return NextResponse.json({ status: "success", affinity: affinityResult, decision })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}