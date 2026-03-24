import { NextResponse } from "next/server"
import { EcosystemGrowthTeam } from "@/lib/omega/expansion/ecosystem-growth-team.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const team = new EcosystemGrowthTeam()
    const result = await team.review({
      id: body?.id ?? crypto.randomUUID(),
      name: body?.name ?? "Unnamed Submission",
      type: body?.type ?? "agent",
      source: body?.source ?? "unknown",
      risk: body?.risk ?? "low",
    })

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
