import { NextResponse } from "next/server"
import { GlobalResourceSteward } from "@/lib/services/omega/global-resource-steward.service"
import { AtmosphericImpactMonitor } from "@/lib/services/omega/atmospheric-impact-monitor.service"

export async function POST(req: Request) {
  try {
    const { resourceId, type, usage, capacity, intensity } = await req.json()
    const steward = new GlobalResourceSteward()
    const monitor = new AtmosphericImpactMonitor()

    await steward.track({ resourceId, type, usage, capacity, intensity })
    const globalUsage = await steward.getGlobalUsage()
    const footprint = await monitor.calculateFootprint(usage, intensity)

    return NextResponse.json({ status: "success", resourceId, usage, globalUsage, footprint })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Metric recording failed" }, { status: 500 })
  }
}